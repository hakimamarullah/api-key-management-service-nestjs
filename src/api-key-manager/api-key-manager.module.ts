import { Module } from '@nestjs/common';
import { ApiKeyManagerService } from './api-key-manager.service';
import { ApiKeyManagerController } from './api-key-manager.controller';
import { CachingService } from '../caching/caching.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ApiKeyManagerService, CachingService, PrismaService],
  controllers: [ApiKeyManagerController],
  exports: [ApiKeyManagerService],
})
export class ApiKeyManagerModule {}
