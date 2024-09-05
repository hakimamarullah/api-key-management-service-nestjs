import { Injectable, Logger } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import * as process from 'process';
import { HttpClientService } from '../http-client/http-client.service';
import { AppPropertiesService } from '../app-properties/app-properties.service';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger(JwtConfigService.name);
  constructor(
    private httpClient: HttpClientService,
    private appProperties: AppPropertiesService,
  ) {}

  async createJwtOptions(): Promise<JwtModuleOptions> {
    const config = await this.loadJwtOptions();
    if (!config.secret || !config.signOptions) {
      this.logger.fatal('JWT_SECRET or JWT_EXPIRES is not defined');
      process.exit(1);
    }
    return config;
  }

  async loadJwtOptions(): Promise<JwtModuleOptions> {
    const baseUrl = this.appProperties.getAuthServiceBaseUrl();
    const { responseData } = (await this.httpClient.get(
      `${baseUrl}/jwt/config`,
    )) as any;
    return responseData as JwtModuleOptions;
  }
}
