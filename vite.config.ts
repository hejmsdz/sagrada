import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    ...process.env.SENTRY_AUTH_TOKEN ? [sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "hejmsdz",
      project: "sagrada",
    })] : [],
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,bin,json}'],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
