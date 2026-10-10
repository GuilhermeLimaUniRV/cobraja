// Um teste por critério de aceite da spec 001 (docs/specs/001-registro-de-servicos.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarApp } from '../src/app.js';

const HOJE = '2026-10-03';

// Sobe um app novo (sem serviços) com a data de hoje fixa e devolve uma função de requisição.
async function novaApi(t) {
  const servidor = criarApp({ hoje: () => HOJE }).listen(0);
  t.after(() => servidor.close());
  const base = `http://localhost:${servidor.address().port}`;
  return async (metodo, caminho, corpo) => {
    const resposta = await fetch(base + caminho, {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    return { status: resposta.status, corpo: await resposta.json() };
  };
}

function servico(campos = {}) {
  return {
    cliente: 'Maria Souza',
    descricao: 'Troca de chuveiro',
    valor: 150.0,
    dataRealizacao: HOJE,
    ...campos,
  };
}

test('CA-01: registrar serviço válido', async (t) => {
  const api = await novaApi(t);
  const r = await api('POST', '/servicos', servico());
  assert.equal(r.status, 201);
  assert.equal(r.corpo.id, 1);
  assert.equal(r.corpo.valor, '150.00');
  assert.equal(r.corpo.situacao, 'pendente');
  assert.equal(r.corpo.dataPagamento, null);
});

test('CA-02: valor inválido é rejeitado', async (t) => {
  const api = await novaApi(t);
  const r = await api('POST', '/servicos', servico({ valor: 0 }));
  assert.equal(r.status, 400);
  assert.equal(r.corpo.mensagem, 'Valor inválido');
  assert.deepEqual((await api('GET', '/servicos')).corpo, []);
});

test('CA-03: data futura é rejeitada', async (t) => {
  const api = await novaApi(t);
  const r = await api('POST', '/servicos', servico({ dataRealizacao: '2026-10-04' }));
  assert.equal(r.status, 400);
  assert.equal(r.corpo.mensagem, 'Data de realização no futuro');
  assert.deepEqual((await api('GET', '/servicos')).corpo, []);
});

test('CA-09: campo obrigatório ausente', async (t) => {
  const api = await novaApi(t);
  const { cliente, valor, ...semClienteNemValor } = servico();
  assert.ok(cliente && valor);
  const r = await api('POST', '/servicos', semClienteNemValor);
  assert.equal(r.status, 400);
  assert.equal(r.corpo.mensagem, 'Campo inválido: cliente');
  assert.deepEqual((await api('GET', '/servicos')).corpo, []);
});

test('CA-10: data em formato errado', async (t) => {
  const api = await novaApi(t);
  const r = await api('POST', '/servicos', servico({ dataRealizacao: '03/10/2026' }));
  assert.equal(r.status, 400);
  assert.equal(r.corpo.mensagem, 'Campo inválido: dataRealizacao');
});

test('CA-11: limite máximo do valor', async (t) => {
  const api = await novaApi(t);
  const primeiro = await api('POST', '/servicos', servico({ valor: 100000.0 }));
  assert.equal(primeiro.status, 201);
  assert.equal(primeiro.corpo.valor, '100000.00');
  const segundo = await api('POST', '/servicos', servico({ valor: 100000.01 }));
  assert.equal(segundo.status, 400);
  assert.equal(segundo.corpo.mensagem, 'Valor inválido');
});

test('CA-04: marcar como pago', async (t) => {
  const api = await novaApi(t);
  await api('POST', '/servicos', servico());
  const r = await api('POST', '/servicos/1/pagamento');
  assert.equal(r.status, 200);
  assert.equal(r.corpo.id, 1);
  assert.equal(r.corpo.situacao, 'pago');
  assert.equal(r.corpo.dataPagamento, '2026-10-03');
});

test('CA-05: não paga duas vezes', async (t) => {
  const api = await novaApi(t);
  await api('POST', '/servicos', servico());
  const pago = await api('POST', '/servicos/1/pagamento');
  const r = await api('POST', '/servicos/1/pagamento');
  assert.equal(r.status, 409);
  assert.equal(r.corpo.mensagem, 'Serviço já está pago');
  const [depois] = (await api('GET', '/servicos')).corpo;
  assert.equal(depois.dataPagamento, pago.corpo.dataPagamento);
});

test('CA-08: serviço inexistente', async (t) => {
  const api = await novaApi(t);
  const r = await api('POST', '/servicos/99/pagamento');
  assert.equal(r.status, 404);
  assert.equal(r.corpo.mensagem, 'Serviço não encontrado');
});

test('CA-07: filtro de pendentes', async (t) => {
  const api = await novaApi(t);
  await api('POST', '/servicos', servico({ cliente: 'Ana', dataRealizacao: '2026-10-02' }));
  await api('POST', '/servicos', servico({ cliente: 'Bruno', dataRealizacao: '2026-09-28' }));
  await api('POST', '/servicos', servico({ cliente: 'Carla', dataRealizacao: '2026-09-01' }));
  await api('POST', '/servicos/3/pagamento');
  const r = await api('GET', '/servicos?situacao=pendente');
  assert.equal(r.status, 200);
  assert.deepEqual(r.corpo.map((s) => s.cliente), ['Bruno', 'Ana']);
});

test('CA-13: desempate na listagem', async (t) => {
  const api = await novaApi(t);
  await api('POST', '/servicos', servico({ cliente: 'Primeiro', dataRealizacao: '2026-10-01' }));
  await api('POST', '/servicos', servico({ cliente: 'Segundo', dataRealizacao: '2026-10-01' }));
  await api('POST', '/servicos', servico({ cliente: 'Mais antigo', dataRealizacao: '2026-09-15' }));
  const r = await api('GET', '/servicos');
  assert.deepEqual(r.corpo.map((s) => s.id), [3, 1, 2]);
});

test('CA-06: total a receber', async (t) => {
  const api = await novaApi(t);
  await api('POST', '/servicos', servico({ valor: 150.0 }));
  await api('POST', '/servicos', servico({ valor: 89.9 }));
  await api('POST', '/servicos', servico({ valor: 200.0 }));
  await api('POST', '/servicos/3/pagamento');
  const r = await api('GET', '/servicos/total-a-receber');
  assert.equal(r.status, 200);
  assert.deepEqual(r.corpo, { total: '239.90', quantidadePendentes: 2 });
});

test('CA-12: total sem pendentes', async (t) => {
  const api = await novaApi(t);
  await api('POST', '/servicos', servico());
  await api('POST', '/servicos/1/pagamento');
  const r = await api('GET', '/servicos/total-a-receber');
  assert.deepEqual(r.corpo, { total: '0.00', quantidadePendentes: 0 });
});
