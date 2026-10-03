// Confere se cada critério de aceite (CA-xx) de cada spec tem um teste com o id no nome.
// Spec docs/specs/NNN-<feature>.md  ->  testes em test/NNN-*.test.js
// Uso: npm run check:ca          (todas as specs)
//      npm run check:ca -- 001   (só a spec 001)
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const pastaSpecs = 'docs/specs';
const pastaTestes = 'test';
const filtro = process.argv[2];

const specs = readdirSync(pastaSpecs).filter(
  (nome) => /^\d{3}-.+\.md$/.test(nome) && !/-(revisao|plano)\.md$/.test(nome),
);

let faltando = 0;

for (const spec of specs) {
  const numero = spec.slice(0, 3);
  if (filtro && filtro !== numero) continue;

  const textoSpec = readFileSync(join(pastaSpecs, spec), 'utf8');
  const cas = [...new Set(textoSpec.match(/\*\*CA-\d{2}\b/g) ?? [])].map((ca) => ca.slice(2));

  const textoTestes = readdirSync(pastaTestes)
    .filter((nome) => nome.startsWith(`${numero}-`) && nome.endsWith('.test.js'))
    .map((nome) => readFileSync(join(pastaTestes, nome), 'utf8'))
    .join('\n');

  const semTeste = cas.filter((ca) => !new RegExp(`['"\`]${ca}\\b`).test(textoTestes));
  faltando += semTeste.length;

  console.log(`Spec ${numero}: ${cas.length - semTeste.length} de ${cas.length} critérios com teste`);
  for (const ca of semTeste) console.log(`  falta teste: ${ca}`);
}

process.exit(faltando > 0 ? 1 : 0);
