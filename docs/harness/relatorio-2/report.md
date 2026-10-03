# Better Harness Task-Loop Report

## At a Glance

- Loop Effectiveness: 56/100 (changes only after comparable later task outcomes)
- Asset Health / Repair Progress: 0/100 (0 verified, 0 partial, 5 pending)
- Demonstrated autonomy radius: not observed (not observed; not observed confidence)
- Strongest loop: Not enough evidence difference to name one.
- Largest observed leak: Use the priority moves; no single loop is uniquely weakest.
- Top expected gain: No priority benefit is available in this evidence boundary.

## What You Can Rely On Today

- No reliable user outcome has been demonstrated in this evidence boundary yet.

## What You Gain Next

- No priority Harness move is available in this evidence boundary.



### Why these moves matter

### Testes e lint antes do commit só acontecem se o agente lembrar
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md exige npm test e npm run lint antes de todo commit. O settings.json agora tem um hook PostToolUse que roda o lint depois de Edit/Write, mas nenhum gate roda no momento do commit: não há hook PreToolUse para git commit, .git/hooks só tem os exemplos padrão e não existe CI. Nesta sessão, o commit 607234e passou pelos dois comandos só porque o agente seguiu o CLAUDE.md, e foi direto na main. Inferência: um commit feito por outra sessão, por outro agente ou à mão entra sem verificação, e o npm test nunca é forçado. Dono: .claude/settings.json (hook) ou um git hook versionado. Incerteza: proteção de branch no repositório remoto não foi observada.
- Expected Output:
  1. Um hook versionado que bloqueia `git commit` quando npm test ou npm run lint falham.

### O agente continua sem saber se uma spec está aprovada para virar código
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md diz 'sem spec aprovada, não há código', mas nenhuma spec tem marcador de aprovação: a 001 está como 'versão 2' e a 002 como 'rascunho'. O _modelo.md só prevê 'Status: rascunho', e a revisão cruzada da 001 continua sem preencher. A spec 001 também manda as rotas HTTP para um 001-plano.md que não existe em docs/specs/. Inferência: diante de 'implemente a spec 001', o agente não tem como decidir se pode começar nem quais rotas criar. Dono: docs/specs/_modelo.md e o cabeçalho de cada spec. Incerteza: nenhuma tentativa de implementação foi observada nesta janela. Esse achado já existia no relatório 1 e não foi tratado.
- Expected Output:
  1. Um campo de status com valores fechados no modelo de spec e uma regra no AGENTS.md que impede implementar spec não aprovada.

### O .env ainda pode ser lido por comandos do shell que não são cat
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md proíbe ler ou imprimir o .env. O settings.json agora nega Read(./.env), Read(./.env.*) e Bash(cat .env*), o que corrige parte do achado do relatório 1. Mas comandos como head, tail, grep, type, Get-Content ou node -e lendo o arquivo não estão na lista de bloqueio. Nesta sessão o pedido de leitura foi recusado pela instrução, não pelo bloqueio, que nem chegou a disparar. Inferência: um agente que ignore a instrução lê o .env por outro comando sem nenhuma barreira. Dono: .claude/settings.json. Incerteza: nenhuma leitura indevida foi observada; o padrão exato de correspondência do deny para Bash não foi testado.
- Expected Output:
  1. Uma barreira que bloqueia a leitura do .env por qualquer comando do shell, não só por cat.

### O hook de lint não deixa rastro quando passa, então não dá para provar que rodou
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: o hook PostToolUse roda `npm run lint --silent 1>&2 || exit 2`. Quando o lint passa, ele sai com 0 e o Claude Code não mostra nada ao agente nem na conversa. Nesta sessão a spec 002 foi criada com Write, e os fatos da sessão registram essa tarefa como 'mudança sem verificação'. A seção 3 do docs/harness/evidencias.md continua sem preencher. Inferência: o hook pode estar funcionando, mas nem o agente nem a equipe conseguem ver isso numa edição normal; só uma falha de lint aparece. Dono: o comando do hook em .claude/settings.json. Incerteza: a execução do hook nesta sessão não foi observada.
- Expected Output:
  1. O mesmo hook de lint, agora com uma confirmação visível no sucesso que serve de evidência.

### Ainda não há uma segunda tarefa para mostrar que a skill e os gates melhoraram o resultado
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: a janela de 30 dias tem uma única sessão, esta, com três tarefas: o teste do .env, a criação da spec 002 com a skill nova-spec e o commit. A skill foi acionada sem ser citada e o achado do relatório 1 virou o check:ca, mas cada mecanismo foi usado uma vez, sem outra tarefa comparável depois. Inferência: dá para dizer que os mecanismos existem e foram exercitados, não que melhoraram o trabalho. Dono: o próprio ciclo de medição do harness. Incerteza: sessões fora deste workspace não foram consideradas.
- Expected Output:
  1. Uma segunda sessão de trabalho registrada que permita comparar o antes e o depois dos mecanismos.

## Five Lifecycle Dimensions

| Dimension | What the evidence proves | Evidence boundary | Summary | Boundary / blocker |
| --- | --- | --- | --- | --- |
| Task Understanding | Not observed yet | not observed in this boundary | AGENTS.md e CLAUDE.md dão o contexto certo, e a skill nova-spec foi acionada sozinha e parou com três [DÚVIDA] para revisão. Mas nenhuma spec diz se está aprovada (a 002 está como rascunho e a 001 como 'versão 2'), e o 001-plano.md citado pela spec 001 ainda não existe. | not observed |
| Controlled Execution | Not observed yet | not observed in this boundary | npm test, npm run lint e npm run check:ca foram executados nesta sessão, e o settings.json versionado tem allow, ask e deny. A proteção do .env melhorou, mas cobre só Read e cat: outros comandos de leitura do shell continuam liberados. | not observed |
| Change Validation | Not observed yet | not observed in this boundary | O hook PostToolUse roda o lint depois de cada Edit/Write e o check:ca liga CAs a testes. Mas a suíte ainda tem um único teste (GET /saude), nenhuma falha e reparo foi observado, e o hook não mostra nada quando o lint passa, então a criação da spec 002 aparece como mudança sem verificação. | not observed |
| Reliable Delivery | Not observed yet | not observed in this boundary | O commit 607234e só passou por npm test e lint porque o agente seguiu o CLAUDE.md. Não há git hook, hook de PreToolUse para git commit, nem CI, e o commit foi direto na main. Aprovação de alto risco e recuperação ainda não se aplicam (sem efeito externo). | not observed |
| Learning Capture | Not observed yet | not observed in this boundary | Houve um ciclo de aprendizado real: o achado do relatório 1 virou o gate check:ca, e a skill nova-spec foi usada numa tarefa. Mas tudo aconteceu numa única sessão, sem uma tarefa posterior comparável que mostre melhora. | not observed |

## The 15 Small Checks

| Dimension | Small check | What the evidence proves | Evidence boundary |
| --- | --- | --- | --- |


## Evidence and Boundaries

- Episode coverage: 0 episodes, 0 edited, 0 closed, 0 repaired-and-passed
- Model: agent-work-loop-v4
- Session selection: not observed; 0 sessions analyzed of 0 eligible sessions; not observed confidence
- Delivery grades observed: not observed
- Source gaps: not observed
- Learning comparison: Not observed; 0 declared intervention(s)
