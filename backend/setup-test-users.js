const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NO configurada');
    console.log('Creando/Verificando trabajadores...\n');

    // Crear rol ADMINISTRADOR
    const adminRol = await prisma.rol.upsert({
      where: { nombrerol: 'ADMINISTRADOR' },
      update: {},
      create: { nombrerol: 'ADMINISTRADOR' }
    });
    console.log('✓ Rol ADMINISTRADOR verificado');

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUsuario = await prisma.usuario.upsert({
      where: { correo: 'admin@test.com' },
      update: {},
      create: {
        username: 'admin1',
        correo: 'admin@test.com',
        passwordhash: hashedPassword,
        estado: 'A'
      }
    });
    console.log('✓ Usuario admin@test.com creado/verificado');

    // Crear empleado admin
    const adminEmpleado = await prisma.empleado.upsert({
      where: { idusuario: adminUsuario.idusuario },
      update: {},
      create: {
        idusuario: adminUsuario.idusuario,
        dni: '11111111',
        nombres: 'Administrador',
        apepaterno: 'Test'
      }
    });
    console.log('✓ Empleado admin creado/verificado');

    // Crear relación empleado-rol
    try {
      const relation = await prisma.empleadorol.create({
        data: {
          idempleado: adminEmpleado.idempleado,
          idrol: adminRol.idrol
        }
      });
      console.log('✓ Relación ADMINISTRADOR asignada');
    } catch (e) {
      if (e.code === 'P2002') {
        console.log('  (Relación ADMINISTRADOR ya existía)');
      } else {
        console.log('  Error al asignar relación:', e.message);
      }
    }

    console.log('\n=== USUARIOS DE PRUEBA ===\n');
    console.log('CLIENTE:');
    console.log('  - cliente1@test.com / password123\n');
    console.log('TRABAJADOR (ADMINISTRADOR):');
    console.log('  - admin@test.com / password123\n');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
