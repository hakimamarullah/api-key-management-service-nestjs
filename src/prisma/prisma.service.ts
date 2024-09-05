import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import process from 'process';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly maxRetries: number;
  private readonly delay: number;
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    super();

    this.maxRetries = this.configService.get('PRISMA_MAX_RETRIES', 5);
    this.delay = this.configService.get('PRISMA_RETRY_INTERVAL', 2000);
  }

  async onModuleInit(): Promise<void> {
    await this.retryConnect();
  }

  private async retryConnect(attempts: number = 1): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Database connection successful');
    } catch (error) {
      this.logger.warn(`Attempt ${attempts} failed. Trying again...`);
      if (attempts < this.maxRetries) {
        this.logger.log(`Retrying in ${this.delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, this.delay));
        await this.retryConnect(attempts + 1);
      } else {
        this.logger.error(
          'Max retries reached. Could not connect to the database.',
          error,
        );
        process.exit(1);
      }
    }
  }
}
