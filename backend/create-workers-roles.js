const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function upsertTrabajador(correo, username, dni, nombre, apepaterno, rolNombre) {
  try {
    // Verificar o crear rol
    const rol = await prisma.rol.upsert({
      where: { nombrerol: rolNombre },
      update: {},
      create: { nombrerol: rolNombre }
    });

    // Verificar o crear usuario
    let usuario = await prisma.usuario.findUnique({ where: { correo } });
    
    if (!usuario) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      usuario = await prisma.usuario.create({
        data: {
          username,
          correo,
          passwordhash: hashedPassword,
          estado: 'A'
        }
      });
    }

    // Verificar o crear empleado
    let empleado = await prisma.empleado.findUnique({
      where: { idusuario: usuario.idusuario }
    });

    if (!empleado) {
      empleado = await prisma.empleado.create({
        data: {
          idusuario: usuario.idusuario,
          dni,
          nombres: nombre,
          apepaterno: apepaterno
        }
      });
    }

    // Verificar o crear relación empleado-rol
    const existeRol = await prisma.empleadorol.findUnique({
      where: { idempleado_idrol: { idempleado: empleado.idempleado, idrol: rol.idrol } }
    });

    if (!existeRol) {
      await prisma.empleadorol.create({
        data: {
          idempleado: empleado.idempleado,
          idrol: rol.idrol
        }
      });
    }

    return { correo, rol: rolNombre };
  } catch (error) {
    console.error(`Error creando ${correo}:`, error.message);
    return null;
  }
}

async function main() {
  try {
    console.log('Creando/Verificando trabajadores con roles...\n');

    const trabajadores = [
      { correo: 'admin@test.com', username: 'admin1', dni: '11111111', nombre: 'Administrador', apepaterno: 'Test', rol: 'ADMINISTRADOR' },
      { correo: 'supervisor@test.com', username: 'supervisor1', dni: '22222222', nombre: 'Supervisor', apepaterno: 'Test', rol: 'SUPERVISOR' },
      { correo: 'operario@test.com', username: 'operario1', dni: '33333333', nombre: 'Operario', apepaterno: 'Test', rol: 'OPERARIO' }
    ];

    for (const trab of trabajadores) {
      const result = await upsertTrabajador(
        trab.correo,
        trab.username,
        trab.dni,
        trab.nombre,
        trab.apepaterno,
        trab.rol
      );
      if (result) {
        console.log(`✓ ${result.rol}: ${result.correo}`);
      }
    }

    console.log('\n=== RESUMEN DE USUARIOS DE PRUEBA ===\n');
    console.log('CLIENTES (Seleccionar "Cliente" en login):');
    console.log('  - cliente1@test.com / password123\n');
    console.log('TRABAJADORES (Seleccionar "Trabajador" en login):');
    console.log('  - admin@test.com / password123 (Rol: ADMINISTRADOR)');
    console.log('  - supervisor@test.com / password123 (Rol: SUPERVISOR)');
    console.log('  - operario@test.com / password123 (Rol: OPERARIO)\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
