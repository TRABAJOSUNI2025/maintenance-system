import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  @Get('users')
  async getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.adminService.getUsers(Number(page), Number(limit));
    return { success: true, data: result };
  }

  @Get('vehicles')
  async getVehicles(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.adminService.getVehicles(Number(page), Number(limit));
    return { success: true, data: result };
  }

  @Get('maintenance')
  async getMaintenance(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.adminService.getMaintenanceList(Number(page), Number(limit));
    return { success: true, data: result };
  }

  @Get('tickets')
  async getTickets(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.adminService.getTicketsList(Number(page), Number(limit));
    return { success: true, data: result };
  }
}
