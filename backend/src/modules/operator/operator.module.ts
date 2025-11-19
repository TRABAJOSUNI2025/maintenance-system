import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OperatorController } from './operator.controller';
import { OperatorService } from './operator.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [OperatorController],
  providers: [OperatorService, PrismaService],
})
export class OperatorModule {}
