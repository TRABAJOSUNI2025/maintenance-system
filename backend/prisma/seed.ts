import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  try {
    // Delete in correct order
    await prisma.$executeRawUnsafe(`DELETE FROM "empleadorol"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "empleado"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "usuario"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "rol"`);
    console.log("Cleaned existing data");
  } catch (e) {
    console.log("Cleanup error (tables may not exist):", (e as any).message);
  }

  // Create roles
  const rolAdmin = await prisma.rol.create({
    data: { nombrerol: "ADMINISTRADOR" },
  });

  const rolSupervisor = await prisma.rol.create({
    data: { nombrerol: "SUPERVISOR" },
  });

  const rolOperario = await prisma.rol.create({
    data: { nombrerol: "OPERARIO" },
  });

  const rolCliente = await prisma.rol.create({
    data: { nombrerol: "CLIENTE" },
  });

  console.log("✓ Created 4 roles");

  // Create admin user
  const adminUser = await prisma.usuario.create({
    data: {
      username: "admin",
      passwordhash:
        "$2b$10$N9qo8uLOickgx2ZMRZoMye", // bcrypt hash for testing
      correo: "admin@maintenance.local",
      estado: "A",
    },
  });

  const adminEmpleado = await prisma.empleado.create({
    data: {
      idusuario: adminUser.idusuario,
      dni: "12345678",
      nombres: "Admin",
      apepaterno: "System",
      apematerno: "User",
      telefono: "987654321",
      especialidad: "Administración",
    },
  });

  await prisma.empleadoRol.create({
    data: {
      idempleado: adminEmpleado.idempleado,
      idrol: rolAdmin.idrol,
    },
  });

  console.log("✓ Created admin user");

  // Create supervisor user
  const supervisorUser = await prisma.usuario.create({
    data: {
      username: "supervisor",
      passwordhash:
        "$2b$10$N9qo8uLOickgx2ZMRZoMye",
      correo: "supervisor@maintenance.local",
      estado: "A",
    },
  });

  const supervisorEmpleado = await prisma.empleado.create({
    data: {
      idusuario: supervisorUser.idusuario,
      dni: "87654321",
      nombres: "Carlos",
      apepaterno: "García",
      apematerno: "López",
      telefono: "987654322",
      especialidad: "Supervisión",
    },
  });

  await prisma.empleadoRol.create({
    data: {
      idempleado: supervisorEmpleado.idempleado,
      idrol: rolSupervisor.idrol,
    },
  });

  console.log("✓ Created supervisor user");

  // Create operator user
  const operarioUser = await prisma.usuario.create({
    data: {
      username: "operario",
      passwordhash:
        "$2b$10$N9qo8uLOickgx2ZMRZoMye",
      correo: "operario@maintenance.local",
      estado: "A",
    },
  });

  const operarioEmpleado = await prisma.empleado.create({
    data: {
      idusuario: operarioUser.idusuario,
      dni: "11223344",
      nombres: "Juan",
      apepaterno: "Pérez",
      apematerno: "Martínez",
      telefono: "987654323",
      especialidad: "Mecánica",
    },
  });

  await prisma.empleadoRol.create({
    data: {
      idempleado: operarioEmpleado.idempleado,
      idrol: rolOperario.idrol,
    },
  });

  console.log("✓ Created operator user");

  console.log("\n✅ Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
