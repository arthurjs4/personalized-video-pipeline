// Confere o lead.ts contra as narrações e gera os arquivos que o kit-tools e os efeitos usam.
//
// usage (na pasta do projeto):  node tools\orcamento.mjs
//
// 1. palavras: soma a faixa de cada módulo por cena e compara com voz\cenaN.txt (alvo total 600 a 640)
// 2. âncoras: toda chave `em` / `...Em` do lead.ts (com os padrões do catálogo) tem que existir na cenaN.txt
//    - erro "âncora não encontrada: cena N "frase"" (o mesmo texto do lib.tsx)
//    - aviso quando a frase aparece mais de uma vez na cena e a âncora não diz qual (#n)
// 3. tela: travessão em texto de tela e `top` abaixo de y 1480
// 4. gera: video\src\common.tsx (LABELS para o roteiro.py e âncoras para o ancoras.py do kit-tools),
//          video\src\data\sfx.json (efeitos por módulo) e video\src\data\legendas.json (números nas legendas)
// Sai com código 1 se houver erro de âncora ou de tela.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// o node avisa que o lead.ts é ESM sem "type": "module" no package.json; o aviso não importa aqui
process.removeAllListeners('warning');
process.on('warning', (w) => (w.code === 'MODULE_TYPELESS_PACKAGE_JSON' ? null : console.warn(w.message)));

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const src = path.join(root, 'video', 'src');
const lead = await import(pathToFileURL(path.join(src, 'lead.ts')).href);
const cat = await import(pathToFileURL(path.join(src, 'scenes', 'catalogo.ts')).href);
const {CENAS, LEGENDAS = []} = lead;
const {completar, palavrasDe, sfxDe, addQ} = cat;

const PUNCT = /[.,!?:;"“”]/g;
const norm = (w) => w.toLowerCase().replace(PUNCT, '');
const parseQ = (q) => {
  const m = q.match(/^(.*?)(?:#(\d+))?([+-]\d*\.?\d+)?$/s);
  return {frase: m[1].trim(), n: m[2] ? parseInt(m[2], 10) : 0, explicito: !!m[2]};
};

const erros = [];
const avisos = [];
const linhas = [];

// ---------- palavras ----------
const words = {};
let total = 0;
let minT = 0;
let maxT = 0;
CENAS.forEach((c, i) => {
  const n = i + 1;
  const f = path.join(root, 'voz', `cena${n}.txt`);
  const txt = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
  const w = txt ? txt.split(/\s+/).filter(Boolean) : [];
  words[n] = w.map(norm).filter(Boolean);
  const faixa = c.modulos.map(palavrasDe).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
  total += w.length;
  minT += faixa[0];
  maxT += faixa[1];
  const fora = txt && (w.length < faixa[0] || w.length > faixa[1]);
  linhas.push(`cena${n}: ${txt ? String(w.length).padStart(3) : '  -'} palavras · faixa dos módulos ${faixa[0]} a ${faixa[1]}${fora ? '  <- fora da faixa' : ''} · ${c.modulos.map((m) => m.id).join(', ')}`);
  if (!txt) avisos.push(`voz\\cena${n}.txt não existe`);
});
const extra = fs.existsSync(path.join(root, 'voz')) ? fs.readdirSync(path.join(root, 'voz')).filter((f) => /^cena\d+\.txt$/.test(f) && parseInt(f.slice(4), 10) > CENAS.length) : [];
if (extra.length) avisos.push(`há ${extra.join(', ')} além das ${CENAS.length} cenas do lead.ts`);
if (CENAS.length !== 10) avisos.push(`o lead.ts tem ${CENAS.length} cenas; contar/checar/roteiro do kit-tools ainda contam as cenas 1 a 10`);

// ---------- âncoras ----------
const anchors = []; // {cena, q, onde}
const walk = (obj, cena, onde) => {
  if (Array.isArray(obj)) return obj.forEach((x, i) => walk(x, cena, `${onde}[${i}]`));
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if ((k === 'em' || /Em$/.test(k)) && typeof v === 'string') anchors.push({cena, q: v, onde: `${onde}.${k}`});
    else if (typeof v === 'object') walk(v, cena, `${onde}.${k}`);
  }
};
CENAS.forEach((c, i) => {
  c.modulos.forEach((m, k) => walk(completar(m), i + 1, `cena${i + 1}.${m.id}#${k}`));
  if (c.cursor) walk(c.cursor, i + 1, `cena${i + 1}.cursor`);
});
const count = (cena, frase) => {
  const p = frase.split(/\s+/).map(norm).filter(Boolean);
  const w = words[cena] ?? [];
  let c = 0;
  for (let i = 0; i + p.length <= w.length; i++) if (p.every((x, j) => w[i + j] === x)) c++;
  return c;
};
const vistos = new Set();
for (const a of anchors) {
  if (!words[a.cena]?.length) continue;
  const {frase, n, explicito} = parseQ(a.q);
  const c = count(a.cena, frase);
  if (c <= n) erros.push(`âncora não encontrada: cena ${a.cena} "${frase}"${n ? ` (nº ${n})` : ''} · ${a.onde}`);
  else if (c > 1 && !explicito && !vistos.has(`${a.cena}|${frase}`)) {
    vistos.add(`${a.cena}|${frase}`);
    avisos.push(`âncora repetida: cena ${a.cena} "${frase}" aparece ${c}x; vale a 1ª (use "${frase}#1" para a 2ª) · ${a.onde}`);
  }
}

// ---------- tela ----------
const walkTela = (obj, onde) => {
  if (Array.isArray(obj)) return obj.forEach((x, i) => walkTela(x, `${onde}[${i}]`));
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && k !== 'em' && !/Em$/.test(k) && /[—–]/.test(v)) erros.push(`travessão em texto de tela: ${onde}.${k} "${v}"`);
    if (k === 'top' && typeof v === 'number' && v > 1480) erros.push(`elemento em y ${v} (abaixo de 1480): ${onde}`);
    if (typeof v === 'object') walkTela(v, `${onde}.${k}`);
  }
};
CENAS.forEach((c, i) => walkTela(c, `cena${i + 1}`));

