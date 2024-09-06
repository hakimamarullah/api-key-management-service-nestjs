import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheConstant } from './cache.constant';

export declare interface CacheOptions {
  persist?: boolean;
}

@Injectable()
export class CachingService {
  private logger: Logger = new Logger(CachingService.name);
  private ttl = 60 * 60 * 24;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getDataOrElseGet(
    key: string,
    defaultGetter: () => any,
    options?: CacheOptions,
  ): Promise<any> {
    let data;
    const { persist = true } = options ?? {};
    try {
      data = (await this.cacheManager.get(key)) as any;
      if (!data && defaultGetter) {
        data = await defaultGetter();
        if (data && persist) {
          await this.cacheManager.set(key, data);
        }
      }
    } catch (error) {
      this.logger.debug(`Error getting data from cache`, error);
    }
    return data;
  }

  async getDataOrThrow(
    key: string,
    defaultGetter: () => any,
    options?: CacheOptions,
  ): Promise<any> {
    const data = await this.getDataOrElseGet(key, defaultGetter, options);
    if (!data) {
      throw new Error(`${key} not found`);
    }
    return data;
  }
  async setRoles(userId: any, roles: string[] | undefined) {
    return await this.set<string[]>(
      `${CacheConstant.CacheKey.ROLES}_${userId}`,
      roles ?? [],
      this.ttl,
    );
  }

  async getRolesByUserId(userId: any) {
    return await this.wrapper(() =>
      this.get<string[]>(`${CacheConstant.CacheKey.ROLES}_${userId}`),
    );
  }
  async get<T>(key: string) {
    return await this.wrapper(() => this.cacheManager.get<T>(key));
  }

  async set<T>(key: string, value: T, ttl?: number) {
    return await this.wrapper(() =>
      this.cacheManager.set(key, value, ttl ?? this.ttl),
    );
  }

  async del(key: string) {
    return await this.wrapper(() => this.cacheManager.del(key));
  }

  async reset() {
    return await this.wrapper(() => this.cacheManager.reset());
  }

  private async wrapper<T>(fn: () => Promise<T>) {
    try {
      return await fn();
    } catch (error) {
      this.logger.debug(error);
    }
    return undefined;
  }
}
