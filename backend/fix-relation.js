const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Buscando datos...\n');

    // Buscar rol
    const adminRol = await prisma.rol.findUnique({
      where: { nombrerol: 'ADMINISTRADOR' }
    });
    console.log('Rol ADMINISTRADOR:', adminRol?.idrol);

    // Buscar empleado con dni 11111111
    const adminEmpleado = await prisma.empleado.findUnique({
      where: { dni: '11111111' }
    });
    console.log('Empleado admin:', adminEmpleado?.idempleado);

    if (adminRol && adminEmpleado) {
      // Intentar crear relación
      console.log('\nIntentando crear relación...');
      try {
        const relation = await prisma.empleadorol.create({
          data: {
            idempleado: adminEmpleado.idempleado,
            idrol: adminRol.idrol
          }
        });
        console.log('✓ Relación creada:', relation);
      } catch (e) {
        console.log('Relación ya existía o error:', e.message);
      }
    } else {
      console.log('\n✗ No se encontraron rol o empleado');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
