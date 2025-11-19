import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo cliente
   */
  async register(registerDto: RegisterDto) {
    const { nombre, apePaterno, apeMaterno, correo, password, telefono } =
      registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.usuario.findUnique({
      where: { correo: correo },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      // Crear el nuevo usuario
      const usuario = await this.prisma.usuario.create({
        data: {
          username: correo.split('@')[0],
          correo: correo,
          passwordhash: hashedPassword,
          estado: 'A',
        },
        select: {
          idusuario: true,
          correo: true,
          username: true,
        },
      });

      // Generar DNI temporal (formato: 8 dígitos basado en idusuario)
      const dniTemporal = String(usuario.idusuario).padStart(8, '0');

      // Crear registro de cliente con todos los campos
      try {
        const clienteData: any = {
          dnicliente: dniTemporal,
          idusuario: usuario.idusuario,
          nombre: nombre,
          apepaterno: apePaterno,
          apematerno: apeMaterno || null,
          correo: correo,
          telefono: telefono || null,
        };
        await this.prisma.cliente.create({ data: clienteData });
      } catch (clientError) {
        console.error('Error creating cliente:', clientError);
        throw clientError;
      }

      // Generar tokens
      const tokens = await this.generateTokens({
        id: usuario.idusuario,
        email: usuario.correo,
        username: usuario.username,
      });

      return {
        success: true,
        message: 'Cliente registrado exitosamente',
        user: {
          id: usuario.idusuario,
          email: usuario.correo,
          username: usuario.username,
          role: 'CLIENTE',
        },
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al registrar el cliente: ' + (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  /**
   * Login de usuario (CLIENTE o TRABAJADOR)
   */
  async login(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;

    // Buscar el usuario por email
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: email },
    });

    if (!usuario) {
      throw new UnauthorizedException(
        'Email o contraseña incorrectos',
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.passwordhash);
    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Email o contraseña incorrectos',
      );
    }

    // Verificar que el usuario esté activo
    if (usuario.estado !== 'A') {
      throw new UnauthorizedException('La cuenta ha sido desactivada');
    }

    // Determinar el rol verificando si es empleado o cliente
    let role = 'CLIENTE';
    
    // Verificar si el usuario es empleado
    const empleado = await this.prisma.empleado.findUnique({
      where: { idusuario: usuario.idusuario },
      include: { empleadorol: { include: { rol: true } } },
    });
    
    // Si es trabajador y existe empleado, asignar su rol específico
    if (userType === 'TRABAJADOR') {
      if (!empleado) {
        throw new UnauthorizedException(
          'Este usuario no tiene acceso como trabajador',
        );
      }
      // Obtener el rol específico (OPERARIO, SUPERVISOR, ADMINISTRADOR)
      if (empleado.empleadorol && empleado.empleadorol.length > 0) {
        role = empleado.empleadorol[0].rol.nombrerol;
      } else {
        throw new UnauthorizedException(
          'Trabajador sin rol asignado',
        );
      }
    } else {
      // Si es cliente, validar que sea cliente y no empleado
      if (empleado) {
        throw new UnauthorizedException(
          'Este usuario no tiene acceso como cliente',
        );
      }
      role = 'CLIENTE';
    }

    // Generar tokens
    const tokens = await this.generateTokens({
      id: usuario.idusuario,
      email: usuario.correo,
      username: usuario.username,
      role: role,
    });

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.idusuario,
        email: usuario.correo,
        username: usuario.username,
        role: role,
      },
      ...tokens,
    };
  }

  /**
   * Generar JWT access token y refresh token
   */
  private async generateTokens(payload: any) {
    const tokenPayload = {
      sub: payload.id,
      email: payload.email,
      username: payload.username,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refrescar access token usando refresh token
   */
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const usuario = await this.prisma.usuario.findUnique({
        where: { idusuario: payload.sub },
        select: {
          idusuario: true,
          correo: true,
          username: true,
        },
      });

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const tokens = await this.generateTokens({
        id: usuario.idusuario,
        email: usuario.correo,
        username: usuario.username,
      });

      return {
        success: true,
        message: 'Token refrescado',
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idusuario: userId },
      select: {
        idusuario: true,
        correo: true,
        username: true,
        estado: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      success: true,
      user: {
        id: usuario.idusuario,
        email: usuario.correo,
        username: usuario.username,
        status: usuario.estado === 'A',
      },
    };
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idusuario: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const passwordMatch = await bcrypt.compare(oldPassword, usuario.passwordhash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.usuario.update({
      where: { idusuario: userId },
      data: { passwordhash: hashedPassword },
    });

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }

  /**
   * Normalizar rol a formato correcto
   */
  private normalizeRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      cliente: 'CLIENTE',
      operario: 'OPERATOR',
      technician: 'TECHNICIAN',
      supervisor: 'SUPERVISOR',
      admin: 'ADMIN',
      administrador: 'ADMIN',
    };

    return roleMap[role.toLowerCase()] || 'CLIENTE';
  }

  /**
   * SOLO PARA DESARROLLO: Generar hashes SQL para usuarios de prueba
   * Retorna un script SQL UPDATE que puedes ejecutar
   */
  async generateTestUserHashes() {
    const testUsers = [
      // Trabajadores (IDs 1-20)
      { id: 1, username: 'yvarillas', password: 'admin001', correo: 'y.varillas@sigemave.pe' },
      { id: 2, username: 'cgarcia', password: 'admin002', correo: 'c.garcia@sigemave.pe' },
      { id: 3, username: 'cmaylle', password: 'super001', correo: 'c.maylle@sigemave.pe' },
      { id: 4, username: 'sventuro', password: 'super002', correo: 's.venturo@sigemave.pe' },
      { id: 5, username: 'sorosco', password: 'super003', correo: 's.orosco@sigemave.pe' },
      { id: 6, username: 'jvenegas', password: 'super004', correo: 'j.venegas@sigemave.pe' },
      { id: 7, username: 'csehuin', password: 'oper001', correo: 'c.sehuin@sigemave.pe' },
      { id: 8, username: 'dlarico', password: 'oper002', correo: 'd.larico@sigemave.pe' },
      { id: 9, username: 'jbriceno', password: 'oper003', correo: 'j.briceno@sigemave.pe' },
      { id: 10, username: 'ccruz', password: 'oper004', correo: 'c.cruz@sigemave.pe' },
      { id: 11, username: 'emontalvan', password: 'oper005', correo: 'e.montalvan@sigemave.pe' },
      { id: 12, username: 'azambrano', password: 'oper006', correo: 'a.zambrano@sigemave.pe' },
      { id: 13, username: 'faguirre', password: 'oper007', correo: 'f.aguirre@sigemave.pe' },
      { id: 14, username: 'rfernandez', password: 'oper008', correo: 'r.fernandez@sigemave.pe' },
      { id: 15, username: 'clarico', password: 'oper009', correo: 'c.larico@sigemave.pe' },
      { id: 16, username: 'dsehuin', password: 'oper010', correo: 'd.sehuin@sigemave.pe' },
      { id: 17, username: 'svarillas', password: 'oper011', correo: 's.varillas@sigemave.pe' },
      { id: 18, username: 'cvenegas', password: 'oper012', correo: 'c.venegas@sigemave.pe' },
      { id: 19, username: 'yorosco', password: 'oper013', correo: 'y.orosco@sigemave.pe' },
      { id: 20, username: 'jgarcia', password: 'oper014', correo: 'j.garcia@sigemave.pe' },
      
      // Clientes (IDs 21-55)
      { id: 21, username: 'jaliaga', password: 'cliente001', correo: 'j.aliaga@gmail.com' },
      { id: 22, username: 'sanyaipoma', password: 'cliente002', correo: 's.anyaipoma@uni.pe' },
      { id: 23, username: 'jmunoz', password: 'cliente003', correo: 'j.munoz@hotmail.com' },
      { id: 24, username: 'amedina', password: 'cliente004', correo: 'a.medina@yahoo.com' },
      { id: 25, username: 'rrodriguez', password: 'cliente005', correo: 'r.rodriguez@gmail.com' },
      { id: 26, username: 'flopez', password: 'cliente006', correo: 'f.lopez@hotmail.com' },
      { id: 27, username: 'mgonzalez', password: 'cliente007', correo: 'm.gonzalez@gmail.com' },
      { id: 28, username: 'aperez', password: 'cliente008', correo: 'a.perez@hotmail.com' },
      { id: 29, username: 'dgarcia', password: 'cliente009', correo: 'd.garcia@gmail.com' },
      { id: 30, username: 'jmartinez', password: 'cliente010', correo: 'j.martinez@hotmail.com' },
      { id: 31, username: 'srodriguez', password: 'cliente011', correo: 's.rodriguez@gmail.com' },
      { id: 32, username: 'clopez', password: 'cliente012', correo: 'c.lopez@hotmail.com' },
      { id: 33, username: 'mgonzalez2', password: 'cliente013', correo: 'm.gonzalez2@gmail.com' },
      { id: 34, username: 'aperez2', password: 'cliente014', correo: 'a.perez2@hotmail.com' },
      { id: 35, username: 'dgarcia2', password: 'cliente015', correo: 'd.garcia2@gmail.com' },
      { id: 36, username: 'jmartinez2', password: 'cliente016', correo: 'j.martinez2@hotmail.com' },
      { id: 37, username: 'srodriguez2', password: 'cliente017', correo: 's.rodriguez2@gmail.com' },
      { id: 38, username: 'clopez2', password: 'cliente018', correo: 'c.lopez2@hotmail.com' },
      { id: 39, username: 'lmorales', password: 'cliente019', correo: 'l.morales@gmail.com' },
      { id: 40, username: 'evargas', password: 'cliente020', correo: 'e.vargas@hotmail.com' },
      { id: 41, username: 'jcastro', password: 'cliente021', correo: 'j.castro@gmail.com' },
      { id: 42, username: 'arivera', password: 'cliente022', correo: 'a.rivera@hotmail.com' },
      { id: 43, username: 'fsoto', password: 'cliente023', correo: 'f.soto@gmail.com' },
      { id: 44, username: 'mramirez', password: 'cliente024', correo: 'm.ramirez@hotmail.com' },
      { id: 45, username: 'jromero', password: 'cliente025', correo: 'j.romero@gmail.com' },
      { id: 46, username: 'aramos', password: 'cliente026', correo: 'a.ramos@hotmail.com' },
      { id: 47, username: 'lguerra', password: 'cliente027', correo: 'l.guerra@gmail.com' },
      { id: 48, username: 'echavez', password: 'cliente028', correo: 'e.chavez@hotmail.com' },
      { id: 49, username: 'jsantiago', password: 'cliente029', correo: 'j.santiago@gmail.com' },
      { id: 50, username: 'aalvarez', password: 'cliente030', correo: 'a.alvarez@hotmail.com' },
      { id: 51, username: 'mcarrasco', password: 'cliente031', correo: 'm.carrasco@gmail.com' },
      { id: 52, username: 'eflores', password: 'cliente032', correo: 'e.flores@hotmail.com' },
      { id: 53, username: 'jhuerta', password: 'cliente033', correo: 'j.huerta@gmail.com' },
      { id: 54, username: 'avelez', password: 'cliente034', correo: 'a.velez@hotmail.com' },
      { id: 55, username: 'dcordova', password: 'cliente035', correo: 'd.cordova@gmail.com' },
    ];

    const updateStatements = [];
    const credenciales = [];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      updateStatements.push(
        `UPDATE usuario SET passwordhash = '${hashedPassword}' WHERE idusuario = ${user.id} AND username = '${user.username}';`
      );
      credenciales.push({
        username: user.username,
        password: user.password,
        correo: user.correo,
        hash: hashedPassword,
      });
    }

    return {
      success: true,
      message: 'Hashes generados con éxito. Ejecuta los UPDATE statements en PostgreSQL',
      sqlStatements: updateStatements.join('\n'),
      credenciales,
      totalUsers: testUsers.length,
      instructions: 'Copia los SQL statements y ejecutalos en tu base de datos PostgreSQL',
    };
  }
}
