import express from 'express';

export function criarApp() {
  const app = express();
  app.use(express.json());

  app.get('/saude', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
