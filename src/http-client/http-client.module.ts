import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from './http-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [HttpClientService, HttpConfigService, ConfigService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useClass: HttpConfigService,
      inject: [ConfigService],
    }),
  ],
  exports: [HttpClientService],
})
export class HttpClientModule {}
