# AGENTS.md — CobraJá

Micro-SaaS para pequenos prestadores de serviço registrarem serviços e saberem quem ainda não pagou.

## Comandos

```bash
npm install          # instala as dependências (versões fixadas no package.json)
cp .env.example .env # configuração local; o .env nunca é commitado
npm run dev          # sobe em http://localhost:3000 (GET /saude responde {"status":"ok"})
npm test             # roda todos os testes (node --test); passa antes de todo commit
npm run lint         # ESLint; zero erros antes de todo commit
npm run check:ca -- 001  # lista os CA-xx da spec 001 sem teste; falha enquanto faltar algum
```

## API (feature 001; rotas em `docs/specs/001-plano.md`)

```bash
curl -X POST localhost:3000/servicos -H "content-type: application/json" \
  -d '{"cliente":"Maria Souza","descricao":"Troca de chuveiro","valor":150,"dataRealizacao":"2026-10-01"}'
curl localhost:3000/servicos?situacao=pendente   # lista (filtro opcional: pendente | pago)
curl -X POST localhost:3000/servicos/1/pagamento  # marca como pago
curl localhost:3000/servicos/total-a-receber      # { total, quantidadePendentes }
```

No Windows, o `curl.exe` não envia acentos em UTF-8 quando o JSON vai direto na linha de comando: teste acentos com `npm test`, não com o curl.

## Stack

Node.js 24 · Express 5.2 · testes com `node:test` (nativo) · ESLint 10 · ES Modules (`import`/`export`).

## Estrutura

- `src/`: código da aplicação (`app.js` monta as rotas, `server.js` só sobe o servidor)
- `scripts/`: utilitários do projeto (`verificar-cas.js`) · `test/`: testes; um arquivo por feature, um teste por critério de aceite (CA-xx)
- `docs/specs/`: specs das features (`NNN-<feature>.md`), fonte da verdade · `docs/harness/`: relatórios do harness

## Regras do projeto

- Toda feature começa por uma spec em `docs/specs/`. Sem spec aprovada, não há código.
- A spec é a fonte da verdade. Se a implementação precisar mudar um comportamento, mude a spec primeiro, no mesmo pull request.
- Cada critério de aceite vira um teste com o id no nome (ex.: `CA-03: data futura é rejeitada`), num arquivo `test/NNN-<feature>.test.js`. Uma feature só está pronta quando `npm test` passa **e** `npm run check:ca -- NNN` passa.
- No plano de tarefas, confira o "Dado que" e o "E" de cada critério: se ele usa uma rota de outra tarefa, essa tarefa vem antes.
- Para parar um servidor, encerre só o processo dele (pelo PID), nunca todos os processos `node`.
- Valores em dinheiro são guardados em centavos (inteiro), nunca em ponto flutuante.
- Mensagem de commit cita a spec e o critério: `feat(001): marca serviço como pago (CA-04)`.
- Nunca leia, imprima ou commite o `.env` nem qualquer token, senha ou chave.

## Como você deve trabalhar

- Declare suas suposições. Se o pedido admite duas leituras, pergunte antes de escolher uma.
- Faça o mínimo que resolve. Sem abstração de uso único, sem opção que ninguém pediu, sem tratar erro que não acontece.
- Toque só no necessário. Mantenha o estilo do arquivo e não refatore código que funciona e não faz parte do pedido.
- Diga como vai provar que funcionou (qual teste, qual comando) e rode a prova antes de dizer que terminou.

## Servidores MCP

Nenhum instalado.
