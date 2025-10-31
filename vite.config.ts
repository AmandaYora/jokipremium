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
        target: "https://jokipremium-ai-serverless.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/minjo/, "/api/chat"),
      },
      "/api/sessions": {
        target: "https://jokipremium-ai-serverless.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/sessions/, "/api/sessions"),
      },
    },
  },
  preview: {
    proxy: {
      "/api/minjo": {
        target: "https://jokipremium-ai-serverless.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/minjo/, "/api/chat"),
      },
      "/api/sessions": {
        target: "https://jokipremium-ai-serverless.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/sessions/, "/api/sessions"),
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
