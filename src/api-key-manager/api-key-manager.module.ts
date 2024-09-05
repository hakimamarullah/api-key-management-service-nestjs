import { Module } from '@nestjs/common';
import { ApiKeyManagerService } from './api-key-manager.service';
import { ApiKeyManagerController } from './api-key-manager.controller';

@Module({
  providers: [ApiKeyManagerService],
  controllers: [ApiKeyManagerController],
})
export class ApiKeyManagerModule {}
