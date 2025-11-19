import { Controller, Get, Post, UseGuards, Request, HttpCode, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  /**
   * Obtener perfil del cliente
   * GET /client/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Perfil del cliente obtenido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getProfile(@Request() req: any) {
    return await this.clientService.getClientProfile(req.user.sub);
  }

  /**
   * Obtener vehículos del cliente
   * GET /client/vehicles
   */
  @Get('vehicles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Vehículos del cliente obtenidos exitosamente',
  })
  async getVehicles(@Request() req: any) {
    return await this.clientService.getClientVehicles(req.user.sub);
  }

  /**
   * Obtener mantenimientos correctivos
   * GET /client/maintenance-correctivo
   */
  @Get('maintenance-correctivo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Mantenimientos correctivos obtenidos',
  })
  async getMaintenanceCorrectivo(@Request() req: any) {
    return await this.clientService.getMaintenanceCorrectivo(req.user.sub);
  }

  /**
   * Obtener mantenimientos preventivos
   * GET /client/maintenance-preventivo
   */
  @Get('maintenance-preventivo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Mantenimientos preventivos obtenidos',
  })
  async getMaintenancePreventivo(@Request() req: any) {
    return await this.clientService.getMaintenancePreventivo(req.user.sub);
  }

  /**
   * Obtener diagnósticos del cliente
   * GET /client/diagnostics
   */
  @Get('diagnostics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Diagnósticos obtenidos',
  })
  async getDiagnostics(@Request() req: any) {
    return await this.clientService.getDiagnostics(req.user.sub);
  }

  /**
   * Obtener diagnósticos solicitados del cliente
   * GET /client/diagnostics/requested
   */
  @Get('diagnostics/requested')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Diagnósticos solicitados obtenidos',
  })
  async getDiagnosticsRequested(@Request() req: any) {
    return await this.clientService.getDiagnosticsRequested(req.user.sub);
  }

  /**
   * Obtener servicios recientes del cliente
   * GET /client/recent-services
   */
  @Get('recent-services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Servicios recientes obtenidos',
  })
  async getRecentServices(@Request() req: any) {
    return await this.clientService.getRecentServices(req.user.sub);
  }

  /**
   * Registrar nuevo vehículo
   * POST /client/vehicles/register
   */
  @Post('vehicles/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Vehículo registrado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async registerVehicle(
    @Request() req: any,
    @Body() vehicleData: {
      placa: string;
      marca: string;
      modelo: string;
      fechafabricacion: string;
      kilometraje: number;
    },
  ) {
    return await this.clientService.registerVehicle(req.user.sub, vehicleData);
  }

  /**
   * Actualizar datos personales del cliente
   * PUT /client/profile
   */
  @Post('profile/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async updateProfile(
    @Request() req: any,
    @Body() profileData: {
      nombre?: string;
      apepaterno?: string;
      apematerno?: string;
      telefono?: string;
      correo?: string;
    },
  ) {
    return await this.clientService.updateClientProfile(req.user.sub, profileData);
  }

  /**
   * Obtener horarios disponibles para diagnóstico
   * GET /client/diagnostics/schedules
   */
  @Get('diagnostics/schedules')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Horarios disponibles obtenidos exitosamente',
  })
  async getAvailableSchedules(@Request() req: any) {
    const fecha = req.query.fecha;
    return await this.clientService.getAvailableSchedules(fecha);
  }

  /**
   * Solicitar diagnóstico
   * POST /client/diagnostics/request
   */
  @Post('diagnostics/request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Diagnóstico solicitado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async requestDiagnostic(
    @Request() req: any,
    @Body() diagnosticData: {
      codvehiculo: string;
      fecha: string;
      horainicio: string;
      horafin: string;
      idempleado?: number;
    },
  ) {
    return await this.clientService.requestDiagnostic(req.user.sub, diagnosticData);
  }

  /**
   * Obtener servicios correctivos disponibles
   * GET /client/corrective-services
   */
  @Get('corrective-services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Servicios correctivos obtenidos exitosamente',
  })
  async getCorrectiveServices() {
    return await this.clientService.getCorrectiveServices();
  }

  @Get('operario/:fecha/:horainicio')
  @ApiResponse({
    status: 200,
    description: 'Operario disponible obtenido exitosamente',
  })
  async getAvailableOperario(
    @Param('fecha') fecha: string,
    @Param('horainicio') horainicio: string,
  ) {
    return await this.clientService.getAvailableOperarioForService(fecha, horainicio);
  }

  @Post('corrective-service/request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Servicio correctivo solicitado exitosamente',
  })
  async requestCorrectiveService(
    @Request() req: any,
    @Body()
    correctiveData: {
      codvehiculo: string;
      codservicio: string;
      fecha: string;
      horainicio: string;
      idempleado?: number;
    },
  ) {
    return await this.clientService.requestCorrectiveService(req.user.sub, correctiveData);
  }

  /**
   * Solicitar servicio preventivo
   * POST /client/preventive-service/request
   */
  @Post('preventive-service/request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Servicio preventivo solicitado exitosamente',
  })
  async requestPreventiveService(
    @Request() req: any,
    @Body()
    preventiveData: {
      codvehiculo: string;
      codhorariodisp: string;
      kilometraje: number;
    },
  ) {
    return await this.clientService.requestPreventiveService(req.user.sub, preventiveData);
  }
}
