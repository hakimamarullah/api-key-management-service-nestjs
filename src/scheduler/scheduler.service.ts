import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiKeyStatus } from '@prisma/client';

@Injectable()
export class SchedulerService {
  private logger: Logger = new Logger(SchedulerService.name);
  constructor(private prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateExpiredApiKeys() {
    const now = new Date();
    this.logger.log(`Updating expired API keys... Date: ${now}`);

    const { count } = await this.prismaService.apiKey.updateMany({
      where: {
        expiredAt: {
          lt: now,
        },
        status: ApiKeyStatus.ACTIVE, // Only update active keys
      },
      data: {
        status: ApiKeyStatus.INACTIVE,
      },
    });

    this.logger.log(
      `Expired API keys have been updated to INACTIVE. ${count} Data Updated`,
    );
  }
}
