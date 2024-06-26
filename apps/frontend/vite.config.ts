/// <reference types="vite-plugin-svgr/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";
// const reactSvgPlugin = require('vite-plugin-react-svg');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@icons": path.resolve(__dirname, "./src/svgs"),
      "@components": path.resolve(__dirname, "./src/v2/components"),
      "@wudb": path.resolve(__dirname, "./src/data/wudb"),
    },
  },
  plugins: [react(), svgr()],
});
