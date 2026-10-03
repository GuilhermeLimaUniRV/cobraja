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
