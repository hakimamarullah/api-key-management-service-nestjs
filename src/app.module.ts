import { Module } from '@nestjs/common';
import { ApiKeyManagerModule } from './api-key-manager/api-key-manager.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AppPropertiesModule } from './app-properties/app-properties.module';
import {
  AuthGuard,
  AuthModule,
  CachingModule,
  CachingService,
  JwtConfigService,
} from '@hakimamarullah/commonbundle-nestjs';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    CachingModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ApiKeyManagerModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [AuthModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService],
    }),
    AppPropertiesModule,
    SchedulerModule,
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
