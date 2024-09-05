import { Module } from '@nestjs/common';
import { CachingModule } from './caching/caching.module';
import { ApiKeyManagerModule } from './api-key-manager/api-key-manager.module';
import { PrismaModule } from './prisma/prisma.module';
import { HttpClientModule } from './http-client/http-client.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpClientService } from './http-client/http-client.service';
import { JwtConfigService } from './auth/jwt-config.service';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { CachingService } from './caching/caching.service';

@Module({
  imports: [
    CachingModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ApiKeyManagerModule,
    PrismaModule,
    HttpClientModule,
    JwtModule.registerAsync({
      imports: [HttpClientModule, AuthModule, HttpModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService, HttpClientService],
    }),
  ],
  providers: [
    PrismaService,
    CachingService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
