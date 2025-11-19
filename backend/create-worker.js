const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear usuario trabajador
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const usuario = await prisma.usuario.create({
      data: {
        username: 'trabajador2',
        correo: 'trabajador2@test.com',
        passwordhash: hashedPassword,
        estado: 'A'
      }
    });

    console.log('✓ Usuario creado:', {
      id: usuario.idusuario,
      correo: usuario.correo,
      username: usuario.username
    });

    // Crear empleado
    const empleado = await prisma.empleado.create({
      data: {
        idusuario: usuario.idusuario,
        dni: '99999999',
        nombres: 'Trabajador',
        apepaterno: 'Test'
      }
    });

    console.log('✓ Empleado creado:', {
      id: empleado.idempleado,
      dni: empleado.dni,
      nombres: empleado.nombres
    });

    console.log('\n✓ Trabajador de prueba creado exitosamente');
    console.log('Credenciales: trabajador1@test.com / password123');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
