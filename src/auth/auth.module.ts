import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpClientModule } from '../http-client/http-client.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpConfigService } from '../http-client/http-config.service';

@Module({
  providers: [JwtConfigService, HttpClientService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useClass: HttpConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [HttpClientModule, AuthModule, HttpModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService, HttpClientService],
    }),
  ],
})
export class AuthModule {}
