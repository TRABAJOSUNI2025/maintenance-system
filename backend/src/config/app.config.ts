export const appConfig = () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  apiPrefix: "api",
  version: "1.0.0",
});
