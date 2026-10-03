# Spec 002 — Ranking de clientes devedores

> Status: rascunho · Feature: 002 · Projeto: CobraJá

## 1. Objetivo

Permitir que o prestador veja quais clientes devem mais dinheiro a ele, do maior valor devido para o menor, para decidir quem cobrar primeiro.

Problema que resolve: a spec 001 mostra serviços pendentes um a um e o total geral, mas o prestador cobra **pessoas**, não serviços. Um cliente com cinco serviços pequenos pendentes pode dever mais que outro com um serviço grande, e isso não aparece na listagem de serviços.

## 2. Escopo

**Inclui:**

1. Consultar a lista de clientes que têm pelo menos um serviço `pendente`, com o valor total devido por cliente e a quantidade de serviços pendentes de cada um.
2. A lista vem ordenada do cliente que deve mais para o que deve menos (RN-03).

**Não inclui (fica fora desta feature):**

- Cadastro de clientes separado: o cliente continua sendo o nome digitado no serviço (D-02 da spec 001).
- Juros, multa ou correção do valor devido por atraso.
- Ordenar por tempo de atraso ou por quantidade de serviços (só por valor devido).
- Filtro por período de data de realização.
- Ver os serviços de um cliente específico a partir do ranking.
- Envio de cobrança, notificação, gráfico ou exportação (PDF, planilha).
- Tela (interface visual): a feature é entregue como API HTTP com resposta em JSON.

## 3. Atores

| Ator | O que pode fazer |
|---|---|
| Prestador | Consultar o ranking de clientes devedores. |

Mesmo ator único e sem login da spec 001 (D-01 da spec 001).

## 4. Dados

A feature não cria dados novos: lê os serviços registrados pela spec 001. Cada item do ranking tem:

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| cliente | texto | sim | Nome do cliente como aparece nos serviços (ver RN-02). |
| totalDevido | número decimal (reais), 2 casas | sim | Soma dos valores dos serviços `pendente` desse cliente (RN-01). Sempre maior que `0.00`. |
| servicosPendentes | número inteiro | sim | Quantidade de serviços `pendente` desse cliente. Sempre 1 ou mais. |

## 5. Regras de negócio

- **RN-01** — O total devido de um cliente é a soma dos valores dos serviços dele com situação `pendente`. Serviços com situação `pago` não entram na soma.
- **RN-02** — Dois serviços pertencem ao mesmo cliente quando o nome do cliente é igual depois de remover espaços do início e do fim. [DÚVIDA: "Maria Souza" e "maria souza" são o mesmo cliente? E "Maria  Souza" (dois espaços no meio)? Se forem unificados, qual grafia aparece no ranking?]
- **RN-03** — O ranking mostra os clientes do maior `totalDevido` para o menor. Quando dois clientes têm o mesmo `totalDevido`, vem primeiro [DÚVIDA: qual o desempate? Sugestão: o cliente com o serviço pendente de data de realização mais antiga, coerente com a D-09 da spec 001 — ou ordem alfabética do nome?].
- **RN-04** — Um cliente cujos serviços estão todos com situação `pago` não aparece no ranking.
- **RN-05** — Sem nenhum serviço `pendente`, o ranking é uma lista vazia, e a consulta não é tratada como erro.
- **RN-06** — O ranking traz [DÚVIDA: todos os clientes com dívida ou só os N primeiros? Se só os N primeiros, quanto vale N e o prestador pode mudar N na consulta?].

### Tabela de exemplos — RN-01 e RN-03 (soma por cliente e ordem)

| Caso | Serviços registrados | Ranking esperado |
|---|---|---|
| Feliz | Ana: 100.00 pendente; Bruno: 300.00 pendente; Ana: 250.00 pendente | 1º Ana 350.00 (2 serviços); 2º Bruno 300.00 (1 serviço) |
| Borda (pago não conta) | Ana: 500.00 pago; Ana: 50.00 pendente; Bruno: 80.00 pendente | 1º Bruno 80.00 (1); 2º Ana 50.00 (1) |
| Borda (empate) | Ana: 200.00 pendente; Bruno: 200.00 pendente | Os dois aparecem com 200.00; a ordem entre eles depende da RN-03 [DÚVIDA] |
| Borda (centavos) | Ana: 0.10 pendente; Ana: 0.20 pendente | 1º Ana 0.30 (2) — sem erro de arredondamento |
| Erro (nada pendente) | Ana: 150.00 pago | Lista vazia, resposta com código 200 |

