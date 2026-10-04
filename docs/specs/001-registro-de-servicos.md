# Spec 001 — Registro de serviços e controle de pagamento

> Status: versão 3 (endurecida no LAB 1 da Aula 08 e revisada pela equipe Noiva.AI, ver [001-revisao.md](001-revisao.md)) · Feature: 001 · Projeto: CobraJá

## 1. Objetivo

Permitir que o prestador de serviço registre cada serviço realizado e saiba, a qualquer momento, quais serviços ainda não foram pagos e quanto dinheiro tem a receber no total.

Problema que resolve (validado com o The Mom Test): o prestador controla serviços e pagamentos em caderno, planilha ou WhatsApp e esquece de cobrar clientes, perdendo dinheiro.

## 2. Escopo

**Inclui:**

1. Registrar um serviço (cliente, descrição, valor e data de realização).
2. Listar os serviços, com filtro opcional por situação (`pendente` ou `pago`).
3. Marcar um serviço pendente como pago.
4. Consultar o total a receber (soma dos serviços pendentes).

**Não inclui (fica fora desta feature):**

- Login, senha ou mais de um prestador usando o sistema (há um único prestador).
- Cadastro de clientes separado (o cliente é só um nome digitado no serviço).
- Editar ou excluir um serviço.
- Desfazer um pagamento (voltar de `pago` para `pendente`).
- Pagamento parcial ou parcelado.
- Envio de cobrança por WhatsApp, e-mail ou SMS e qualquer notificação.
- Relatórios, gráficos e exportação (PDF, planilha).
- Tela (interface visual): a feature é entregue como API HTTP com respostas em JSON.
- Guardar os dados depois que o sistema reinicia (ver Restrições e D-05).

## 3. Atores

| Ator | O que pode fazer |
|---|---|
| Prestador | Registrar serviços, listar serviços, marcar serviço como pago e consultar o total a receber. |

Nesta feature existe um único ator e nenhuma ação exige identificação (ver D-01).

## 4. Dados

**Serviço**

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| id | número inteiro | gerado pelo sistema | Único, começa em 1 e cresce de 1 em 1. |
| cliente | texto | sim | De 2 a 80 caracteres, contados depois de remover espaços do início e do fim. |
| descricao | texto | sim | De 3 a 200 caracteres, contados depois de remover espaços do início e do fim. |
| valor | entrada: número em reais (ex.: `89.9`) · saída: texto com 2 casas decimais (ex.: `"89.90"`) | sim | Ver RN-01 e D-10. |
| dataRealizacao | texto no formato `AAAA-MM-DD`, data de calendário válida | sim | Ver RN-02. |
| situacao | `pendente` ou `pago` | gerado pelo sistema | Ver RN-03 e RN-04. |
| dataPagamento | data no formato `AAAA-MM-DD` ou vazio (`null`) | gerado pelo sistema | Vazio enquanto pendente; preenchido pela RN-04. |

## 5. Regras de negócio

- **RN-01** — Quando o campo `valor` é enviado, ele precisa ser um número maior que R$ 0,00, no máximo R$ 100.000,00 e com no máximo 2 casas decimais. Valor enviado fora disso (incluindo texto como `"cem reais"`) é rejeitado com a mensagem `Valor inválido`.
- **RN-02** — Quando a data de realização está no formato `AAAA-MM-DD`, ela não pode ser posterior à data de hoje no fuso de Brasília (America/Sao_Paulo). Data futura é rejeitada com a mensagem `Data de realização no futuro`.
- **RN-03** — Todo serviço registrado começa com situação `pendente` e `dataPagamento` vazia.
- **RN-04** — Marcar um serviço pendente como pago muda a situação para `pago` e grava em `dataPagamento` a data de hoje no fuso de Brasília.
- **RN-05** — Um serviço que já está pago não pode ser marcado como pago de novo. A tentativa é rejeitada com a mensagem `Serviço já está pago` e nada no serviço muda.
- **RN-06** — A consulta do total a receber responde dois campos: `total`, a soma dos valores dos serviços com situação `pendente` (texto com 2 casas decimais), e `quantidadePendentes`, o número desses serviços. Sem serviços pendentes, a resposta é `total` `"0.00"` e `quantidadePendentes` `0`.
- **RN-07** — A listagem de serviços mostra os mais antigos primeiro (data de realização crescente). Em caso de mesma data, o de menor `id` vem primeiro.
- **RN-08** — O sistema rejeita o registro com a mensagem `Campo inválido: <nome do campo>`, sem criar serviço, quando um campo obrigatório não é enviado (ausente, `null` ou texto vazio), quando `cliente` ou `descricao` desrespeitam o tamanho da seção Dados, ou quando `dataRealizacao` não está no formato `AAAA-MM-DD` ou não é uma data de calendário válida (ex.: `03/10/2026` ou `2026-02-30`). Com mais de um campo errado, a mensagem cita só o primeiro na ordem da seção Dados: cliente, descricao, valor, dataRealizacao. As verificações da RN-08 vêm antes das da RN-01 e da RN-02 (D-11).

### Tabela de exemplos — RN-01 (a regra mais importante: é dinheiro)

