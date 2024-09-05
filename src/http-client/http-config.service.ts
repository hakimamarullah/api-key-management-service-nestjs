import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    const options: HttpModuleOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.get<string>('AUTH_SERVICE_TOKEN')}`,
      },
      timeout: 10000,
    };
    return options;
  }
}
