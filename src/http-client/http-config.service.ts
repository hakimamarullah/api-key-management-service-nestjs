import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { AppPropertiesService } from '../app-properties/app-properties.service';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private appProperties: AppPropertiesService) {}

  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.appProperties.getAuthServiceToken()}`,
      },
      timeout: 10000,
    };
  }
}
