import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
config();
const BACKEND_URL = process.env.VITE_BACKEND;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
