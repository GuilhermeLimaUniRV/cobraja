# Better Harness Task-Loop Report

## At a Glance

- Loop Effectiveness: 46/100 (changes only after comparable later task outcomes)
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

### npm test fica verde com 0 de 8 critérios de aceite da spec 001 cobertos
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md exige um teste por critério de aceite com o id no nome (CA-xx) e 'prove antes de dizer que terminou'; a spec 001 define CA-01 a CA-08, mas o único teste é o smoke de GET /saude e npm test passa. Inferência: um agente pode declarar a feature 001 pronta com a suíte verde faltando CAs, porque nenhum comando compara os CA-xx da spec com os nomes dos testes. Dono: test/ e um script em package.json. Incerteza: a feature ainda não começou, então a lacuna é do gate, não da cobertura atual.
- Expected Output:
  1. Um comando do projeto que lista os CA-xx sem teste correspondente e falha enquanto houver algum, citado no AGENTS.md como prova de 'pronto'.

### 'Testes e lint passam antes de todo commit' não é verificado em nenhum ponto
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md diz que npm test passa e npm run lint tem zero erros antes de todo commit, e define o formato de mensagem com spec e CA. Não existe hook do Claude Code (.claude/settings.json ausente), git hook, script de pre-commit, commitlint nem CI (.github ausente), e os dois commits foram direto na main. Inferência: um commit com teste falhando ou mensagem fora do formato chega à main sem nenhuma barreira. Dono: .claude/settings.json (hook) ou CI. Incerteza: não houve sessão de implementação, então nenhuma violação foi observada; proteção de branch no host remoto não foi observada.
- Expected Output:
  1. Um hook versionado do Claude Code que bloqueia `git commit` quando npm test ou npm run lint falham.

### O agente não consegue saber se a spec 001 está aprovada nem quais rotas criar
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md diz 'sem spec aprovada, não há código', mas a spec 001 só tem 'Status: versão 2', sem campo de aprovação, e 001-revisao.md está apenas com placeholders. A spec delega os caminhos HTTP a um 001-plano.md que não existe no repositório. Inferência: ao implementar a 001, o agente vai precisar parar para perguntar ou inventar rotas, o que contradiz 'a spec é a fonte da verdade'. Dono: docs/specs/. Incerteza: a aprovação pode ter acontecido fora do repositório (em aula).
- Expected Output:
  1. Spec 001 com status de aprovação explícito e um 001-plano.md que mapeia cada CA para uma rota HTTP.

### Nada impede o agente de ler ou imprimir o .env, só o commit é bloqueado
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md proíbe ler, imprimir ou commitar o .env; o .gitignore cobre .env e .env.* (exceto .env.example), mas não existe .claude/settings.json com permissions.deny para leitura do .env nem hook de segredos. Inferência: a proteção contra leitura depende só de o agente obedecer à instrução. Dono: .claude/settings.json. Incerteza: o .env.example só declara PORT, então a exposição atual é baixa; configurações de usuário ou organização fora do repositório não foram observadas.
- Expected Output:
  1. Regra de deny versionada que bloqueia a leitura de .env pelo agente.

### Não há sessões de trabalho para medir o loop do agente; a única é esta revisão
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: na janela de 30 dias (provider claude) só há 1 sessão elegível, e ela é esta própria revisão: 0 edições, 0 checks, 0 episódios retidos. Inferência: não dá para dizer se o agente segue as regras do AGENTS.md nem detectar trabalho repetido; Learning Capture fica sem decisão. Dono: o próximo relatório do better-harness. Incerteza: sessões de outros providers ou da home do usuário não foram autorizadas.
- Expected Output:
  1. Um segundo relatório com episódios de implementação comparáveis para medir o efeito do harness.

## Five Lifecycle Dimensions

| Dimension | What the evidence proves | Evidence boundary | Summary | Boundary / blocker |
| --- | --- | --- | --- | --- |
| Task Understanding | Not observed yet | not observed in this boundary | AGENTS.md curto e específico e spec 001 detalhada (CA-01 a CA-08); mas a spec não tem marcador de aprovação e remete as rotas HTTP a um 001-plano.md que não existe. | not observed |
| Controlled Execution | Not observed yet | not observed in this boundary | npm test e npm run lint foram executados com sucesso e o Node está fixado; a proibição de ler o .env existe só como instrução, sem permissão de deny. | not observed |
| Change Validation | Not observed yet | not observed in this boundary | A suíte roda rápido, mas só cobre GET /saude; nada liga os CA-xx da spec aos testes, então npm test fica verde com 0 de 8 CAs cobertos. | not observed |
| Reliable Delivery | Not observed yet | not observed in this boundary | Commits vão direto na main sem CI, PR ou hook; a regra 'npm test e lint passam antes de todo commit' não tem fronteira de aceite que a verifique. Aprovação de alto risco e recuperação não se aplicam ainda (sem efeito externo). | not observed |
| Learning Capture | Not observed yet | not observed in this boundary | Revisão concluída com evidência insuficiente: a única sessão na janela é esta revisão, sem episódios de implementação para detectar repetição ou validar melhorias. | not observed |

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
