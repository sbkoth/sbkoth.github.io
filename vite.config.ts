import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Root-relative base so the app serves from the deployment root:
// - User site / custom domain: https://sbkoth.github.io/  → paths ./assets, ./data
// - Project Pages: https://sbkoth.github.io/sbkoth-intro-page/ → same relative to that folder
// Absolute "/" would break project Pages (assets would hit github.io/assets, not the repo path).
const base = process.env.VITE_BASE ?? "./";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client", "public"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
});