| Caso | Valor enviado | Resultado esperado |
|---|---|---|
| Feliz | `150.00` | Serviço criado com valor `"150.00"` |
| Feliz | `89.9` | Serviço criado com valor `"89.90"` |
| Borda (mínimo) | `0.01` | Serviço criado |
| Borda (máximo) | `100000.00` | Serviço criado |
| Borda (acima do máximo) | `100000.01` | Rejeitado: `Valor inválido` |
| Erro (zero) | `0` | Rejeitado: `Valor inválido` |
| Erro (negativo) | `-50.00` | Rejeitado: `Valor inválido` |
| Erro (3 casas decimais) | `10.555` | Rejeitado: `Valor inválido` |
| Erro (não é número) | `"cem reais"` | Rejeitado: `Valor inválido` |
| Erro (não enviado) | campo `valor` ausente | Rejeitado: `Campo inválido: valor` (RN-08) |

## 6. Critérios de aceite

**CA-01 — Registrar serviço válido**
Dado que não existe nenhum serviço registrado
Quando o prestador registra um serviço com cliente "Maria Souza", descrição "Troca de chuveiro", valor 150.00 e data de realização de hoje
Então a resposta tem código 201 e traz o serviço com id 1, valor `"150.00"`, situação `pendente` e dataPagamento `null`

**CA-02 — Valor inválido é rejeitado**
Dado que não existe nenhum serviço registrado
Quando o prestador tenta registrar um serviço com valor 0
Então a resposta tem código 400 com a mensagem `Valor inválido`
E a listagem de serviços continua vazia

**CA-03 — Data futura é rejeitada**
Dado que hoje é 03/10/2026
Quando o prestador tenta registrar um serviço com data de realização 04/10/2026
Então a resposta tem código 400 com a mensagem `Data de realização no futuro`
E nenhum serviço é criado

**CA-04 — Marcar como pago**
Dado que existe o serviço 1 com situação `pendente` e hoje é 03/10/2026
Quando o prestador marca o serviço 1 como pago
Então a resposta tem código 200 e traz o serviço 1 com situação `pago` e dataPagamento `2026-10-03`

**CA-05 — Não paga duas vezes**
Dado que o serviço 1 já está com situação `pago`
Quando o prestador marca o serviço 1 como pago de novo
Então a resposta tem código 409 com a mensagem `Serviço já está pago`
E a dataPagamento do serviço 1 continua a mesma

**CA-06 — Total a receber**
Dado que existem 3 serviços: um pendente de 150.00, um pendente de 89.90 e um pago de 200.00
Quando o prestador consulta o total a receber
Então a resposta traz `total` igual a `"239.90"` e `quantidadePendentes` igual a `2`

**CA-07 — Filtro de pendentes**
Dado que existem 3 serviços: dois pendentes e um pago
Quando o prestador lista os serviços com o filtro situação `pendente`
Então a resposta traz exatamente os 2 serviços pendentes, o de data de realização mais antiga primeiro

**CA-08 — Serviço inexistente**
Dado que não existe serviço com id 99
Quando o prestador marca o serviço 99 como pago
Então a resposta tem código 404 com a mensagem `Serviço não encontrado`

**CA-09 — Campo obrigatório ausente**
Dado que não existe nenhum serviço registrado
Quando o prestador tenta registrar um serviço sem o campo `valor` e sem o campo `cliente`
Então a resposta tem código 400 com a mensagem `Campo inválido: cliente`
E a listagem de serviços continua vazia

**CA-10 — Data em formato errado**
Dado que não existe nenhum serviço registrado
Quando o prestador tenta registrar um serviço com data de realização `03/10/2026`
Então a resposta tem código 400 com a mensagem `Campo inválido: dataRealizacao`

**CA-11 — Limite máximo do valor**
Dado que não existe nenhum serviço registrado
Quando o prestador registra um serviço com valor 100000.00 e depois tenta registrar outro com valor 100000.01
Então o primeiro registro tem código 201 com valor `"100000.00"`
E o segundo tem código 400 com a mensagem `Valor inválido`

**CA-12 — Total sem pendentes**
Dado que existe só um serviço, com situação `pago`
Quando o prestador consulta o total a receber
Então a resposta traz `total` igual a `"0.00"` e `quantidadePendentes` igual a `0`

**CA-13 — Desempate na listagem**
Dado que os serviços 1 e 2 foram registrados com a mesma data de realização
Quando o prestador lista os serviços
Então o serviço 1 aparece antes do serviço 2

## 7. Restrições

- Node.js 24 e Express 5; respostas em JSON.
- Testes automatizados com o executor nativo do Node (`node --test`); cada critério de aceite vira pelo menos um teste.
- Valores monetários são guardados em centavos (número inteiro), para evitar erro de arredondamento, e devolvidos no JSON como texto com 2 casas decimais (D-10).
- Nesta feature os dados ficam só em memória: reiniciar o sistema apaga os serviços (D-05).
- Datas usam o fuso America/Sao_Paulo.
- Nenhum segredo (senha, token, chave) no repositório; configuração sensível vai no `.env`, que não é versionado.

## Decisões

