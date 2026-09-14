import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(rootDir, "github-pages"),
  base: "./",
  publicDir: path.join(rootDir, "public"),
  plugins: [react()],
  resolve: { alias: { "@": rootDir } },
  css: { postcss: path.join(rootDir, "postcss.config.mjs") },
  define: { "import.meta.env.VITE_STATIC_MODE": JSON.stringify("true") },
  build: { outDir: path.join(rootDir, "github-pages-dist"), emptyOutDir: true },
});
