# Better Harness — primeiro relatório (linha de base)

- **Data:** 03/10/2026
- **Commit medido:** [`955319a`](https://github.com/GuilhermeLimaUniRV/cobraja/commit/955319a), antes de CLAUDE.md, permissões, skill e hook
- **Harness:** Claude Code · plugin better-harness 0.7.0-alpha2 · modelo agent-work-loop-v4
- **Saída completa da ferramenta:** [relatorio-1/report.md](relatorio-1/report.md) · [report.html](relatorio-1/report.html) · [findings.json](relatorio-1/findings.json)

## Resumo

- **Loop Effectiveness:** 46/100 · **Asset Health:** 0/100 (5 achados pendentes)
- Nenhuma dimensão foi observada em uso: a única sessão do agente na janela era a própria revisão (0 episódios, 0 edições). O relatório diz isso explicitamente, em vez de dar nota inventada.

| Dimensão | O que o relatório disse |
|---|---|
| Entendimento da tarefa | AGENTS.md curto e spec 001 detalhada, mas a spec não tem marcador de aprovação e cita um `001-plano.md` que não existe. |
| Execução controlada | `npm test` e `npm run lint` rodam e o Node está fixado; a proibição de ler o `.env` é só instrução, sem deny. |
| Validação da mudança | A suíte só cobre `GET /saude`; nada liga os CA-xx aos testes, então `npm test` fica verde com 0 de 8 CAs. |
| Entrega confiável | Commits direto na main, sem CI, PR ou hook; "testes e lint antes do commit" não é verificado. |
| Captura de aprendizado | Sem episódios de implementação para detectar repetição. |

## Achados (em ordem de impacto)

1. **`npm test` fica verde com 0 de 8 critérios de aceite cobertos** (Médio, Validação da mudança)
2. **"Testes e lint antes de todo commit" não é verificado** (Médio, Entrega confiável)
3. **O agente não sabe se a spec 001 está aprovada nem quais rotas criar** (Médio, Entendimento da tarefa)
4. **Nada impede o agente de ler o `.env`** (Baixo, Execução controlada)
5. **Não há sessões de trabalho para medir o loop** (Baixo, Captura de aprendizado)

## Achado escolhido

- **Achado:** 1 — `npm test` fica verde com 0 de 8 critérios de aceite da spec 001 cobertos.
- **Dimensão do Agent Work Loop:** Validação da mudança.
- **Por que este:** é o único que deixaria o agente declarar a feature 001 "pronta" com a suíte verde e critérios faltando, que é exatamente o "funciona sem prova". Os achados 2 e 4 são cobertos pelo commit de configuração do harness (hook PostToolUse e deny do `.env`), e o 3 é resolvido pelo plano de tarefas da atividade do esqueleto.
- **Reparo aplicado:** script `npm run check:ca` ([scripts/verificar-cas.js](../../scripts/verificar-cas.js)), que lê os CA-xx de cada spec, procura um teste com o id no nome em `test/NNN-*.test.js` e falha enquanto faltar algum. O AGENTS.md passou a exigir `npm test` **e** `npm run check:ca -- NNN` para declarar uma feature pronta.
- **Prova:** hoje `npm run check:ca` imprime `Spec 001: 0 de 8 critérios com teste` e sai com código 1. É o comportamento esperado até a feature ser implementada.
- **Commit do reparo:** [`ca153b6`](https://github.com/GuilhermeLimaUniRV/cobraja/commit/ca153b6)
