import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarApp } from '../src/app.js';

test('GET /saude responde ok', async () => {
  const servidor = criarApp().listen(0);
  const { port } = servidor.address();
  try {
    const resposta = await fetch(`http://localhost:${port}/saude`);
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), { status: 'ok' });
  } finally {
    servidor.close();
  }
});
