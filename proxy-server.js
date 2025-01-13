import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Proxy all /api requests to port 8081
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8081',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api': ''
  }
}));

// Serve static files from public directory
app.use(express.static('public'));

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});