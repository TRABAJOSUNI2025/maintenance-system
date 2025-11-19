import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registrar un nuevo usuario
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la validación de datos',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * Login de usuario
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
  })
  @ApiResponse({
    status: 401,
    description: 'Email o contraseña incorrectos',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * Refrescar token
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
  })
  async refreshToken(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token es requerido');
    }
    return await this.authService.refreshToken(body.refreshToken);
  }

  /**
   * Obtener perfil del usuario autenticado
   * GET /auth/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getProfile(@Request() req: any) {
    return await this.authService.getProfile(req.user.sub);
  }

  /**
   * Cambiar contraseña
   * POST /auth/change-password
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Contraseña actual incorrecta o no autenticado',
  })
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException(
        'oldPassword y newPassword son requeridos',
      );
    }
    return await this.authService.changePassword(
      req.user.sub,
      body.oldPassword,
      body.newPassword,
    );
  }

  /**
   * SOLO PARA DESARROLLO: Generar hashes SQL para usuarios de prueba
   * POST /auth/generate-test-hashes
   * @deprecated No usar en producción
   */
  @Post('generate-test-hashes')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Hashes generados exitosamente',
  })
  async generateTestHashes() {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('Este endpoint solo está disponible en desarrollo');
    }
    return await this.authService.generateTestUserHashes();
  }
}

