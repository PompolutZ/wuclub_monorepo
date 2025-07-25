/// <reference types="vite-plugin-svgr/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@icons": path.resolve(__dirname, "./src/svgs"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@wudb": path.resolve(__dirname, "./src/data/wudb"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("wudb/db")) return "db";
        },
      },
    },
  },
});
