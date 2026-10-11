# Spec 003 — Despesas de material por serviço

> Status: rascunho · Feature: 003 · Projeto: CobraJá

## 1. Objetivo

Permitir que o prestador registre o dinheiro que gastou com material em cada serviço e consulte, por serviço, quanto gastou no total.

Problema que resolve: o prestador sabe quanto cobrou de cada serviço (spec 001), mas não sabe quanto desse valor já saiu do bolso dele em material. Sem esse registro, ele não percebe quando um serviço deu pouco lucro ou prejuízo.

## 2. Escopo

**Inclui:**

1. Registrar uma despesa de material em um serviço existente (descrição e valor).
2. Consultar as despesas de um serviço, com a soma e a quantidade delas.

**Não inclui (fica fora desta feature):**

- Editar ou excluir uma despesa.
- Quantidade e preço unitário do material: a despesa tem só o valor total gasto (D-02).
- Despesas que não pertencem a um serviço (combustível do mês, ferramentas, aluguel).
- Categorias de despesa, fornecedor e anexo de nota fiscal ou recibo.
- Repassar a despesa ao cliente: a despesa não muda o valor do serviço nem o total a receber (RN-05).
- Relatórios de lucro por período, gráficos e exportação (PDF, planilha).
- Tela (interface visual): a feature é entregue como API HTTP com respostas em JSON.

## 3. Atores

| Ator | O que pode fazer |
|---|---|
| Prestador | Registrar despesas de material em um serviço e consultar as despesas de um serviço. |

Mesmo ator único e sem login da spec 001 (D-01 da spec 001).

## 4. Dados

**Despesa**

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| id | número inteiro | gerado pelo sistema | Único entre todas as despesas, começa em 1 e cresce de 1 em 1. |
| servicoId | número inteiro | sim (vem do serviço escolhido) | Id de um serviço registrado pela spec 001 (RN-02). |
| descricao | texto | sim | De 2 a 120 caracteres, contados depois de remover espaços do início e do fim. |
| valor | entrada: número em reais (ex.: `35.5`) · saída: texto com 2 casas decimais (ex.: `"35.50"`) | sim | Ver RN-03. |

[DÚVIDA: a despesa precisa de uma data (dia da compra do material)? Se sim, pode ser futura? Pode ser anterior à data de realização do serviço?]

**Resposta da consulta de despesas de um serviço**

| Campo | Tipo | Regra |
|---|---|---|
| despesas | lista de despesas | Só as despesas do serviço consultado, em ordem de `id` crescente (RN-04). |
| totalDespesas | texto com 2 casas decimais | Soma dos valores da lista; `"0.00"` quando a lista é vazia. |
| quantidadeDespesas | número inteiro | Quantidade de itens da lista; `0` quando a lista é vazia. |

## 5. Regras de negócio

- **RN-01** — O sistema rejeita o registro com a mensagem `Campo inválido: <nome do campo>`, sem criar despesa, quando `descricao` ou `valor` não é enviado (ausente, `null` ou texto vazio) ou quando `descricao` desrespeita o tamanho da seção Dados. Com os dois campos errados, a mensagem cita só `descricao`. As verificações da RN-01 vêm antes das da RN-03, no mesmo padrão da D-11 da spec 001.
- **RN-02** — A despesa só pode ser registrada em um serviço que existe. Com um id de serviço que não existe, o sistema rejeita o registro com a mensagem `Serviço não encontrado` e não cria despesa. Essa verificação vem antes da RN-01 e da RN-03.
- **RN-03** — O `valor` da despesa segue a mesma regra do valor do serviço (RN-01 da spec 001): número maior que R$ 0,00, no máximo R$ 100.000,00 e com no máximo 2 casas decimais. Valor enviado fora disso (incluindo texto como `"trinta reais"`) é rejeitado com a mensagem `Valor inválido`.
- **RN-04** — A consulta das despesas de um serviço responde os campos da seção Dados: a lista em ordem de `id` crescente, `totalDespesas` e `quantidadeDespesas`. Consultar um serviço que não existe é rejeitado com a mensagem `Serviço não encontrado`.
- **RN-05** — Registrar uma despesa não muda o serviço: o `valor`, a `situacao`, o total a receber (RN-06 da spec 001) e o ranking de devedores (spec 002) continuam iguais.
- **RN-06** — Uma despesa pode ser registrada em um serviço com situação `pendente`. [DÚVIDA: e em um serviço já `pago`? Sugestão: sim, porque o prestador pode lançar a nota do material depois de receber.]
- **RN-07** — [DÚVIDA: a soma das despesas de um serviço pode passar do valor do serviço (serviço com prejuízo)? Sugestão: sim, sem aviso, porque bloquear impediria o prestador de registrar um gasto que aconteceu de verdade.]
- **RN-08** — [DÚVIDA: a consulta de despesas deve trazer também o resultado do serviço (valor do serviço menos `totalDespesas`)? Se sim, com qual nome de campo, e o resultado pode ser negativo?]

