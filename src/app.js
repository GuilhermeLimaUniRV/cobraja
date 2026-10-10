import express from 'express';
import { rotasDeServicos } from './servicos.js';

// Data de hoje no fuso de Brasília, no formato AAAA-MM-DD (spec 001, D-06).
export function hojeEmBrasilia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

export function criarApp({ hoje = hojeEmBrasilia } = {}) {
  const app = express();
  app.use(express.json());

  // Health check: responde {"status":"ok"} para confirmar que o servidor está no ar.
  app.get('/saude', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/servicos', rotasDeServicos({ hoje }));

  return app;
}