// ---------- arquivos gerados ----------
const esc = (s) => s.replace(/\\/g, '\\\\');
let shim = `// GERADO por tools/orcamento.mjs a partir do lead.ts. Não edite: rode \`node tools\\orcamento.mjs\`.
// Existe para o kit-tools: roteiro.py lê LABELS daqui e ancoras.py lê as âncoras do comentário abaixo.
export * from './core/common';
/*
const LABELS = [
${CENAS.map((c) => `  '${esc(c.rotulo.replace(/'/g, '’'))}',`).join('\n')}
];
`;
CENAS.forEach((c, i) => {
  shim += `const s = ${i + 1};\n`;
  const seen = new Set();
  for (const a of anchors.filter((x) => x.cena === i + 1)) {
    const {frase, n} = parseQ(a.q);
    const key = `${frase}|${n}`;
    if (seen.has(key) || frase.includes("'")) continue;
    seen.add(key);
    shim += `at(s, '${frase}'${n ? `, ${n}` : ''});\n`;
  }
});
shim += '*/\n';
fs.writeFileSync(path.join(src, 'common.tsx'), shim, 'utf8');

const sfx = [];
CENAS.forEach((c, i) => {
  const s = i + 1;
  const mods = c.modulos.map(completar);
  mods.forEach((m, k) => {
    for (const cu of sfxDe(m)) sfx.push({cena: s, ...cu});
    if (k > 0) sfx.push({cena: s, em: addQ(m.em ?? 0, -0.3), tipo: 'sai'});
  });
  if (c.cursor) for (const pt of c.cursor.pontos) if (pt.clique) sfx.push({cena: s, em: pt.em, tipo: 'clique'});
});
fs.mkdirSync(path.join(src, 'data'), {recursive: true});
fs.writeFileSync(path.join(src, 'data', 'sfx.json'), JSON.stringify(sfx, null, 1), 'utf8');
fs.writeFileSync(path.join(src, 'data', 'legendas.json'), JSON.stringify(LEGENDAS, null, 1), 'utf8');

// sem foto do narrador: a cena final usa a inicial no avatar
fs.writeFileSync(path.join(src, 'data', 'foto.json'), JSON.stringify({arquivo: null}), 'utf8');

// ---------- relatório ----------
console.log(linhas.join('\n'));
console.log(`TOTAL: ${total} palavras · faixa dos módulos ${minT} a ${maxT} · alvo 600 a 640${total < 600 || total > 640 ? '  <- FORA DO ALVO' : ''}`);
console.log(`âncoras conferidas: ${anchors.length} · efeitos: ${sfx.length} · gerados: video\\src\\common.tsx, data\\sfx.json, data\\legendas.json`);
if (avisos.length) console.log(`AVISOS: ${avisos.length}\n` + avisos.map((a) => '  ' + a).join('\n'));
if (erros.length) {
  console.log(`ERROS: ${erros.length}\n` + erros.map((e) => '  ' + e).join('\n'));
  process.exit(1);
}
console.log('orçamento ok');
