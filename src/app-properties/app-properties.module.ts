import { Module } from '@nestjs/common';
import { AppPropertiesService } from './app-properties.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AppPropertiesService, ConfigService],
  exports: [AppPropertiesService],
})
export class AppPropertiesModule {}
