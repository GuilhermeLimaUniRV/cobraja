# Diário do agente — feature 001

Feature: registro de serviços e controle de pagamento ([spec](../specs/001-registro-de-servicos.md) · [plano](../specs/001-plano.md)). Agente: Claude Code (Claude Opus 5.5), conduzido por Guilherme. Data: 10/10/2026.

## Nível do slider de autonomia

**Nível 4, tarefa multi-arquivo, com coleira curta.** O agente decidiu quais arquivos tocar dentro de cada tarefa, mas o plano foi aprovado por uma pessoa antes de qualquer código. Cada tarefa virou um commit com no máximo 6 critérios. O agente rodava `npm test`, `npm run lint` e `npm run check:ca` antes de cada commit e mostrava a saída. **Por quê:** é o nível em que ainda conseguimos verificar tudo o que voltou (regra de Karpathy). Cada commit cabe numa leitura, e cada critério de aceite tem um teste com o id no nome. O nível 5 ("implemente a spec 001") devolveria tudo de uma vez, sem como revisar.

## Uma vez em que o agente errou, e o que pegou o erro

**Erro de ordem no plano, pego pelo teste.** O plano deixava a listagem (`GET /servicos`) inteira para a T3. Mas CA-02, CA-03 e CA-09, da T2, terminam com "e a listagem de serviços continua vazia". Na T2, 3 dos 6 testes falharam (`SyntaxError: Unexpected token '<'`, porque a rota ainda não existia). O agente moveu a listagem simples para a T2 e registrou o ajuste no plano. Na tarefa seguinte, antes de rodar, ele mesmo achou a mesma dependência no CA-07 ("um pago" precisa da T4) e inverteu T3 e T4.

Outros dois erros não foram pegos por sensor automático, e sim pela revisão do próprio agente:

- O CA-13 passava mesmo **sem** ordenação, porque os serviços entravam na ordem do id. O agente fortaleceu o teste e provou que ele falha quando a ordenação é removida. O teste foi endurecido, não afrouxado.
- Ao parar o servidor de teste, o agente usou `taskkill /IM node.exe`, que encerra **todos** os processos `node` da máquina. **Nenhum mecanismo pegou**, porque esta sessão foi aberta na pasta acima do repositório e as permissões do `.claude/settings.json` não se aplicavam (ver abaixo).

## Uma vez em que o agente perguntou antes de assumir

**Antes da primeira linha de código**, o agente parou e pediu a aprovação do plano: rotas, formato de erro `{ "mensagem": ... }`, ordem das tarefas e a decisão sobre o filtro inválido. Só commitou e implementou depois do "aprovado".

**Uma vez em que deveria ter perguntado e não perguntou:** o comportamento do filtro `situacao` inválido não estava na spec. O agente decidiu (400 `Campo inválido: situacao`) e colocou a decisão no plano, e a aprovação veio junto com o plano inteiro, sem destaque. O certo era perguntar isso separado, antes. A decisão foi levada para a spec depois (D-14, CA-14, versão 4).

## Critérios atendidos

14 de 14 critérios com teste passando (`npm run check:ca -- 001`). Nenhum teste foi apagado, desativado ou ajustado para passar. A spec mudou uma vez por causa da implementação (D-14). O resto do comportamento implementado é o que a versão 3 já descrevia.

## O que mudamos no harness depois desta feature

- **Já mudado** ([commit 2dfccd2](https://github.com/GuilhermeLimaUniRV/cobraja/commit/2dfccd2)): AGENTS.md com a regra "confira o Dado/E de cada critério: se ele usa uma rota de outra tarefa, essa tarefa vem antes" e "encerre servidor só pelo PID"; deny para `taskkill /IM`, `pkill` e `killall`.
- **Aprendizado principal: existir não é ser usado.** A sessão que implementou a feature foi aberta na pasta `ATV-GUSTAVO`, um nível acima do repositório. Por isso o `.claude/settings.json` (permissões e hook de lint) **não foi carregado**: o lint rodou porque o agente chamou à mão, não por causa do hook. Regra para as próximas sessões: abrir o Claude Code **na raiz do `cobraja`**.
- **Ainda por fazer:** um gate que rode `npm test` no momento do `git commit` (achado 1 do segundo relatório do Better Harness), porque hoje isso depende de o agente lembrar.
