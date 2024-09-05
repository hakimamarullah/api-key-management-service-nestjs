import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from './http-config.service';
import { AppPropertiesService } from '../app-properties/app-properties.service';
import { AppPropertiesModule } from '../app-properties/app-properties.module';

@Module({
  providers: [HttpClientService, HttpConfigService, AppPropertiesService],
  imports: [
    HttpModule.registerAsync({
      imports: [AppPropertiesModule],
      useClass: HttpConfigService,
      inject: [AppPropertiesService],
    }),
  ],
  exports: [HttpClientService],
})
export class HttpClientModule {}
