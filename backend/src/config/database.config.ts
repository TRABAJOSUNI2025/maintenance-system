export const databaseConfig = () => ({
  url:
    process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/maintenance_db",
  provider: "postgresql",
});
