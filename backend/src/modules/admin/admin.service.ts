import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

    const [
      totalUsers,
      totalVehicles,
      totalMaintenance,
      totalDiagnostics,
      totalTickets,
      maintenanceByStatus,
      ticketsByStatus,
      recentActivities,
      monthlyTickets,
      monthlyMaintenance,
      monthlyDiagnostics,
      monthlyTicketsCount,
    ] = await Promise.all([
      this.prisma.usuario.count(),
      this.prisma.vehiculo.count(),
      this.prisma.mantenimientos.count(),
      this.prisma.diagnostico.count(),
      this.prisma.ticket.count(),
      this.getMaintenanceByStatus(),
      this.getTicketsByStatus(),
      this.getRecentActivities(),
      this.getMonthlyTickets(),
      this.prisma.mantenimientos.count({
        where: {
          fecharealiza: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
      this.prisma.diagnostico.count({
        where: {
          fecharegistro: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
      this.prisma.ticket.count({
        where: {
          fecha: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
    ]);

    return {
      totals: {
        users: totalUsers,
        vehicles: totalVehicles,
        maintenance: totalMaintenance,
        diagnostics: totalDiagnostics,
        tickets: totalTickets,
      },
      monthlyTotals: {
        maintenance: monthlyMaintenance,
        diagnostics: monthlyDiagnostics,
        tickets: monthlyTicketsCount,
        month: currentMonth,
      },
      maintenanceByStatus,
      ticketsByStatus,
      recentActivities,
      monthlyTickets,
    };
  }

  private async getMaintenanceByStatus() {
    const statuses = await this.prisma.mantenimientos.groupBy({
      by: ['idestadomantenimiento'],
      _count: true,
    });

    // Mapear IDs a nombres descriptivos
    const statusNames: Record<number, string> = {
      1: 'Pendiente',
      2: 'Diagnosticado',
      3: 'Ejecución',
      4: 'Finalizado',
      5: 'En Revisión',
      6: 'Cancelado',
    };

    // Crear array con todos los estados, incluso los que no tienen datos
    const allStatuses = Object.entries(statusNames).map(([id, name]) => {
      const statusData = statuses.find((s: any) => s.idestadomantenimiento === parseInt(id));
      return {
        status: name,
        count: statusData?._count || 0,
      };
    });

    return allStatuses;
  }

  private async getTicketsByStatus() {
    const statuses = await this.prisma.ticket.groupBy({
      by: ['estado'],
      _count: true,
    });
    return statuses.map((s: any) => ({
      status: s.estado,
      count: s._count,
    }));
  }

  private async getRecentActivities() {
    const recentTickets = await this.prisma.ticket.findMany({
      take: 10,
      orderBy: { fecha: 'desc' },
      include: {
        vehiculo: {
          select: { marca: true, modelo: true },
        },
        cliente: {
          select: { nombre: true },
        },
      },
    });

    const activities: any[] = recentTickets.map((t: any) => ({
      type: 'ticket',
      id: t.codticket,
      title: `Ticket: ${t.vehiculo?.marca} ${t.vehiculo?.modelo}`,
      description: `Cliente: ${t.cliente?.nombre || 'N/A'}`,
      status: t.estado,
      date: t.fecha || new Date(),
    }));

    return activities;
  }

  private async getMonthlyTickets() {
    // Obtener tickets de todo el año actual
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const lastDayOfYear = new Date(currentYear, 11, 31);

    const ticketsByMonth = await this.prisma.ticket.groupBy({
      by: ['fecha'],
      _count: true,
      where: {
        fecha: {
          gte: firstDayOfYear,
          lte: lastDayOfYear,
        },
      },
    });

    // Agrupar por mes
    const monthlyData = Array(12).fill(0);
    
    ticketsByMonth.forEach((item: any) => {
      if (item.fecha) {
        const month = new Date(item.fecha).getMonth();
        monthlyData[month] += item._count;
      }
    });

    return {
      year: currentYear,
      data: monthlyData,
      total: ticketsByMonth.reduce((sum: number, item: any) => sum + item._count, 0),
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    };
  }

  async getUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        select: {
          idusuario: true,
          correo: true,
          username: true,
          estado: true,
        },
      }),
      this.prisma.usuario.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getVehicles(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [vehicles, total] = await Promise.all([
      this.prisma.vehiculo.findMany({
        skip,
        take: limit,
        include: {
          cuentacliente: {
            include: {
              cliente: {
                select: { nombre: true, correo: true },
              },
            },
          },
        },
      }),
      this.prisma.vehiculo.count(),
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getMaintenanceList(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [maintenance, total] = await Promise.all([
      this.prisma.mantenimientos.findMany({
        skip,
        take: limit,
        include: {
          ticket: {
            include: {
              vehiculo: {
                select: { placa: true, marca: true, modelo: true },
              },
            },
          },
        },
      }),
      this.prisma.mantenimientos.count(),
    ]);

    return {
      maintenance,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTicketsList(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        skip,
        take: limit,
        include: {
          cliente: {
            select: { nombre: true, correo: true },
          },
          vehiculo: {
            select: { placa: true, marca: true, modelo: true },
          },
        },
      }),
      this.prisma.ticket.count(),
    ]);

    return {
      tickets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
