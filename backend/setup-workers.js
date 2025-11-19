const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creando trabajadores con roles...\n');

    // 1. Crear roles si no existen
    const roles = ['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO'];
    for (const rolName of roles) {
      await prisma.rol.upsert({
        where: { nombrerol: rolName },
        update: {},
        create: { nombrerol: rolName }
      });
    }
    console.log('✓ Roles verificados\n');

    // 2. Datos de trabajadores
    const trabajadores = [
      { correo: 'admin@test.com', username: 'admin1', dni: '11111111', nombre: 'Administrador', apepaterno: 'Test', rol: 'ADMINISTRADOR' },
      { correo: 'supervisor@test.com', username: 'supervisor1', dni: '22222222', nombre: 'Supervisor', apepaterno: 'Test', rol: 'SUPERVISOR' },
      { correo: 'operario@test.com', username: 'operario1', dni: '33333333', nombre: 'Operario', apepaterno: 'Test', rol: 'OPERARIO' }
    ];

    // 3. Crear cada trabajador
    for (const trab of trabajadores) {
      try {
        // Crear o verificar usuario
        let usuario = await prisma.usuario.findUnique({
          where: { correo: trab.correo }
        });

        if (!usuario) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          usuario = await prisma.usuario.create({
            data: {
              username: trab.username,
              correo: trab.correo,
              passwordhash: hashedPassword,
              estado: 'A'
            }
          });
          console.log(`✓ Usuario creado: ${trab.correo}`);
        } else {
          console.log(`• Usuario existe: ${trab.correo}`);
        }

        // Crear o verificar empleado
        let empleado = await prisma.empleado.findUnique({
          where: { idusuario: usuario.idusuario }
        });

        if (!empleado) {
          empleado = await prisma.empleado.create({
            data: {
              idusuario: usuario.idusuario,
              dni: trab.dni,
              nombres: trab.nombre,
              apepaterno: trab.apepaterno
            }
          });
          console.log(`✓ Empleado creado: ${trab.nombre}`);
        } else {
          console.log(`• Empleado existe: ${trab.nombre}`);
        }

        // Obtener rol
        const rol = await prisma.rol.findUnique({
          where: { nombrerol: trab.rol }
        });

        // Crear relación usando SQL raw
        await prisma.$executeRaw`
          INSERT INTO empleadorol (idempleado, idrol)
          VALUES (${empleado.idempleado}, ${rol.idrol})
          ON CONFLICT DO NOTHING
        `;
        console.log(`✓ Rol asignado: ${trab.rol}\n`);

      } catch (error) {
        console.error(`✗ Error con ${trab.correo}: ${error.message}\n`);
      }
    }

    console.log('=== USUARIOS DE PRUEBA CREADOS ===\n');
    console.log('CLIENTES (Seleccionar "Cliente" en login):');
    console.log('  - cliente1@test.com / password123\n');
    console.log('TRABAJADORES (Seleccionar "Trabajador" en login):');
    console.log('  - admin@test.com / password123 (Rol: ADMINISTRADOR)');
    console.log('  - supervisor@test.com / password123 (Rol: SUPERVISOR)');
    console.log('  - operario@test.com / password123 (Rol: OPERARIO)\n');

  } catch (error) {
    console.error('Error fatal:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
