# Revisão cruzada — Spec 001

> Respostas da equipe revisora transcritas da conversa de 03/10/2026, sem edição de conteúdo. A equipe CobraJá registra abaixo o que mudou por causa delas.

- **Equipe revisora:** Noiva.AI (Caio, Gabriel, Igor e João)
- **Data da revisão:** 03/10/2026
- **Versão revisada:** [`0ae0f8e`](https://github.com/GuilhermeLimaUniRV/cobraja/commit/0ae0f8e) (spec versão 2)

## As três perguntas da oficina (Aula 07)

**1. Conseguiram entender o que deve ser construído sem perguntar nada à equipe?**

> Sim, de boa. Ficou bem claro que é uma API em JSON pra um prestador só registrar serviço, listar, marcar como pago e ver quanto tem pra receber. A seção de "Não inclui" e a tabela de decisões ajudaram demais, matou várias dúvidas antes delas aparecerem. A tabela de exemplos da RN-01 ficou muito boa também.

**2. Acharam alguma frase que admite duas leituras diferentes? Qual?**

> Achamos três pontos:
>
> "Valores monetários são guardados em centavos (número inteiro) e devolvidos com 2 casas decimais". No JSON, o valor volta como string ("89.90") ou como número (89.9)? Número no JSON não guarda o zero no final, então dá pra implementar dos dois jeitos e o teste do CA-06 (239.90) pode passar ou quebrar dependendo disso.
>
> "Se um campo obrigatório falta ou desrespeita o tamanho da seção Dados, o registro é rejeitado com a mensagem Campo inválido: <nome do campo>". Se o valor não vier, a mensagem é Campo inválido: valor (RN-08) ou Valor inválido (RN-01)? E se a data vier num formato errado tipo 03/10/2026, cai em qual regra? Também não diz qual campo aparece se tiver mais de um errado.
>
> "Então a resposta traz o total 239.90 e a quantidade de serviços pendentes 2". Não fala o nome do campo da quantidade, então cada um pode inventar um (quantidade, pendentes, qtdPendentes...).

**3. Conseguem dizer, lendo só os critérios de aceite, se a feature está pronta?**

> Quase. Pro fluxo principal sim, os CAs são bem testáveis. Mas tem regra que nenhum CA cobre: a RN-08 (campo inválido), o limite de R$ 100.000,00, o total 0.00 sem pendentes e o desempate por id da RN-07. Daria pra passar nos 8 CAs e ainda ter essas regras quebradas. Fica a sugestão de criar um CA pra RN-08 pelo menos. E como as rotas ficaram pro plano, os testes também dependem de lá.

## O que a equipe CobraJá mudou por causa da revisão

| Apontamento | O que mudou na spec | Decisão |
|---|---|---|
| Valor volta como string ou número? | Valores em dinheiro saem no JSON como **texto** com 2 casas (`"89.90"`); a entrada continua sendo número. Dados, tabela de exemplos, CA-01 e CA-06 atualizados. | D-10 |
| `valor` ausente: RN-08 ou RN-01? Data `03/10/2026`? Vários campos errados? | RN-08 reescrita: campo ausente ou fora do formato → `Campo inválido: <campo>`; valor presente mas fora da faixa → RN-01; data no formato certo mas futura → RN-02. Com mais de um erro, vale o primeiro na ordem da seção Dados. | D-11 |
| Nome do campo da quantidade no total | O total responde `{"total": "...", "quantidadePendentes": N}`. CA-06 atualizado. | D-12 |
| RN-08, limite de R$ 100.000,00, total `0.00` e desempate por id sem CA | Novos CA-09 (campo ausente), CA-10 (data em formato errado), CA-11 (limite máximo), CA-12 (total zero) e CA-13 (desempate por id). | — |
| Rotas no plano: testes dependem dele | Mantido: rota HTTP é decisão de interface e fica no `001-plano.md`, que é o primeiro item da atividade do esqueleto (10/10) e vem antes de qualquer teste. Registrado na resposta final da seção Decisões. | D-13 |
