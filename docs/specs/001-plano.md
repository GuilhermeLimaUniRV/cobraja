# Plano de tarefas — Spec 001 (registro de serviços e controle de pagamento)

> Derivado de [001-registro-de-servicos.md](001-registro-de-servicos.md) (versão 3). Uma tarefa = um commit pequeno, com mensagem citando a spec e os critérios atendidos. Nenhuma tarefa começa antes da anterior passar em `npm test` e `npm run lint`.

## Interface HTTP (decisão D-13 da spec)

A spec diz **o que** a API responde; este plano fixa **por onde**.

| Ação da spec | Rota | Sucesso | Erros |
|---|---|---|---|
| Registrar serviço | `POST /servicos` | 201 + serviço | 400 (RN-08, RN-01, RN-02) |
| Listar serviços (filtro opcional) | `GET /servicos?situacao=pendente\|pago` | 200 + lista | 400 se `situacao` tiver outro valor |
| Marcar como pago | `POST /servicos/:id/pagamento` | 200 + serviço | 404 (não existe), 409 (já pago) |
| Total a receber | `GET /servicos/total-a-receber` | 200 + `{ total, quantidadePendentes }` | — |

- **Serviço na resposta:** `{ id, cliente, descricao, valor, dataRealizacao, situacao, dataPagamento }`, com `valor` em texto e 2 casas (D-10). `cliente` e `descricao` são devolvidos sem os espaços das pontas.
- **Erro na resposta:** `{ "mensagem": "<texto exato da spec>" }`.
- **Data de hoje:** o app recebe uma função `hoje()` que devolve `AAAA-MM-DD` no fuso America/Sao_Paulo. Os testes passam uma data fixa (`2026-10-03`, a data usada nos critérios).

## Tarefas

| # | Tarefa | Critérios / regras | Prova |
|---|---|---|---|
| T1 | Dinheiro em centavos: converter a entrada (número) para centavos validando a RN-01, e centavos para texto com 2 casas | RN-01, D-07, D-10 | coberta pelos testes da T2 |
| T2 | `POST /servicos` com as validações na ordem da D-11 (RN-08 → RN-01 → RN-02), id sequencial e situação inicial `pendente`, mais um `GET /servicos` simples, sem filtro | CA-01, CA-02, CA-03, CA-09, CA-10, CA-11 · RN-03, RN-08 | 6 testes passando |
| T3 | Filtro `situacao` e ordem por data de realização e id no `GET /servicos` | CA-07, CA-13 · RN-07 | 2 testes passando |
| T4 | `POST /servicos/:id/pagamento` | CA-04, CA-05, CA-08 · RN-04, RN-05 | 3 testes passando |
| T5 | `GET /servicos/total-a-receber` | CA-06, CA-12 · RN-06 | 2 testes passando |
| T6 | Fechamento: rotas no AGENTS.md, spec atualizada com o que a implementação decidiu, diário do agente | item 6 e diário da atividade | `npm test` + `npm run check:ca -- 001` passando (13 de 13) |

### Ajustes feitos durante a implementação

> **Ajuste durante a T2:** CA-02, CA-03 e CA-09 terminam com "a listagem de serviços continua vazia", então dependem do `GET /servicos`. A primeira versão do plano deixava a listagem inteira na T3, e os três testes falharam por isso. A listagem simples passou para a T2; filtro e ordem continuam na T3.
>
> **Ajuste antes da T3:** o CA-07 começa com "dois pendentes e um pago", então depende do pagamento. A T4 foi feita antes da T3 (a numeração das tarefas foi mantida).

## Pontos que a spec não cobria (decididos aqui, levados para a spec na T6)

- **Filtro inválido** (`GET /servicos?situacao=cancelado`): responde 400 com `Campo inválido: situacao`, no mesmo padrão da RN-08. Sem isso, a implementação poderia ignorar o filtro e devolver tudo, o que esconderia um erro do cliente da API.

## Fora deste plano

Persistência em banco, autenticação e a spec 002: continuam fora, conforme o escopo da spec 001.
