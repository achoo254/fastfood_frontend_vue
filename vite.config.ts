import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  server: {
    https: false,
    // Listening on all local IPs
    host: true,
    port: 8017,
    //disable warning socket
    strictPort: true,
    hmr: { clientPort: 8017 },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
    },
  },
})