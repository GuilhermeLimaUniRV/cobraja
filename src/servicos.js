// Feature 001: registro de serviços e controle de pagamento (docs/specs/001-registro-de-servicos.md).
// Dados em memória nesta feature (D-05).
import { Router } from 'express';
import { paraCentavos, paraTexto } from './dinheiro.js';

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const SITUACOES = ['pendente', 'pago'];

function vazio(valor) {
  return valor === undefined || valor === null || valor === '';
}

function textoComTamanho(valor, minimo, maximo) {
  if (typeof valor !== 'string') return false;
  const tamanho = valor.trim().length;
  return tamanho >= minimo && tamanho <= maximo;
}

function dataValida(valor) {
  if (typeof valor !== 'string' || !FORMATO_DATA.test(valor)) return false;
  const data = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

// D-11: primeiro as verificações da RN-08 na ordem da seção Dados, depois RN-01 e RN-02.
function validar(corpo, hoje) {
  if (!textoComTamanho(corpo.cliente, 2, 80)) return 'Campo inválido: cliente';
  if (!textoComTamanho(corpo.descricao, 3, 200)) return 'Campo inválido: descricao';
  if (vazio(corpo.valor)) return 'Campo inválido: valor';
  if (!dataValida(corpo.dataRealizacao)) return 'Campo inválido: dataRealizacao';
  if (paraCentavos(corpo.valor) === null) return 'Valor inválido';
  if (corpo.dataRealizacao > hoje) return 'Data de realização no futuro';
  return null;
}

function paraResposta(servico) {
  return { ...servico, valor: paraTexto(servico.valor) };
}

export function rotasDeServicos({ hoje }) {
  const rotas = Router();
  const servicos = [];

  rotas.post('/', (req, res) => {
    const corpo = req.body ?? {};
    const erro = validar(corpo, hoje());
    if (erro) return res.status(400).json({ mensagem: erro });

    const servico = {
      id: servicos.length + 1,
      cliente: corpo.cliente.trim(),
      descricao: corpo.descricao.trim(),
      valor: paraCentavos(corpo.valor),
      dataRealizacao: corpo.dataRealizacao,
      situacao: 'pendente',
      dataPagamento: null,
    };
    servicos.push(servico);
    res.status(201).json(paraResposta(servico));
  });

  rotas.get('/', (req, res) => {
    const { situacao } = req.query;
    if (situacao !== undefined && !SITUACOES.includes(situacao)) {
      return res.status(400).json({ mensagem: 'Campo inválido: situacao' });
    }
    // RN-07: data de realização crescente, desempate por id.
    const lista = servicos
      .filter((s) => situacao === undefined || s.situacao === situacao)
      .sort((a, b) => a.dataRealizacao.localeCompare(b.dataRealizacao) || a.id - b.id);
    res.json(lista.map(paraResposta));
  });

  // RN-06: soma em centavos só dos pendentes.
  rotas.get('/total-a-receber', (req, res) => {
    const pendentes = servicos.filter((s) => s.situacao === 'pendente');
    const total = pendentes.reduce((soma, s) => soma + s.valor, 0);
    res.json({ total: paraTexto(total), quantidadePendentes: pendentes.length });
  });

  rotas.post('/:id/pagamento', (req, res) => {
    const servico = servicos.find((s) => String(s.id) === req.params.id);
    if (!servico) return res.status(404).json({ mensagem: 'Serviço não encontrado' });
    if (servico.situacao === 'pago') return res.status(409).json({ mensagem: 'Serviço já está pago' });

    servico.situacao = 'pago';
    servico.dataPagamento = hoje();
    res.json(paraResposta(servico));
  });

  return rotas;
}
