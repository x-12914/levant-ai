import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { request } from "undici";
import { config } from "./config.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: config.corsOrigins, credentials: true });
await app.register(websocket);

// ── Health ────────────────────────────────────────────────────────────────
app.get("/api/health", async () => ({ ok: true, service: "gateway" }));

// ── Proxy to the Python AI/aggregation service ──────────────────────────────
// The browser never reaches the AI service or brokers directly; everything
// flows through this BFF so auth and rate limiting live in one place.
app.all("/api/ai/*", async (req, reply) => {
  const upstreamPath = req.url.replace(/^\/api\/ai/, "");
  const res = await request(`${config.aiServiceUrl}${upstreamPath}`, {
    method: req.method as never,
    headers: { "content-type": "application/json" },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body ?? {}),
  });
  reply.code(res.statusCode);
  // Preserve content-type so SSE streams (AskAI) pass through as event-streams.
  const ct = res.headers["content-type"];
  if (ct) reply.header("content-type", ct);
  return res.body;
});

// ── Read-only realtime feed ─────────────────────────────────────────────────
// In production this fans out account/market updates from Redis pub/sub.
app.get("/ws/feed", { websocket: true }, (socket) => {
  socket.send(JSON.stringify({ type: "hello", service: "gateway" }));
  const timer = setInterval(() => {
    socket.send(JSON.stringify({ type: "heartbeat", ts: Date.now() }));
  }, 15000);
  socket.on("close", () => clearInterval(timer));
});

app
  .listen({ host: config.host, port: config.port })
  .then(() => app.log.info(`gateway on http://${config.host}:${config.port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
