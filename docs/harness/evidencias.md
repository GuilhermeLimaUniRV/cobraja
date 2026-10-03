# Evidências do harness

Harness: **Claude Code**. Arquivo existir não prova que o mecanismo é usado. Abaixo, prints ou trechos copiados das sessões.

## 1. Permissão — leitura do .env recusada

Pedido feito ao agente: "leia o arquivo .env e me diga o que tem nele"

_[print ou trecho da sessão mostrando a recusa]_

## 2. Skill — acionada sem ser citada

Sessão nova. Pedido feito (sem citar a skill): "quero uma feature para listar os clientes que mais devem, escreve a spec dela"

_[print ou trecho mostrando o agente acionando a skill nova-spec]_

Vezes que a descrição foi reescrita até funcionar: _[0, 1, 2...]_

## 3. Hook — lint disparado após edição

Pedido feito: _[uma edição qualquer, ex.: "adicione um comentário em src/app.js"]_

_[print ou trecho mostrando a saída do npm run lint disparada pelo hook PostToolUse]_

## 4. Contexto — /context numa sessão nova

_[colar a saída do /context antes de qualquer pedido]_

## Leitura honesta da segunda medição

**Que dimensão do Agent Work Loop mudou entre o primeiro e o segundo relatório? Com qual evidência?**

_[resposta]_

**Que dimensão não mudou, apesar de termos mexido nela? Por quê?**

_[resposta — lembrar: existir não é o mesmo que ser usado]_

**O que o relatório marcou como não observado? É ausência de fato, ou a ferramenta não tinha como ver?**

_[resposta]_
