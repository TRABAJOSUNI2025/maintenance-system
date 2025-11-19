import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService, PrismaService],
})
export class ClientModule {}
