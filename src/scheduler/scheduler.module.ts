import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SchedulerService, PrismaService],
})
export class SchedulerModule {}
