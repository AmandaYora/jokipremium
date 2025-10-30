import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/minjo": {
        target: "https://jokipremium-ai-serverless-kphz1pnpl-amandas-projects-9da91613.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/minjo/, "/chat"),
      },
    },
  },
  preview: {
    proxy: {
      "/api/minjo": {
        target: "https://jokipremium-ai-serverless-kphz1pnpl-amandas-projects-9da91613.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/minjo/, "/chat"),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
