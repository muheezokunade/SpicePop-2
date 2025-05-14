import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    babel: {
      babelrc: false,
      configFile: false,
      plugins: [
        ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]
      ]
    }
  })],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      "react": path.resolve(__dirname, "node_modules", "react"),
      "react-dom": path.resolve(__dirname, "node_modules", "react-dom"),
    },
  },
  root: path.resolve(__dirname, "client"),
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html"),
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
          'vendor': [
            '@tanstack/react-query',
            'wouter',
            'framer-motion',
            'date-fns',
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime']
  },
  ssr: {
    noExternal: ['@vitejs/plugin-react']
  }
});
