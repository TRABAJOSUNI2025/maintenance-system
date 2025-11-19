import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener DNI del cliente a partir del userId
   */
  private async getClientDniByUserId(userId: number): Promise<string> {
    try {
      // Query SQL raw para obtener el DNI del cliente
      const result = await (this.prisma as any).$queryRaw`
        SELECT dnicliente FROM cliente WHERE idusuario = ${userId}
      `;

      if (!result || result.length === 0) {
        throw new BadRequestException('Cliente no encontrado');
      }

      return result[0].dnicliente;
    } catch (error) {
      throw new BadRequestException('Error al obtener cliente');
    }
  }

  /**
   * Obtener perfil del cliente (datos personales + cuenta)
   */
  async getClientProfile(userId: number) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const cliente = await (this.prisma as any).cliente.findUnique({
      where: { dnicliente },
    });

    if (!cliente) {
      throw new BadRequestException('Cliente no encontrado');
    }

    // Obtener las cuentas del cliente (puede tener múltiples vehículos)
    const cuentas = await (this.prisma as any).cuentaCliente.findMany({
      where: { dnicliente },
    });

    // Calcular totales sumando todas las cuentas
    const totalpendientes = cuentas.reduce((sum: number, c: any) => sum + (c.totalpendientes || 0), 0);
    const totalcancelados = cuentas.reduce((sum: number, c: any) => sum + (c.totalcancelados || 0), 0);
    const totalrealizados = cuentas.reduce((sum: number, c: any) => sum + (c.totalrealizados || 0), 0);

    // Obtener el código de la primera cuenta (o principal)
    const codcuentacliente = cuentas.length > 0 ? cuentas[0].codcuentacliente : 'N/A';

    return {
      success: true,
      cliente: {
        dnicliente: cliente.dnicliente,
        nombre: cliente.nombre,
        apepaterno: cliente.apepaterno,
        apematerno: cliente.apematerno,
        telefono: cliente.telefono,
        correo: cliente.correo,
        codcuentacliente,
        totalpendientes,
        totalcancelados,
        totalrealizados,
      },
    };
  }

  /**
   * Obtener vehículos del cliente
   */
  async getClientVehicles(userId: number) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const vehiculos = await (this.prisma as any).cuentaCliente.findMany({
      where: { dnicliente },
      include: {
        vehiculo: true,
      },
    });

    return {
      success: true,
      total: vehiculos.length,
      vehiculos: vehiculos.map((cuenta: any) => ({
        codVehiculo: cuenta.vehiculo.codvehiculo,
        placa: cuenta.vehiculo.placa,
        marca: cuenta.vehiculo.marca,
        modelo: cuenta.vehiculo.modelo,
        fechafabricacion: cuenta.vehiculo.fechafabricacion,
        kilometraje: cuenta.vehiculo.kilometraje,
        serviciosPendientes: cuenta.totalpendientes,
        serviciosRealizados: cuenta.totalrealizados,
      })),
    };
  }

  /**
   * Obtener mantenimientos correctivos del cliente
   */
  async getMaintenanceCorrectivo(userId: number) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const mantenimientos = await (this.prisma as any).mantenimientos.findMany({
      where: {
        ticket: {
          dnicliente,
        },
      },
      include: {
        ticket: {
          include: {
            vehiculo: true,
          },
        },
        catalogoservicios: {
          include: {
            tipomantenimiento: true,
          },
        },
        estadomantenimiento: true,
      },
    });

    // Filtrar solo correctivos (tipo 2)
    const correctivos = mantenimientos.filter(
      (m: any) => m.catalogoservicios?.tipomantenimiento?.idtipomantenimiento === 2,
    );

    return {
      success: true,
      total: correctivos.length,
      mantenimientos: correctivos.map((m: any) => ({
        codMantenimiento: m.codmantenimiento,
        codTicket: m.ticket?.codticket,
        fecha: m.fecharealiza,
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
   * Obtener mantenimientos preventivos del cliente
   */
  async getMaintenancePreventivo(userId: number) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const mantenimientos = await (this.prisma as any).mantenimientos.findMany({
      where: {
        ticket: {
          dnicliente,
        },
      },
      include: {
        ticket: {
          include: {
            vehiculo: true,
          },
        },
        catalogoservicios: {
          include: {
            tipomantenimiento: true,
          },
        },
        estadomantenimiento: true,
      },
    });

    // Filtrar solo preventivos (tipo 1)
    const preventivos = mantenimientos.filter(
      (m: any) => m.catalogoservicios?.tipomantenimiento?.idtipomantenimiento === 1,
    );

    return {
      success: true,
      total: preventivos.length,
      mantenimientos: preventivos.map((m: any) => ({
        codMantenimiento: m.codmantenimiento,
        codTicket: m.ticket?.codticket,
        fecha: m.fecharealiza,
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
   * Obtener diagnósticos del cliente
   */
  async getDiagnostics(userId: number) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const diagnosticos = await (this.prisma as any).diagnostico.findMany({
      where: {
        mantenimientos: {
          ticket: {
            dnicliente,
          },
        },
      },
      include: {
        mantenimientos: {
          include: {
            ticket: {
              include: {
                vehiculo: true,
              },
            },
          },
        },
        empleado: true,
      },
    });

    return {
      success: true,
      total: diagnosticos.length,
      diagnosticos: diagnosticos.map((d: any) => ({
        codDiagnostico: d.coddiagnostico,
        codMantenimiento: d.mantenimientos?.codmantenimiento,
        vehiculo: d.mantenimientos?.ticket?.vehiculo
          ? `${d.mantenimientos.ticket.vehiculo.marca} ${d.mantenimientos.ticket.vehiculo.modelo} - ${d.mantenimientos.ticket.vehiculo.placa}`
          : 'N/A',
        area: d.area,
        problemas: d.problemas,
        motivoDerivacion: d.motivoderivacion,
        operario: d.empleado?.nombres || 'N/A',
        fecha: d.fecharegistro,
        hora: d.horaregistro,
      })),
    };
  }

  /**
   * Obtener diagnósticos solicitados (tickets de diagnóstico) del cliente
   */
  async getDiagnosticsRequested(userId: number) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const diagnosticosQuery = await (this.prisma as any).$queryRaw`
      SELECT 
        t."codticket",
        t."fecha",
        t."horainiestimada",
        t."horafinestimada",
        t."estado",
        v."marca",
        v."modelo",
        v."placa",
        s."nombres" as supervisor,
        e."nombres" as operario,
        lt."codloteticket"
      FROM "ticket" t
      LEFT JOIN "vehiculo" v ON t."codvehiculo" = v."codvehiculo"
      LEFT JOIN "empleado" s ON t."idsupervisor" = s."idempleado"
      LEFT JOIN "asignaroperario" ao ON t."codticket" = ao."codticket"
      LEFT JOIN "empleado" e ON ao."idempleado" = e."idempleado"
      LEFT JOIN "loteticket" lt ON t."codloteticket" = lt."codloteticket"
      WHERE t."dnicliente" = ${dnicliente}
      ORDER BY t."fecha" DESC
    `;

    const estadoMap: Record<number, string> = {
      1: 'Pendiente',
      2: 'En Proceso',
      3: 'Completado',
      4: 'Cancelado'
    };

    return {
      success: true,
      total: diagnosticosQuery.length,
      diagnosticos: diagnosticosQuery.map((d: any) => ({
        codTicket: d.codticket,
        fecha: d.fecha,
        horainicio: d.horainiestimada,
        horafin: d.horafinestimada,
        estado: estadoMap[d.estado] || 'Desconocido',
        vehiculo: d.marca && d.modelo && d.placa ? `${d.marca} ${d.modelo} - ${d.placa}` : 'N/A',
        rampa: 'Por asignar',
        supervisor: d.supervisor || 'Por asignar',
        operario: d.operario || 'Por asignar',
        loteTicket: d.codloteticket || 'N/A',
      })),
    };
  }

  /**
   * Obtener servicios recientes del cliente
   */
  async getRecentServices(userId: number, limit = 4) {
    const dnicliente = await this.getClientDniByUserId(userId);

    const mantenimientos = await (this.prisma as any).mantenimientos.findMany({
      where: {
        ticket: {
          dnicliente,
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
          },
        },
        catalogoservicios: true,
        estadomantenimiento: true,
      },
    });

    return {
      success: true,
      total: mantenimientos.length,
      servicios: mantenimientos.map((m: any) => ({
        id: m.codmantenimiento,
        vehiculo: m.ticket?.vehiculo
          ? `${m.ticket.vehiculo.marca} ${m.ticket.vehiculo.modelo} - ${m.catalogoservicios?.descripcion}`
          : 'N/A',
        status: m.estadomantenimiento?.nombreestado || 'Desconocido',
        codTicket: m.codticket,
      })),
    };
  }

  /**
   * Registrar nuevo vehículo para el cliente
   */
  async registerVehicle(
    userId: number,
    vehicleData: {
      placa: string;
      marca: string;
      modelo: string;
      fechafabricacion: string;
      kilometraje: number;
    },
  ) {
    try {
      const dnicliente = await this.getClientDniByUserId(userId);

      // Generar código único para el vehículo
      const count = await (this.prisma as any).vehiculo.count();
      const codvehiculo = `VEH${String(count + 1).padStart(5, '0')}`;

      // Crear el vehículo
      const nuevoVehiculo = await (this.prisma as any).vehiculo.create({
        data: {
          codvehiculo,
          placa: vehicleData.placa.toUpperCase(),
          marca: vehicleData.marca,
          modelo: vehicleData.modelo,
          fechafabricacion: new Date(vehicleData.fechafabricacion),
          kilometraje: vehicleData.kilometraje,
        },
      });

      // Generar código único para la cuenta del cliente
      const countCuenta = await (this.prisma as any).cuentaCliente.count();
      const codcuentacliente = `CTA${String(countCuenta + 1).padStart(5, '0')}`;

      // Crear la relación cliente-vehículo
      await (this.prisma as any).cuentaCliente.create({
        data: {
          codcuentacliente,
          dnicliente,
          codvehiculo,
          totalpendientes: 0,
          totalcancelados: 0,
          totalrealizados: 0,
        },
      });

      return {
        success: true,
        message: 'Vehículo registrado exitosamente',
        vehiculo: {
          codVehiculo: nuevoVehiculo.codvehiculo,
          placa: nuevoVehiculo.placa,
          marca: nuevoVehiculo.marca,
          modelo: nuevoVehiculo.modelo,
          fechafabricacion: nuevoVehiculo.fechafabricacion,
          kilometraje: Number(nuevoVehiculo.kilometraje || 0),
        },
      };
    } catch (error) {
      console.error('Error registrando vehículo:', error);
      throw new BadRequestException('Error al registrar el vehículo: ' + (error as any).message);
    }
  }

  /**
   * Actualizar datos personales del cliente
   */
  async updateClientProfile(
    userId: number,
    profileData: {
      nombre?: string;
      apepaterno?: string;
      apematerno?: string;
      telefono?: string;
      correo?: string;
    },
  ) {
    try {
      const dnicliente = await this.getClientDniByUserId(userId);

      const clienteActualizado = await (this.prisma as any).cliente.update({
        where: { dnicliente },
        data: {
          ...(profileData.nombre && { nombre: profileData.nombre }),
          ...(profileData.apepaterno && { apepaterno: profileData.apepaterno }),
          ...(profileData.apematerno && { apematerno: profileData.apematerno }),
          ...(profileData.telefono && { telefono: profileData.telefono }),
          ...(profileData.correo && { correo: profileData.correo }),
        },
      });

      return {
        success: true,
        message: 'Perfil actualizado exitosamente',
        cliente: {
          dnicliente: clienteActualizado.dnicliente,
          nombre: clienteActualizado.nombre,
          apepaterno: clienteActualizado.apepaterno,
          apematerno: clienteActualizado.apematerno,
          telefono: clienteActualizado.telefono,
          correo: clienteActualizado.correo,
        },
      };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw new BadRequestException('Error al actualizar el perfil: ' + (error as any).message);
    }
  }

  /**
   * Obtener horarios disponibles para una fecha específica
   */
  async getAvailableSchedules(fecha: string) {
    try {
      console.log('Buscando horarios para fecha:', fecha);

      // Query con LEFT JOIN para obtener horarios en formato string
      // fecha debe venir en formato YYYY-MM-DD
      const schedules = await (this.prisma as any).$queryRaw`
        SELECT 
          hd."codhorariodisp",
          hd."fecha",
          TO_CHAR(hd."horainicio", 'HH24:MI:SS') as "horainicio",
          TO_CHAR(hd."horafin", 'HH24:MI:SS') as "horafin",
          r."descripcion" as "rampadescripcion",
          COALESCE(CAST(150.00 AS DECIMAL(10,2)), 150.00) as "tarifa",
          e."idempleado",
          e."nombres" as "operario"
        FROM "horariodisp" hd
        LEFT JOIN "disprampa" dr ON hd."codhorariodisp" = dr."codhorariodisp"
        LEFT JOIN "rampa" r ON dr."codrampa" = r."codrampa"
        LEFT JOIN "dispoperario" "dispop" ON hd."codhorariodisp" = "dispop"."codhorariodisp"
        LEFT JOIN "empleado" e ON "dispop"."idempleado" = e."idempleado"
        WHERE hd."fecha"::date = ${fecha}::date
        ORDER BY hd."horainicio"
      `;

      console.log('Horarios encontrados:', schedules.length);

      return {
        success: true,
        schedules: schedules.map((schedule: any) => ({
          codhorariodisp: schedule.codhorariodisp,
          fecha: schedule.fecha,
          horainicio: schedule.horainicio,
          horafin: schedule.horafin,
          rampadescripcion: schedule.rampadescripcion || 'Centro de servicio',
          tarifa: Number(schedule.tarifa || 150.00),
          idempleado: schedule.idempleado,
          operario: schedule.operario || 'Por asignar',
        })),
      };
    } catch (error) {
      console.error('Error obteniendo horarios:', error);
      throw new BadRequestException('Error al obtener horarios disponibles: ' + (error as any).message);
    }
  }

  /**
   * Obtener el lote activo para hoy
   */
  private async getActiveLote(): Promise<string | null> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const lote = await (this.prisma as any).$queryRaw`
        SELECT "codloteticket"
        FROM "loteticket"
        WHERE "fechageneracion"::date <= ${today}::date
        AND "fechavencimiento"::date >= ${today}::date
        LIMIT 1
      `;

      return lote && lote.length > 0 ? lote[0].codloteticket : null;
    } catch (error) {
      console.error('Error obteniendo lote activo:', error);
      return null;
    }
  }

  /**
   * Obtener supervisor disponible por round-robin (Supervisor de Diagnóstico)
   */
  private async getAvailableSupervisor(): Promise<number | null> {
    try {
      // Obtener todos los supervisores de diagnóstico
      const supervisores = await (this.prisma as any).$queryRaw`
        SELECT e."idempleado"
        FROM "empleado" e
        INNER JOIN "empleadorol" er ON e."idempleado" = er."idempleado"
        WHERE er."idrol" = 2
        ORDER BY e."idempleado" ASC
      `;

      if (!supervisores || supervisores.length === 0) {
        console.warn('No hay supervisores disponibles');
        return null;
      }

      // Round-robin: contar tickets asignados a cada supervisor hoy
      const today = new Date().toISOString().split('T')[0];
      const supervisorStats = await Promise.all(
        supervisores.map(async (sup: any) => {
          const countResult = await (this.prisma as any).$queryRaw`
            SELECT COUNT(*) as total
            FROM "ticket"
            WHERE "idsupervisor" = ${sup.idempleado}
            AND "fecha"::date = ${today}::date
          `;
          return {
            idempleado: sup.idempleado,
            count: parseInt(countResult[0].total) || 0,
          };
        }),
      );

      // Obtener el supervisor con menos tickets asignados
      const supervisor = supervisorStats.reduce((prev, curr) =>
        prev.count <= curr.count ? prev : curr,
      );

      return supervisor.idempleado;
    } catch (error) {
      console.error('Error obteniendo supervisor:', error);
      return null;
    }
  }

  /**
   * Solicitar diagnóstico
   */
  async requestDiagnostic(
    userId: number,
    diagnosticData: {
      codvehiculo: string;
      fecha: string;
      horainicio: string;
      horafin: string;
      idempleado?: number;
    },
  ) {
    try {
      const dnicliente = await this.getClientDniByUserId(userId);

      // Generar código de ticket único (máximo 8 caracteres)
      const timestamp = Date.now().toString().slice(-5);
      const codticket = `TKT${timestamp}`;

      // Convertir fecha: "2025-11-28" → usar directamente en PostgreSQL
      const fechaStr = diagnosticData.fecha;

      // Obtener lote activo
      const codloteticket = await this.getActiveLote();

      // Obtener supervisor disponible por round-robin
      const idsupervisor = await this.getAvailableSupervisor();

      console.log('Creando ticket con datos:', {
        codticket,
        fecha: fechaStr,
        horainicio: diagnosticData.horainicio,
        horafin: diagnosticData.horafin,
        dnicliente,
        codvehiculo: diagnosticData.codvehiculo,
        codloteticket,
        idsupervisor,
        idempleado: diagnosticData.idempleado,
      });

      // Usar query raw SQL para insertar el ticket
      await (this.prisma as any).$executeRaw`
        INSERT INTO ticket (
          "codticket",
          "fecha",
          "horainiestimada",
          "horafinestimada",
          "estado",
          "dnicliente",
          "codvehiculo",
          "codloteticket",
          "idsupervisor"
        ) VALUES (
          ${codticket},
          ${fechaStr}::date,
          ${diagnosticData.horainicio}::time,
          ${diagnosticData.horafin}::time,
          1,
          ${dnicliente},
          ${diagnosticData.codvehiculo},
          ${codloteticket || null},
          ${idsupervisor || null}
        )
      `;

      console.log('Ticket creado exitosamente:', codticket);

      // Si hay un operario disponible, asignarlo al ticket
      if (diagnosticData.idempleado) {
        const codoperarioxticket = `OPR${timestamp}`;
        await (this.prisma as any).$executeRaw`
          INSERT INTO "asignaroperario" (
            "codoperarioxticket",
            "idempleado",
            "codticket"
          ) VALUES (
            ${codoperarioxticket},
            ${diagnosticData.idempleado},
            ${codticket}
          )
        `;
        console.log('Operario asignado al ticket:', codoperarioxticket);
      }

      return {
        success: true,
        message: 'Diagnóstico solicitado exitosamente',
        ticket: {
          codticket: codticket,
          fecha: fechaStr,
          horainicio: diagnosticData.horainicio,
          horafin: diagnosticData.horafin,
          codloteticket: codloteticket || 'Sin lote',
          idsupervisor: idsupervisor || null,
          estado: 'Pendiente',
        },
      };
    } catch (error) {
      console.error('Error solicitando diagnóstico:', error);
      throw new BadRequestException('Error al solicitar el diagnóstico: ' + (error as any).message);
    }
  }

  /**
   * Obtener servicios correctivos disponibles
   */
  async getCorrectiveServices() {
    try {
      const servicios = await this.prisma.catalogoServicios.findMany({
        where: {
          tipomantenimiento: {
            nombretipo: 'Correctivo',
          },
        },
        include: {
          tipomantenimiento: true,
        },
        orderBy: {
          descripcion: 'asc',
        },
      });

      return {
        success: true,
        total: servicios.length,
        servicios: servicios.map((s: any) => ({
          codservicio: s.codservicio,
          descripcion: s.descripcion,
          tipomantenimiento: s.tipomantenimiento?.nombretipo || 'N/A',
          tarifa: Number(s.tarifa || 0),
          duracion: s.duracion,
          marca: s.marca,
          modelo: s.modelo,
        })),
      };
    } catch (error) {
      console.error('Error obteniendo servicios correctivos:', error);
      throw new BadRequestException('Error al obtener servicios correctivos: ' + (error as any).message);
    }
  }

  /**
   * Obtener operario disponible para un servicio correctivo
   */
  async getAvailableOperarioForService(fecha: string, horainicio: string) {
    try {
      // Obtener operario disponible en esa fecha y hora
      const operario = await (this.prisma as any).$queryRaw`
        SELECT 
          e."idempleado",
          e."nombres",
          e."apepaterno",
          e."apematerno",
          e."especialidad"
        FROM "empleado" e
        INNER JOIN "dispoperario" "dispop" ON e."idempleado" = "dispop"."idempleado"
        INNER JOIN "horariodisp" hd ON "dispop"."codhorariodisp" = hd."codhorariodisp"
        WHERE hd."fecha"::date = ${fecha}::date
        AND TO_CHAR(hd."horainicio", 'HH24:MI:SS') = ${horainicio}
        LIMIT 1
      `;

      if (operario && operario.length > 0) {
        const op = operario[0];
        return {
          success: true,
          operario: {
            idempleado: op.idempleado,
            nombres: op.nombres,
            apepaterno: op.apepaterno,
            apematerno: op.apematerno,
            especialidad: op.especialidad || 'General',
            nombreCompleto: `${op.nombres} ${op.apepaterno || ''} ${op.apematerno || ''}`.trim(),
          },
        };
      }

      return {
        success: false,
        operario: null,
        message: 'No hay operario disponible en esa fecha y hora',
      };
    } catch (error) {
      console.error('Error obteniendo operario disponible:', error);
      throw new BadRequestException('Error al obtener operario: ' + (error as any).message);
    }
  }

  /**
   * Solicitar servicio correctivo
   */
  async requestCorrectiveService(
    userId: number,
    correctiveData: {
      codvehiculo: string;
      codservicio: string;
      fecha: string;
      horainicio: string;
      idempleado?: number;
    },
  ) {
    try {
      const dnicliente = await this.getClientDniByUserId(userId);

      // Generar código de ticket único
      const timestamp = Date.now().toString().slice(-5);
      const random = Math.floor(Math.random() * 900) + 100;
      const codticket = `C${timestamp}${random}`.substring(0, 8);

      // Obtener lote activo
      const lote = await this.getActiveLote();
      if (!lote) {
        throw new BadRequestException('No hay lote activo disponible');
      }

      // Obtener supervisor disponible
      const supervisor = await this.getAvailableSupervisor();
      if (!supervisor) {
        throw new BadRequestException('No hay supervisor disponible');
      }

      // Crear ticket para servicio correctivo
      const ticket = await this.prisma.ticket.create({
        data: {
          codticket,
          codloteticket: lote,
          idsupervisor: supervisor,
          fecha: new Date(correctiveData.fecha),
          horainiestimada: correctiveData.horainicio ? new Date(`1970-01-01T${correctiveData.horainicio}`) : undefined,
          estado: 1, // Estado inicial: Pendiente
          dnicliente,
          codvehiculo: correctiveData.codvehiculo,
        },
      });

      // Crear mantenimiento correctivo
      const codmantenimiento = `M${timestamp}${random}`.substring(0, 8);
      const mantenimiento = await this.prisma.mantenimientos.create({
        data: {
          codmantenimiento,
          codticket,
          codservicio: correctiveData.codservicio,
          fecharealiza: new Date(correctiveData.fecha),
          estado: 1, // Estado inicial: Pendiente
          idestadomantenimiento: 1,
        },
      });

      // Asignar operario si se proporciona
      if (correctiveData.idempleado) {
        await this.prisma.asignarOperario.create({
          data: {
            codoperarioxticket: `O${timestamp}${random}`.substring(0, 8),
            idempleado: correctiveData.idempleado,
            codticket,
          },
        });
      }

      return {
        success: true,
        message: 'Servicio correctivo solicitado exitosamente',
        ticket: {
          codticket,
          codmantenimiento,
          fecha: correctiveData.fecha,
          horainicio: correctiveData.horainicio,
          supervisor,
          operario: correctiveData.idempleado || null,
        },
      };
    } catch (error) {
      console.error('Error solicitando servicio correctivo:', error);
      throw new BadRequestException(
        'Error al solicitar servicio correctivo: ' + (error as any).message,
      );
    }
  }

  /**
   * Solicitar servicio preventivo
   */
  async requestPreventiveService(
    userId: number,
    preventiveData: {
      codvehiculo: string;
      codhorariodisp: string;
      kilometraje: number;
    },
  ) {
    try {
      const dnicliente = await this.getClientDniByUserId(userId);

      // Generar código de ticket único
      const timestamp = Date.now().toString().slice(-5);
      const random = Math.floor(Math.random() * 900) + 100;
      const codticket = `P${timestamp}${random}`.substring(0, 8);

      // Obtener datos del horario disponible
      const horario = await this.prisma.horarioDisp.findUnique({
        where: { codhorariodisp: preventiveData.codhorariodisp },
      });

      if (!horario) {
        throw new BadRequestException('Horario no disponible');
      }

      // Obtener lote activo
      const lote = await this.getActiveLote();
      if (!lote) {
        throw new BadRequestException('No hay lote activo disponible');
      }

      // Obtener supervisor disponible
      const supervisor = await this.getAvailableSupervisor();
      if (!supervisor) {
        throw new BadRequestException('No hay supervisor disponible');
      }

      // Obtener operario asignado a ese horario
      const operarioDisp = await this.prisma.dispOperario.findFirst({
        where: { codhorariodisp: preventiveData.codhorariodisp },
      });

      // Crear ticket para servicio preventivo
      const ticket = await this.prisma.ticket.create({
        data: {
          codticket,
          codloteticket: lote,
          idsupervisor: supervisor,
          fecha: horario.fecha,
          horainiestimada: horario.horainicio,
          horafinestimada: horario.horafin,
          estado: 1, // Estado inicial: Pendiente
          dnicliente,
          codvehiculo: preventiveData.codvehiculo,
        },
      });

      // Obtener el servicio preventivo (asumir ID 1 para Preventivo generalmente)
      const servicioPreventivo = await this.prisma.catalogoServicios.findFirst({
        where: {
          tipomantenimiento: {
            nombretipo: 'Preventivo',
          },
        },
      });

      if (!servicioPreventivo) {
        throw new BadRequestException('No hay servicios preventivos disponibles');
      }

      // Crear mantenimiento preventivo
      const codmantenimiento = `M${timestamp}${random}`.substring(0, 8);
      const mantenimiento = await this.prisma.mantenimientos.create({
        data: {
          codmantenimiento,
          codticket,
          codservicio: servicioPreventivo.codservicio,
          fecharealiza: horario.fecha,
          monto: servicioPreventivo.tarifa,
          observaciones: `Kilometraje: ${preventiveData.kilometraje}`,
          estado: 1,
          idestadomantenimiento: 1,
        },
      });

      // Asignar operario si existe
      if (operarioDisp && operarioDisp.idempleado) {
        await this.prisma.asignarOperario.create({
          data: {
            codoperarioxticket: `O${timestamp}${random}`.substring(0, 8),
            idempleado: operarioDisp.idempleado,
            codticket,
          },
        });
      }

      return {
        success: true,
        message: 'Servicio preventivo solicitado exitosamente',
        ticket: {
          codticket,
          codmantenimiento,
          fecha: horario.fecha,
          horainicio: horario.horainicio,
          horafin: horario.horafin,
          supervisor,
          operario: operarioDisp?.idempleado || null,
          kilometraje: preventiveData.kilometraje,
        },
      };
    } catch (error) {
      console.error('Error solicitando servicio preventivo:', error);
      throw new BadRequestException(
        'Error al solicitar servicio preventivo: ' + (error as any).message,
      );
    }
  }
}

