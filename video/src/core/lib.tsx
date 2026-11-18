import React from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../data/timeline.json';
import {C, mono, sans, serif, SIDE, TOP, CONTENT_W} from './theme';

// ---------- tempo ----------
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.32, 0.64, 1);
export const prog = (t: number, start: number, dur: number, ease = easeOut) => ease(clamp01((t - start) / dur));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- âncoras na narração ----------
type Word = {scene: number; text: string; start: number; end: number};
const norm = (s: string) => s.toLowerCase().replace(/[.,!?:;"“”]/g, '');
const WORDS = (timeline.words as Word[]).map((w) => ({...w, n: norm(w.text)}));
export const SCENES = timeline.scenes as {id: string; start: number; end: number}[];
export const DURATION = timeline.duration as number;

/** início (s) da frase falada `phrase` dentro da cena `scene` (1..7) */
export function at(scene: number, phrase: string, nth = 0): number {
  const p = phrase.split(/\s+/).map(norm);
  let count = 0;
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].scene !== scene) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) {
      const w = WORDS[i + j];
      if (!w || w.n !== p[j]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      if (count === nth) return WORDS[i].start;
      count++;
    }
  }
  throw new Error(`âncora não encontrada: cena ${scene} "${phrase}"`);
}
/** início de cada palavra da frase falada (para sincronizar palavra a palavra) */
export function times(scene: number, phrase: string, nth = 0): number[] {
  const s = at(scene, phrase, nth);
  const i = WORDS.findIndex((w) => w.scene === scene && w.start === s);
  return phrase.split(/\s+/).map((_, k) => WORDS[i + k].start);
}
/** fim (s) da última palavra da frase */
export function endOf(scene: number, phrase: string, nth = 0): number {
  const s = at(scene, phrase, nth);
  const i = WORDS.findIndex((w) => w.scene === scene && w.start === s);
  const n = phrase.split(/\s+/).length;
  return WORDS[i + n - 1].end;
}

