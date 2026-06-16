import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The dev server proxies API + WebSocket calls to the Node gateway so the
// frontend never talks to brokers or the Python service directly.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_GATEWAY_URL || "http://127.0.0.1:8791",
        changeOrigin: true,
      },
      "/ws": {
        target: process.env.VITE_GATEWAY_WS || "ws://127.0.0.1:8791",
        ws: true,
      },
    },
  },
});
