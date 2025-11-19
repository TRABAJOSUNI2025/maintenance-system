import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OperatorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener ID del empleado a partir del userId
   */
  private async getEmployeeIdByUserId(userId: number): Promise<number> {
    try {
      // Query SQL raw para obtener el ID del empleado
      const result = await (this.prisma as any).$queryRaw`
        SELECT idempleado FROM empleado WHERE idusuario = ${userId}
      `;

      if (!result || result.length === 0) {
        throw new BadRequestException('Empleado no encontrado');
      }

      return result[0].idempleado;
    } catch (error) {
      throw new BadRequestException('Error al obtener empleado');
    }
  }

  /**
   * Obtener perfil del operario (datos personales)
   */
  async getOperatorProfile(userId: number) {
    const idempleado = await this.getEmployeeIdByUserId(userId);

    const empleado = await (this.prisma as any).empleado.findUnique({
      where: { idempleado },
      include: {
        usuario: {
          select: {
            username: true,
            estado: true,
          },
        },
      },
    });

    if (!empleado) {
      throw new BadRequestException('Empleado no encontrado');
    }

    return {
      success: true,
      operator: {
        id: empleado.idempleado,
        dni: empleado.dni,
        nombre: empleado.nombres,
        apellidoPaterno: empleado.apepaterno,
        apellidoMaterno: empleado.apematerno,
        telefono: empleado.telefono,
        especialidad: empleado.especialidad,
        username: empleado.usuario?.username,
        estado: empleado.usuario?.estado === 'A' ? 'activo' : 'inactivo',
      },
    };
  }

  /**
   * Obtener tickets asignados al operario
   */
  async getAssignedTickets(userId: number) {
    const idempleado = await this.getEmployeeIdByUserId(userId);

    const tickets = await (this.prisma as any).asignarOperario.findMany({
      where: { idempleado },
      include: {
        ticket: {
          include: {
            vehiculo: true,
            cliente: true,
            estadoTicket: true,
          },
        },
      },
    });

    return {
      success: true,
      total: tickets.length,
      tickets: tickets.map((assign: any) => ({
        codOperarioTicket: assign.codoperarioxticket,
        codTicket: assign.ticket?.codticket,
        fecha: assign.ticket?.fecha,
        cliente: assign.ticket?.cliente?.nombre || 'N/A',
        vehiculo: assign.ticket?.vehiculo
          ? `${assign.ticket.vehiculo.marca} ${assign.ticket.vehiculo.modelo} - ${assign.ticket.vehiculo.placa}`
          : 'N/A',
        estado: assign.ticket?.estadoTicket?.nombreestado || 'Desconocido',
      })),
    };
  }

  /**
   * Obtener mantenimientos realizados por el operario
   */
  async getMaintenancePerformed(userId: number) {
    const idempleado = await this.getEmployeeIdByUserId(userId);

    const mantenimientos = await (this.prisma as any).mantenimientos.findMany({
      where: {
        ticket: {
          asignaroperario: {
            some: {
              idempleado,
            },
          },
        },
      },
      include: {
        ticket: {
          include: {
            vehiculo: true,
            cliente: true,
          },
        },
        catalogoservicios: true,
        estadomantenimiento: true,
      },
    });

    return {
      success: true,
      total: mantenimientos.length,
      mantenimientos: mantenimientos.map((m: any) => ({
        codMantenimiento: m.codmantenimiento,
        codTicket: m.ticket?.codticket,
        fecha: m.fecharealiza,
        cliente: m.ticket?.cliente?.nombre || 'N/A',
        vehiculo: m.ticket?.vehiculo
          ? `${m.ticket.vehiculo.marca} ${m.ticket.vehiculo.modelo} - ${m.ticket.vehiculo.placa}`
          : 'N/A',
        servicio: m.catalogoservicios?.descripcion || 'N/A',
        monto: Number(m.monto || 0),
        estado: m.estadomantenimiento?.nombreestado || 'Desconocido',
        observaciones: m.observaciones,
      })),
    };
  }

  /**
   * Obtener diagnósticos realizados por el operario
   */
  async getDiagnosticsPerformed(userId: number) {
    const idempleado = await this.getEmployeeIdByUserId(userId);

    const diagnosticos = await (this.prisma as any).diagnostico.findMany({
      where: { idoperario: idempleado },
      include: {
        mantenimientos: {
          include: {
            ticket: {
              include: {
                vehiculo: true,
                cliente: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      total: diagnosticos.length,
      diagnosticos: diagnosticos.map((d: any) => ({
        codDiagnostico: d.coddiagnostico,
        codMantenimiento: d.mantenimientos?.codmantenimiento,
        cliente: d.mantenimientos?.ticket?.cliente?.nombre || 'N/A',
        vehiculo: d.mantenimientos?.ticket?.vehiculo
          ? `${d.mantenimientos.ticket.vehiculo.marca} ${d.mantenimientos.ticket.vehiculo.modelo} - ${d.mantenimientos.ticket.vehiculo.placa}`
          : 'N/A',
        area: d.area,
        problemas: d.problemas,
        motivoDerivacion: d.motivoderivacion,
        fecha: d.fecharegistro,
        hora: d.horaregistro,
      })),
    };
  }

  /**
   * Obtener estadísticas del operario (resumen de actividad)
   */
  async getOperatorStats(userId: number) {
    const idempleado = await this.getEmployeeIdByUserId(userId);

    // Contar tickets asignados
    const ticketsCount = await (this.prisma as any).asignarOperario.count({
      where: { idempleado },
    });

    // Contar mantenimientos completados
    const maintenanceCount = await (this.prisma as any).mantenimientos.count({
      where: {
        ticket: {
          asignaroperario: {
            some: {
              idempleado,
            },
          },
        },
        idestadomantenimiento: 4, // Completado
      },
    });

    // Contar diagnósticos realizados
    const diagnosticsCount = await (this.prisma as any).diagnostico.count({
      where: { idoperario: idempleado },
    });

    // Suma de montos en mantenimientos
    const montoResult = await (this.prisma as any).$queryRaw`
      SELECT COALESCE(SUM(m.monto), 0) as total_monto
      FROM mantenimientos m
      INNER JOIN ticket t ON m.codticket = t.codticket
      INNER JOIN asignaroperario ao ON t.codticket = ao.codticket
      WHERE ao.idempleado = ${idempleado}
    `;

    const totalMonto = Number(montoResult[0].total_monto || 0);

    return {
      success: true,
      stats: {
        ticketsAsignados: ticketsCount,
        mantenimientosCompletados: maintenanceCount,
        diagnosticosRealizados: diagnosticsCount,
        montoTotal: totalMonto,
      },
    };
  }

  /**
   * Obtener trabajos recientes del operario
   */
  async getRecentWork(userId: number, limit = 5) {
    const idempleado = await this.getEmployeeIdByUserId(userId);

    const mantenimientos = await (this.prisma as any).mantenimientos.findMany({
      where: {
        ticket: {
          asignaroperario: {
            some: {
              idempleado,
            },
          },
        },
      },
      take: limit,
      orderBy: {
        fecharealiza: 'desc',
      },
      include: {
        ticket: {
          include: {
            vehiculo: true,
            cliente: true,
          },
        },
        catalogoservicios: true,
        estadomantenimiento: true,
      },
    });

    return {
      success: true,
      total: mantenimientos.length,
      trabajos: mantenimientos.map((m: any) => ({
        id: m.codmantenimiento,
        cliente: m.ticket?.cliente?.nombre || 'N/A',
        vehiculo: m.ticket?.vehiculo
          ? `${m.ticket.vehiculo.marca} ${m.ticket.vehiculo.modelo}`
          : 'N/A',
        servicio: m.catalogoservicios?.descripcion || 'N/A',
        fecha: m.fecharealiza,
        estado: m.estadomantenimiento?.nombreestado || 'Desconocido',
        monto: Number(m.monto || 0),
      })),
    };
  }
}
