import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SchedulerService, PrismaService],
  imports: [ScheduleModule.forRoot()],
})
export class SchedulerModule {}
