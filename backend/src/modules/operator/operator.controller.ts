import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OperatorService } from './operator.service';

@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    const userId = req.user.sub;
    return this.operatorService.getOperatorProfile(userId);
  }

  @Get('assigned-tickets')
  @UseGuards(JwtAuthGuard)
  async getAssignedTickets(@Request() req: any) {
    const userId = req.user.sub;
    return this.operatorService.getAssignedTickets(userId);
  }

  @Get('maintenance-performed')
  @UseGuards(JwtAuthGuard)
  async getMaintenancePerformed(@Request() req: any) {
    const userId = req.user.sub;
    return this.operatorService.getMaintenancePerformed(userId);
  }

  @Get('diagnostics-performed')
  @UseGuards(JwtAuthGuard)
  async getDiagnosticsPerformed(@Request() req: any) {
    const userId = req.user.sub;
    return this.operatorService.getDiagnosticsPerformed(userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: any) {
    const userId = req.user.sub;
    return this.operatorService.getOperatorStats(userId);
  }

  @Get('recent-work')
  @UseGuards(JwtAuthGuard)
  async getRecentWork(@Request() req: any) {
    const userId = req.user.sub;
    return this.operatorService.getRecentWork(userId);
  }
}
