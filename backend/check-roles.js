const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const empleados = await prisma.empleado.findMany({
      include: { empleadorol: { include: { rol: true } } }
    });
    
    console.log('=== EMPLEADOS Y SUS ROLES ===\n');
    empleados.forEach(emp => {
      console.log(`Empleado: ${emp.nombres} ${emp.apepaterno}`);
      console.log(`  idempleado: ${emp.idempleado}`);
      console.log(`  idusuario: ${emp.idusuario}`);
      console.log(`  Roles asignados: ${emp.empleadorol.length}`);
      emp.empleadorol.forEach(er => {
        console.log(`    - ${er.rol.nombrerol} (idrol: ${er.rol.idrol})`);
      });
      console.log('');
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
