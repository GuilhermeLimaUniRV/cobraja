---
name: nova-spec
description: Cria a spec de uma feature nova do CobraJá em docs/specs/. Use quando pedirem uma feature, funcionalidade ou tela que ainda não tem arquivo em docs/specs/, ou quando pedirem para "especificar", "escrever a spec" ou "documentar o comportamento" de algo antes de implementar.
---

# Nova spec

1. Liste `docs/specs/` e descubra o próximo número livre `NNN` (três dígitos: 001, 002...).
2. Copie `docs/specs/_modelo.md` para `docs/specs/NNN-<feature-em-kebab-case>.md`.
3. Preencha as sete seções: objetivo, escopo (com a lista do que NÃO entra), atores, dados, regras de negócio (RN-01, RN-02...), critérios de aceite e restrições.
4. Escreva pelo menos três critérios de aceite no formato Dado / Quando / Então. Cada um precisa ser binário, observável e livre de implementação (sem citar classe, tabela, framework ou biblioteca).
5. Escreva a tabela de exemplos da regra mais importante: caso feliz, caso de borda e caso de erro.
6. Rode as três varreduras no texto e corrija o que achar:
   - vagueza: rápido, fácil, intuitivo, adequado, simples, eficiente, robusto, amigável;
   - fuga: etc., entre outros, se necessário, se possível, quando aplicável, idealmente;
   - ator e quantidade: voz passiva sem sujeito, todos, alguns, vários, a maioria.
7. Onde faltar informação do negócio, escreva `[DÚVIDA: <pergunta>]` em vez de inventar a resposta.
8. Pare. Mostre a lista de `[DÚVIDA]` e peça revisão da equipe. Não escreva código de implementação.
