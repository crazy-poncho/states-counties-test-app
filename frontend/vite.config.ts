import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

/** Keep the browser Host so the API can build same-origin detail URLs. */
const apiProxy: ProxyOptions = {
  target: "http://localhost:3000",
  changeOrigin: false,
  configure(proxy) {
    proxy.on("proxyReq", (proxyReq, req) => {
      const host = req.headers.host;
      if (host) {
        proxyReq.setHeader("x-forwarded-host", host);
      }
      proxyReq.setHeader("x-forwarded-proto", "http");
    });
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/health": apiProxy,
      "/states": apiProxy,
      "/state": apiProxy,
    },
  },
});