## 6. Critérios de aceite

**CA-01 — Soma por cliente e ordem decrescente**
Dado que existem os serviços pendentes: Ana 100.00, Bruno 300.00 e Ana 250.00
Quando o prestador consulta o ranking de devedores
Então a resposta tem código 200 e traz exatamente 2 itens, nesta ordem: Ana com totalDevido `350.00` e servicosPendentes 2; Bruno com totalDevido `300.00` e servicosPendentes 1

**CA-02 — Serviço pago não entra na soma**
Dado que existem os serviços: Ana 500.00 pago, Ana 50.00 pendente e Bruno 80.00 pendente
Quando o prestador consulta o ranking de devedores
Então o 1º item é Bruno com totalDevido `80.00` e o 2º item é Ana com totalDevido `50.00` e servicosPendentes 1

**CA-03 — Cliente que pagou tudo some do ranking**
Dado que existem os serviços: Ana 150.00 pago e Bruno 80.00 pendente
Quando o prestador consulta o ranking de devedores
Então a resposta traz exatamente 1 item, Bruno, e nenhum item com o cliente Ana

**CA-04 — Ninguém devendo**
Dado que não existe nenhum serviço com situação `pendente`
Quando o prestador consulta o ranking de devedores
Então a resposta tem código 200 e traz uma lista vazia

**CA-05 — Soma em centavos sem erro de arredondamento**
Dado que existem os serviços pendentes: Ana 0.10 e Ana 0.20
Quando o prestador consulta o ranking de devedores
Então o item de Ana traz totalDevido `0.30`

**CA-06 — Desempate** [depende da DÚVIDA da RN-03]
Dado que existem os serviços pendentes: Ana 200.00 com data de realização 2026-09-01 e Bruno 200.00 com data de realização 2026-08-01
Quando o prestador consulta o ranking de devedores
Então [o 1º item é ___, conforme o desempate escolhido na RN-03]

**CA-07 — Mesmo cliente com grafias diferentes** [depende da DÚVIDA da RN-02]
Dado que existem os serviços pendentes: "Maria Souza" 100.00 e "  Maria Souza " 50.00
Quando o prestador consulta o ranking de devedores
Então a resposta traz exatamente 1 item, Maria Souza, com totalDevido `150.00` e servicosPendentes 2

## 7. Restrições

- Mesmas restrições da spec 001: Node.js 24 e Express 5, respostas em JSON, testes com `node --test`, um teste por critério de aceite.
- A soma é feita em centavos (número inteiro) e devolvida com 2 casas decimais.
- A feature lê os mesmos serviços da spec 001; enquanto os dados ficarem em memória (D-05 da spec 001), o ranking também zera quando o sistema reinicia.

## Decisões

| # | Ambiguidade | Decisão | Motivo |
|---|---|---|---|
| D-01 | "Clientes que mais devem": mais dinheiro, mais serviços ou dívida mais antiga? | Mais dinheiro (soma dos pendentes). | É a leitura direta do pedido; quantidade e atraso ficam fora do escopo e podem virar outra ordenação depois. |
| D-02 | Cliente sem dívida aparece com `0.00`? | Não aparece (RN-04). | O ranking serve para decidir quem cobrar; quem não deve não é cobrado. |
| D-03 | Lista vazia é erro? | Não: código 200 com lista vazia (RN-05). | Não ter devedor é uma situação boa e válida, não uma falha. |

### Resultado das três varreduras

- **Vagueza** (rápido, fácil, intuitivo, adequado, simples, eficiente, robusto, amigável): nenhuma ocorrência.
- **Fuga** (etc., entre outros, se necessário, se possível, quando aplicável, idealmente): nenhuma ocorrência. Os campos do item do ranking são uma lista fechada.
- **Ator e quantidade**: todo critério tem o ator explícito ("o prestador") e quantidades exatas ("exatamente 2 itens"). O "todos" da RN-04 é fechado (todos os serviços daquele cliente). O "todos os clientes" da RN-06 está marcado como dúvida.
- **Design disfarçado:** nenhum critério de aceite cita classe, tabela, framework ou biblioteca.

### Se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?

**Ainda não.** Faltam as três respostas marcadas com `[DÚVIDA]` (agrupamento de nomes, desempate e limite de itens); sem elas, duas reconstruções podem devolver rankings diferentes para os mesmos serviços. Como na spec 001, o caminho exato da rota HTTP fica para o plano de tarefas.
