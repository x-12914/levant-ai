import "dotenv/config";

export const config = {
  host: process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.PORT ?? 8081),
  aiServiceUrl: process.env.AI_SERVICE_URL ?? "http://127.0.0.1:8082",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET ?? "change-me-in-production",
};
