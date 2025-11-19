const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Asignar rol OPERARIO al empleado sin rol (idempleado: 5)
    await prisma.$executeRaw`
      INSERT INTO empleadorol (idempleado, idrol)
      VALUES (5, 7)
      ON CONFLICT DO NOTHING
    `;
    console.log('✓ Rol OPERARIO asignado a empleado 5');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();