### Tabela de exemplos — RN-03 e RN-04 (dinheiro da despesa e soma por serviço)

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Feliz | Serviço 1 recebe despesas de `35.5` e `12.25` | Despesas criadas com valor `"35.50"` e `"12.25"`; consulta do serviço 1 traz `totalDespesas` `"47.75"` e `quantidadeDespesas` `2` |
| Borda (mínimo) | Despesa de `0.01` no serviço 1 | Despesa criada com valor `"0.01"` |
| Borda (centavos) | Serviço 1 recebe despesas de `0.10` e `0.20` | `totalDespesas` `"0.30"`, sem erro de arredondamento |
| Borda (sem despesas) | Consulta do serviço 1, que não tem despesas | Lista vazia, `totalDespesas` `"0.00"`, `quantidadeDespesas` `0` |
| Erro (zero) | Despesa de `0` | Rejeitado: `Valor inválido` |
| Erro (3 casas decimais) | Despesa de `10.555` | Rejeitado: `Valor inválido` |
| Erro (acima do máximo) | Despesa de `100000.01` | Rejeitado: `Valor inválido` |
| Erro (não enviado) | Campo `valor` ausente | Rejeitado: `Campo inválido: valor` (RN-01) |
| Erro (serviço inexistente) | Despesa de `35.5` no serviço 99, que não existe | Rejeitado: `Serviço não encontrado` (RN-02) |

## 6. Critérios de aceite

**CA-01 — Registrar despesa válida**
Dado que existe o serviço 1 e nenhuma despesa registrada
Quando o prestador registra no serviço 1 uma despesa com descrição "Registro de gaveta" e valor 35.5
Então a resposta tem código 201 e traz a despesa com id 1, servicoId 1, descrição "Registro de gaveta" e valor `"35.50"`

**CA-02 — Serviço inexistente**
Dado que não existe serviço com id 99
Quando o prestador registra no serviço 99 uma despesa com descrição "Cano PVC" e valor 20.00
Então a resposta tem código 404 com a mensagem `Serviço não encontrado`

**CA-03 — Valor inválido é rejeitado**
Dado que existe o serviço 1 sem despesas
Quando o prestador tenta registrar no serviço 1 uma despesa com valor 0
Então a resposta tem código 400 com a mensagem `Valor inválido`
E a consulta de despesas do serviço 1 traz uma lista vazia

**CA-04 — Campo obrigatório ausente**
Dado que existe o serviço 1 sem despesas
Quando o prestador tenta registrar no serviço 1 uma despesa sem o campo `descricao` e sem o campo `valor`
Então a resposta tem código 400 com a mensagem `Campo inválido: descricao`
E a consulta de despesas do serviço 1 traz uma lista vazia

**CA-05 — Soma e ordem das despesas de um serviço**
Dado que o serviço 1 tem as despesas 1 de 35.50 e 2 de 12.25
Quando o prestador consulta as despesas do serviço 1
Então a resposta tem código 200 e traz a despesa 1 antes da despesa 2, `totalDespesas` igual a `"47.75"` e `quantidadeDespesas` igual a `2`

**CA-06 — Despesas de outro serviço não aparecem**
Dado que o serviço 1 tem uma despesa de 35.50 e o serviço 2 tem uma despesa de 80.00
Quando o prestador consulta as despesas do serviço 2
Então a resposta traz exatamente 1 despesa, a de 80.00, e `totalDespesas` igual a `"80.00"`

