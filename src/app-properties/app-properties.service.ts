import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppPropertiesService {
  constructor(private configService: ConfigService) {}

  public getAuthServiceBaseUrl() {
    return this.configService.get('AUTH_SERVICE_URL', 'http://localhost:3001');
  }
  public getAuthServiceToken() {
    return this.configService.get('AUTH_SERVICE_TOKEN', 'token');
  }

  public getAuthServiceHttpTimeout() {
    return this.configService.get<number>('AUTH_SERVICE_HTTP_TIMEOUT', 10000);
  }
}
