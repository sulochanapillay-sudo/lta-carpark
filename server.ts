import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import healthHandler from './api/health';
import carparkHandler from './api/carparkavalibility';
import busArrivalHandler from './api/busarrival';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serverless API routes
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/carparkavalibility', (req, res) => carparkHandler(req, res));
  app.all('/api/carparkavailability', (req, res) => carparkHandler(req, res));
  app.all('/api/busarrival', (req, res) => busArrivalHandler(req, res));

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