// ---------- âncoras por props (Q) ----------
// Toda âncora de módulo é um Q: número (segundos absolutos) ou texto "frase[#n][+d|-d]".
//   'Uma pessoa'          início de "Uma pessoa" na cena
//   'procura o nome#1'    2ª vez que a frase aparece (n começa em 0, como em at())
//   'três idiomas+0.45'   0,45 s depois do início da frase
// As chaves de props que guardam âncoras se chamam `em` ou terminam em `Em` (o tools/orcamento.mjs confere todas).
export type Q = string | number;
export const parseQ = (q: string) => {
  const m = q.match(/^(.*?)(?:#(\d+))?([+-]\d*\.?\d+)?$/s)!;
  return {frase: m[1].trim(), n: m[2] ? parseInt(m[2], 10) : 0, d: m[3] ? parseFloat(m[3]) : 0};
};
export const qAt = (scene: number, q: Q): number => {
  if (typeof q === 'number') return q;
  const {frase, n, d} = parseQ(q);
  return at(scene, frase, n) + d;
};
/** fim da última palavra da frase de um Q (o deslocamento +d também vale) */
export const qEnd = (scene: number, q: Q): number => {
  if (typeof q === 'number') return q;
  const {frase, n, d} = parseQ(q);
  return endOf(scene, frase, n) + d;
};
/** número da cena (1..N) em que o componente está */
export const CenaCtx = React.createContext(0);
export const useCena = () => React.useContext(CenaCtx);
/** resolvedor de âncoras da cena atual: const q = useQ(); q(p.em) */
export const useQ = () => {
  const s = useCena();
  return (x: Q) => qAt(s, x);
};
export const useQEnd = () => {
  const s = useCena();
  return (x: Q) => qEnd(s, x);
};

// ---------- texto palavra por palavra ----------
export type Role = 's' | 'k' | 'a' | 'i' | 'w';
export type Part = [string, Role?];

const roleStyle = (role: Role, size: number): React.CSSProperties => {
  switch (role) {
    case 'k':
      return {fontFamily: sans, fontWeight: 700, color: C.ink, fontSize: size, letterSpacing: '-0.035em'};
    case 'a':
      return {fontFamily: sans, fontWeight: 700, color: C.accentLight, fontSize: size, letterSpacing: '-0.035em'};
    case 'i':
      return {fontFamily: serif, fontWeight: 300, fontStyle: 'italic', color: C.accentLight, fontSize: size * 1.12, letterSpacing: '-0.02em'};
    case 'w':
      return {fontFamily: sans, fontWeight: 500, color: C.ink, fontSize: size};
    default:
      return {fontFamily: sans, fontWeight: 400, color: C.support, fontSize: size};
  }
};

/**
 * Uma linha de texto cujas palavras entram uma a uma a partir de `start`.
 * O intervalo entre palavras encolhe ao longo da linha (onda, não metrônomo),
 * e palavras-chave sobem mais que as de apoio.
 */
export const Line: React.FC<{
  parts: Part[];
  start: number;
  size?: number;
  keySize?: number;
  gap?: number;
  style?: React.CSSProperties;
  sync?: number[]; // tempos exatos por palavra (opcional)
}> = ({parts, start, size = 60, keySize, gap = 0.075, style, sync}) => {
  const t = useT();
  let idx = 0;
  let delay = 0;
  const words: React.ReactNode[] = [];
  parts.forEach(([text, role = 's'], pi) => {
    const r = role as Role;
    const sz = r === 'k' || r === 'a' || r === 'i' ? keySize ?? size : size;
    text.split(' ').filter(Boolean).forEach((w, wi) => {
      const ws = sync ? sync[idx] ?? start + delay : start + delay;
      const isKey = r !== 's' && r !== 'w';
      const p = prog(t, ws, isKey ? 0.62 : 0.5, backOut);
      const o = prog(t, ws, 0.32);
      const rise = (isKey ? 0.42 : 0.26) * sz;
      words.push(
        <span
          key={`${pi}-${wi}`}
          style={{
            ...roleStyle(r, sz),
            display: 'inline-block',
            opacity: o,
            transform: `translateY(${(1 - p) * rise}px)`,
            filter: `blur(${(1 - o) * 10}px)`,
            marginRight: '0.24em',
            lineHeight: 1.04,
          }}
        >
          {w}
        </span>,
      );
      idx++;
      delay += Math.max(0.035, gap * Math.pow(0.9, idx));
    });
  });
  return <div style={{display: 'block', ...style}}>{words}</div>;
};

/** Bloco que some (blur/subida/zoom) num instante dado; a entrada fica com as linhas. */
export const Block: React.FC<{
  from: number;
  to?: number;
  exit?: 'blur' | 'up' | 'zoom';
  top: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({from, to = Infinity, exit = 'blur', top, children, style}) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.5) return null;
  const e = prog(t, to, 0.42, Easing.bezier(0.4, 0, 1, 1));
  const tr =
    exit === 'up' ? `translateY(${-90 * e}px)` : exit === 'zoom' ? `scale(${1 - 0.08 * e})` : `scale(${1 + 0.03 * e})`;
  return (
    <div
      style={{
        position: 'absolute',
        left: SIDE,
        width: CONTENT_W,
        top,
        opacity: 1 - e,
        filter: `blur(${e * 16}px)`,
        transform: tr,
        transformOrigin: '50% 30%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** fade + subida simples para elementos inteiros (cartões, selos) */
export const useEnter = (start: number, dist = 40, dur = 0.6) => {
  const t = useT();
  const p = prog(t, start, dur, backOut);
  const o = prog(t, start, dur * 0.6);
  return {
    opacity: o,
    transform: `translateY(${(1 - p) * dist}px)`,
    filter: `blur(${(1 - o) * 8}px)`,
  } as React.CSSProperties;
};

export const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
  children,
  color = C.support,
  size = 34,
  style,
}) => <span style={{fontFamily: mono, fontSize: size, color, letterSpacing: '0.01em', ...style}}>{children}</span>;

export const Dot: React.FC<{color?: string; size?: number}> = ({color = C.gold, size = 14}) => (
  <span style={{display: 'inline-block', width: size, height: size, borderRadius: 99, background: color, marginRight: 14, verticalAlign: 'middle'}} />
);

/** cartão de interface em perspectiva leve que se endireita devagar */
export const Panel: React.FC<{
  start: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  tilt?: number;
}> = ({start, style, children, tilt = 1}) => {
  const t = useT();
  const p = prog(t, start, 0.8, backOut);
  const settle = prog(t, start, 4, easeOut);
  const o = prog(t, start, 0.45);
  const rx = lerp(14, 3, settle) * tilt;
  const ry = lerp(-9, -2, settle) * tilt;
  return (
    <div
      style={{
        opacity: o,
        transform: `perspective(1900px) translateY(${(1 - p) * 120}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        transformOrigin: '50% 0%',
        filter: `blur(${(1 - o) * 10}px)`,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.065), rgba(255,255,255,0.03))',
        border: `1.5px solid ${C.line}`,
        borderRadius: 10,
        boxShadow: '0 40px 90px rgba(0,0,0,0.55)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const TOP_LABEL_Y = TOP - 30;

// ---------- sequência de telas dentro de um módulo ----------
export type Saida = 'blur' | 'up' | 'zoom';
export type Tela = {em: Q; top: number; saida?: Saida; style?: React.CSSProperties; c: React.ReactNode};
/**
 * Telas de um módulo, uma depois da outra: cada tela sai 0,3 s antes da próxima começar,
 * e a última sai em `ate` (início do próximo módulo da cena - 0,3 s). Telas `null`/`false` são puladas.
 */
export const Telas: React.FC<{ate?: number; telas: (Tela | null | false | undefined)[]}> = ({ate, telas}) => {
  const q = useQ();
  const list = telas.filter(Boolean) as Tela[];
  return (
    <>
      {list.map((x, k) => (
        <Block key={k} from={q(x.em)} to={k < list.length - 1 ? q(list[k + 1].em) - 0.3 : ate} top={x.top} exit={x.saida} style={x.style}>
          {x.c}
        </Block>
      ))}
    </>
  );
};
