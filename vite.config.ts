import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import type { Connect, ViteDevServer } from 'vite';
import type { ServerResponse } from 'http';

// Custom plugin to handle admin routes
const adminRoutePlugin = () => ({
  name: 'admin-route',
  configureServer(server: ViteDevServer) {
    return () => {
      server.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url?.startsWith('/admin')) {
          const adminPath = path.resolve(__dirname, 'public/admin/index.html');
          try {
            const content = fs.readFileSync(adminPath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            return res.end(content);
          } catch (e) {
            console.error('Error serving admin page:', e);
            return next();
          }
        }
        next();
      });
    };
  }
});

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/.netlify': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    adminRoutePlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));