Cada ambiguidade encontrada na escrita, na revisão cruzada e nas três varreduras da Aula 08, e o que a equipe decidiu.

| # | Ambiguidade | Decisão | Motivo |
|---|---|---|---|
| D-01 | "O prestador" — quem pode usar? Precisa de login? | Um único prestador, sem login nesta feature. | Login não valida o problema (esquecer cobranças); entra numa feature futura. |
| D-02 | "Cliente" é um cadastro ou só um nome? | Só um nome de texto dentro do serviço. | Cadastro de clientes dobraria o tamanho da feature; a dor é saber quem deve, e o nome resolve. |
| D-03 | "Marcar como pago" pode ser desfeito? | Não, nesta feature. | Evita regra de estorno; erro do usuário é raro e entra em feature futura. |
| D-04 | Pagamento parcial conta como pago? | Não existe pagamento parcial: o serviço está pendente ou pago inteiro. | Mantém a regra binária e verificável. |
| D-05 | Os dados precisam sobreviver a reinício? | Não nesta feature: memória. | A feature valida o fluxo; banco de dados vem na próxima spec, sem mudar os critérios de aceite. |
| D-06 | "Data de hoje" de qual relógio? | Fuso America/Sao_Paulo. | Público brasileiro; evita serviço feito às 22h virar "amanhã" em UTC. |
| D-07 | Valor com centavos: quantas casas? | Máximo de 2; valor com 3 ou mais casas é rejeitado (não arredondado). | Arredondar em silêncio esconderia erro de digitação de dinheiro. |
| D-08 | Qual o valor máximo razoável? | R$ 100.000,00. | Acima disso é quase certamente erro de digitação para um pequeno prestador. |
| D-09 | "Listar serviços" em que ordem? | Data de realização crescente, desempate por id (RN-07). | O serviço mais antigo sem pagamento é o mais urgente de cobrar. |
| D-10 | Revisão cruzada: no JSON o valor volta como texto (`"89.90"`) ou número (`89.9`)? | Texto com 2 casas decimais em toda saída (`valor` e `total`); a entrada continua sendo número. | Número JSON perde o zero final, e a spec promete 2 casas; texto também evita que o cliente da API reintroduza erro de ponto flutuante. |
| D-11 | Revisão cruzada: `valor` ausente cai na RN-08 ou na RN-01? Data `03/10/2026`? Vários campos errados? | Ausente, vazio ou fora do formato → RN-08 (`Campo inválido: <campo>`); enviado mas fora da faixa → RN-01; data válida mas futura → RN-02. Vários erros → só o primeiro na ordem da seção Dados. | Uma única mensagem por resposta mantém os critérios binários; a ordem fixa faz duas implementações responderem igual. |
| D-12 | Revisão cruzada: qual o nome do campo da quantidade no total? | `quantidadePendentes`, junto de `total` (RN-06). | Sem nome fixo, cada implementação inventaria um e o CA-06 não seria verificável. |
| D-13 | Revisão cruzada: os testes dependem das rotas, que estão no plano. | Mantido: rotas no `001-plano.md`, escrito e revisado antes de qualquer código (atividade de 10/10). Os critérios descrevem o que a API responde, não por onde. | Rota é decisão de interface; na spec ela engessaria a regra de negócio sem mudar o comportamento. |

### Resultado das três varreduras (Aula 08)

- **Vagueza** (rápido, fácil, intuitivo, adequado, simples, eficiente, robusto, amigável): nenhuma ocorrência. A proposta de valor dizia "identificar de forma mais simples quem deve"; na spec virou "saiba quais serviços não foram pagos e quanto tem a receber" (RN-06, CA-06, CA-07).
- **Fuga** (etc., entre outros, se necessário, se possível, quando aplicável, idealmente, normalmente): nenhuma ocorrência. Os dados do serviço são uma lista fechada (seção Dados), sem "etc.".
- **Ator e quantidade** (voz passiva, todos, alguns, vários, a maioria): todo critério tem o ator explícito ("o prestador"). As voz passivas restantes ("é rejeitado") estão nas regras, onde o sujeito é o sistema e a mensagem de erro é exata. O "Todo serviço" da RN-03 é uma quantidade fechada (sem exceção), não uma generalização. As varreduras foram repetidas na versão 3, depois da revisão cruzada, sem ocorrência nova.
- **Design disfarçado:** nenhum critério de aceite cita classe, tabela, framework ou biblioteca. Express e `node --test` aparecem só em Restrições.

### Se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?

**Sim, para o comportamento.** Os campos, os limites, as mensagens de erro e a ordem entre elas, o formato do dinheiro na resposta, a ordem da listagem e o cálculo do total estão fechados. Cada critério de aceite (CA-01 a CA-13) vira um teste, e depois da revisão cruzada toda regra de negócio é coberta por pelo menos um critério. **O que a spec não fixa** são os caminhos exatos das rotas HTTP (por exemplo `POST /servicos`). Duas reconstruções teriam o mesmo comportamento com URLs diferentes. A equipe decidiu deixar isso no plano de tarefas (`001-plano.md`), porque é decisão de interface, não de negócio.
