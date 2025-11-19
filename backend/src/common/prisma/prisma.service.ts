import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Database connected successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Failed to connect to database: ${errorMessage}`,
        errorStack,
      );
      // No lanzar error, permitir que la app continúe
      // Las queries fallarán si no hay BD, pero esto es mejor que un crash
      this.logger.warn('Continuing without database connection. Some features may not work.');
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}
