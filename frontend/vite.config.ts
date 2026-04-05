import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:8081",
      "/products": "http://localhost:8081",
      "/customer": "http://localhost:8081",
      "/supplier": "http://localhost:8081",
      "/api": "http://localhost:8081",
      "/grn": "http://localhost:8081",
      "/invoices": "http://localhost:8081",
    },
  },
});