**CA-07 — Serviço sem despesas**
Dado que existe o serviço 1 sem despesas
Quando o prestador consulta as despesas do serviço 1
Então a resposta tem código 200, lista vazia, `totalDespesas` igual a `"0.00"` e `quantidadeDespesas` igual a `0`

**CA-08 — Despesa não muda o total a receber**
Dado que existe só o serviço 1, pendente, de 150.00
Quando o prestador registra no serviço 1 uma despesa de 40.00
Então a consulta do total a receber traz `total` igual a `"150.00"` e `quantidadePendentes` igual a `1`

**CA-09 — Soma em centavos sem erro de arredondamento**
Dado que o serviço 1 tem as despesas de 0.10 e 0.20
Quando o prestador consulta as despesas do serviço 1
Então a resposta traz `totalDespesas` igual a `"0.30"`

**CA-10 — Consulta de serviço inexistente**
Dado que não existe serviço com id 99
Quando o prestador consulta as despesas do serviço 99
Então a resposta tem código 404 com a mensagem `Serviço não encontrado`

**CA-11 — Despesa em serviço pago** [depende da DÚVIDA da RN-06]
Dado que o serviço 1 está com situação `pago`
Quando o prestador registra no serviço 1 uma despesa de 25.00
Então [a resposta tem código 201 e a situação do serviço 1 continua `pago` — ou é rejeitada, conforme a RN-06]

## 7. Restrições

- Mesmas restrições da spec 001: Node.js 24 e Express 5, respostas em JSON, testes com `node --test`, um teste por critério de aceite.
- Valores guardados em centavos (número inteiro) e devolvidos no JSON como texto com 2 casas decimais (D-10 da spec 001).
- Enquanto os dados ficarem em memória (D-05 da spec 001), as despesas também somem quando o sistema reinicia.

## Decisões

| # | Ambiguidade | Decisão | Motivo |
|---|---|---|---|
| D-01 | "Despesa de cada serviço": a despesa pode existir sem serviço? | Não: toda despesa pertence a um serviço existente (RN-02). Despesas gerais ficam fora do escopo. | É a leitura direta do pedido ("de cada serviço"); despesa geral exige outra pergunta de negócio (rateio). |
| D-02 | A despesa guarda quantidade e preço unitário ou só o valor? | Só o valor total gasto. | O prestador quer saber quanto saiu do bolso; quantidade × preço dobraria as validações sem responder a pergunta. |
| D-03 | A despesa entra no total a receber? | Não (RN-05, CA-08). | Total a receber é o que o cliente deve ao prestador; material é dinheiro que o prestador gastou, não que tem a receber. |
| D-04 | Qual o limite do valor da despesa? | O mesmo do valor do serviço (RN-03), reaproveitando a regra da spec 001. | Uma regra de dinheiro só, com a mesma mensagem, evita duas validações quase iguais. |
| D-05 | Erro de serviço inexistente vem antes ou depois dos erros de campo? | Antes (RN-02). | Sem o serviço, a despesa não tem onde ser registrada; é o mesmo `404` da spec 001. |

### Resultado das três varreduras

- **Vagueza** (rápido, fácil, intuitivo, adequado, simples, eficiente, robusto, amigável): nenhuma ocorrência.
- **Fuga** (etc., entre outros, se necessário, se possível, quando aplicável, idealmente): nenhuma ocorrência. Os exemplos de despesas gerais na seção Escopo são uma lista entre parênteses só de ilustração; a regra que exclui todas elas é a D-01.
- **Ator e quantidade**: todo critério tem o ator explícito ("o prestador") e quantidades exatas ("exatamente 1 despesa"). As vozes passivas ("é rejeitado") estão nas regras, onde o sujeito é o sistema e a mensagem é exata. O "toda despesa" da D-01 é fechado (sem exceção).
- **Design disfarçado:** nenhum critério de aceite cita classe, tabela, framework ou biblioteca. Express e `node --test` aparecem só em Restrições.

### Se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?

**Ainda não.** Faltam as quatro respostas marcadas com `[DÚVIDA]` (data da despesa, despesa em serviço pago, despesas acima do valor do serviço e resultado do serviço na consulta). Como nas specs 001 e 002, os caminhos das rotas HTTP ficam para o plano de tarefas.
