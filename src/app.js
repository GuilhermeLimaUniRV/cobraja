import express from 'express';

export function criarApp() {
  const app = express();
  app.use(express.json());

  // Health check: responde {"status":"ok"} para confirmar que o servidor está no ar.
  app.get('/saude', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
