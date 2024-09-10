import { Module } from '@nestjs/common';
import { ApiKeyManagerService } from './api-key-manager.service';
import { ApiKeyManagerController } from './api-key-manager.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CachingService } from '@hakimamarullah/commonbundle-nestjs';

@Module({
  providers: [ApiKeyManagerService, CachingService, PrismaService],
  controllers: [ApiKeyManagerController],
  exports: [ApiKeyManagerService],
})
export class ApiKeyManagerModule {}
