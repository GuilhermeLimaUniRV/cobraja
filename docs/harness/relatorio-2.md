# Better Harness — segundo relatório

- **Data:** 03/10/2026
- **Commit medido:** [`607234e`](https://github.com/GuilhermeLimaUniRV/cobraja/commit/607234e), depois de CLAUDE.md, permissões, skill e hook ([`1544fd9`](https://github.com/GuilhermeLimaUniRV/cobraja/commit/1544fd9)) e da primeira tarefa feita com eles (spec 002 criada pela skill `nova-spec`)
- **Harness:** Claude Code · plugin better-harness 0.7.0-alpha2 · modelo agent-work-loop-v4
- **Saída completa da ferramenta:** [relatorio-2/report.md](relatorio-2/report.md) · [report.html](relatorio-2/report.html) · [findings.json](relatorio-2/findings.json)

## Resumo

- **Loop Effectiveness:** 56/100 (era 46/100) · **Asset Health:** 0/100 (5 achados pendentes)
- As cinco dimensões continuam marcadas como "não observadas" no limite de evidência: a janela tem uma única sessão de trabalho, sem tarefa comparável posterior.

## Comparação com o primeiro

| Dimensão | Relatório 1 | Relatório 2 | Mudou? |
|---|---|---|---|
| Entendimento da tarefa | AGENTS.md e spec 001 bons; spec sem aprovação; falta `001-plano.md` | Skill `nova-spec` acionada sozinha e parou com 3 `[DÚVIDA]`; spec ainda sem aprovação e `001-plano.md` ainda falta | Em parte: a skill foi usada, mas o achado da aprovação ficou igual |
| Execução controlada | Proibição do `.env` só como instrução; test/lint rodam | `settings.json` versionado com allow/ask/deny; test, lint e `check:ca` executados; `.env` coberto só para Read e `cat` | **Sim** |
| Validação da mudança | `npm test` verde com 0 de 8 CAs | `check:ca` liga CAs a testes; hook de lint configurado, mas silencioso quando passa; suíte ainda com 1 teste | Mecanismo existe; uso não comprovado |
| Entrega confiável | Commits direto na main, sem gate | Igual: commit 607234e só passou por test/lint porque o agente seguiu o CLAUDE.md | Não |
| Captura de aprendizado | Sem episódios | Achado do relatório 1 virou o `check:ca`; skill usada numa tarefa | Sim, mas sem tarefa comparável |

## Achados do segundo relatório

1. **Testes e lint antes do commit só acontecem se o agente lembrar** (Médio). Continua do relatório 1 (achado 2).
2. **O agente não sabe se uma spec está aprovada** (Médio). Continua do relatório 1 (achado 3), não tratado.
3. **O `.env` ainda pode ser lido por outros comandos do shell** (Baixo). O achado 4 do relatório 1 foi corrigido **em parte**.
4. **O hook de lint não deixa rastro quando passa** (Baixo). Novo.
5. **Falta uma segunda tarefa para provar melhora** (Baixo). Continua do relatório 1 (achado 5).

O achado 1 do relatório 1 (0 de 8 CAs com `npm test` verde) **não aparece mais**: o reparo `check:ca` fechou o achado.
