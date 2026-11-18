import React from 'react';
import {AbsoluteFill} from 'remotion';
import subtitles from '../data/subtitles.json';
import {acc, C, H, mono, sans, SIDE, W} from './theme';
import {DURATION, easeInOut, lerp, prog, SCENES, useT} from './lib';
import {rgbStr} from './cor';
import {CENAS, LEAD} from '../lead';

// ---------- fundo: grade de pontos, brilho no centro, motivo do lead (bem sutil) e poeira na cor de destaque ----------
/** desenho de linhas atrás de tudo, ligado ao setor do lead (LEAD.tema.motivo) */
const Motivo: React.FC<{t: number; rot: number}> = ({t, rot}) => {
  const m = LEAD.tema.motivo ?? 'nenhum';
  if (m === 'nenhum') return null;
  if (m === 'diamante')
    return (
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.09}}>
        <g transform={`translate(${W / 2} ${H * 0.47}) rotate(${rot})`} fill="none" stroke={C.accent} strokeWidth="1.4">
          <polygon points="0,-560 470,-160 0,640 -470,-160" />
          <polygon points="-470,-160 -230,-400 0,-560 230,-400 470,-160" />
          <path d="M-470 -160 H470 M-230 -400 L-150 -160 L0 640 L150 -160 L230 -400 M0 -560 L-150 -160 M0 -560 L150 -160" />
        </g>
      </svg>
    );
  const paths: Record<string, string[]> = {
    escudo: ['M0 -600 L480 -420 V20 C480 320 270 520 0 640 C-270 520 -480 320 -480 20 V-420 Z', 'M0 -500 L380 -356 V10 C380 260 210 420 0 520 C-210 420 -380 260 -380 10 V-356 Z', 'M0 -600 V640 M-480 -100 H480'],
    casa: ['M-480 -60 L0 -560 L480 -60', 'M-380 -150 V600 H380 V-150', 'M-120 600 V260 H120 V600', 'M-300 60 H-140 V200 H-300 Z M140 60 H300 V200 H140 Z'],
    pino: ['M0 640 C-260 300 -420 60 -420 -160 A420 420 0 0 1 420 -160 C420 60 260 300 0 640 Z', 'M0 -330 A170 170 0 1 1 -0.1 -330 Z'],
  };
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.08}}>
      <g transform={`translate(${W / 2} ${H * 0.47}) rotate(${Math.sin(rot / 40) * 4}) scale(${1 + Math.sin(t / 5) * 0.02})`} fill="none" stroke={C.accent} strokeWidth="1.4">
        {(paths[m] ?? paths.escudo).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
};

const DUST = Array.from({length: 26}, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {x: r(1) * W, y: r(2) * H, s: 1.5 + r(3) * 3.2, sp: 6 + r(4) * 14, ph: r(5) * 10, a: 0.18 + r(6) * 0.4};
});

export const Background: React.FC = () => {
  const t = useT();
  const drift = Math.sin(t / 9) * 40;
  const rot = t * 2.2;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${acc(0.11)} 1.6px, transparent 1.8px)`,
          backgroundSize: '38px 38px',
          backgroundPosition: '19px 19px',
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 30%, transparent 85%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 38% at ${50 + drift / 20}% ${46 + drift / 30}%, ${acc(0.17)} 0%, rgba(${rgbStr(C.accentMid)},0.07) 45%, transparent 75%)`,
        }}
      />
      <Motivo t={t} rot={rot} />
      {DUST.map((d, i) => {
        const y = (d.y - t * d.sp + H * 10) % H;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.3 + d.ph);
        return <div key={i} style={{position: 'absolute', left: d.x + Math.sin(t / 3 + d.ph) * 14, top: y, width: d.s, height: d.s, borderRadius: 99, background: C.accentLight, opacity: d.a * tw, boxShadow: `0 0 ${d.s * 3}px rgba(${rgbStr(C.accentLight)},0.6)`}} />;
      })}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 18% at 84% 7%, ${acc(0.09)}, transparent 70%)`}} />
      {(LEAD.tema.brilhos ?? []).map((b, i) => (
        <AbsoluteFill key={i} style={{background: `radial-gradient(${['ellipse 70% 30% at 20% 95%', 'ellipse 60% 35% at 85% 70%'][i % 2]}, rgba(${rgbStr(b.cor)},${b.alfa}), transparent 70%)`}} />
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- rótulo mono no topo + barra de progresso ----------
// rótulos e cenas datadas vêm do lead.ts (CENAS[n].rotulo / .datado)
const LABELS = CENAS.map((c) => c.rotulo);
const DATED = new Set(CENAS.flatMap((c, i) => (c.datado ? [i] : [])));

export const TopLabel: React.FC = () => {
  const t = useT();
  return (
    <>
      {SCENES.map((s, i) => {
        const a = i === 0 ? prog(t, 0, 0.4) : prog(t, s.start - 0.1, 0.4);
        const b = i < SCENES.length - 1 ? prog(t, s.end - 0.35, 0.3) : 0;
        const o = a * (1 - b);
        if (o <= 0) return null;
        return (
          <div key={s.id} style={{position: 'absolute', left: SIDE, right: SIDE, top: 168, opacity: o, transform: `translateY(${(1 - a) * 14}px)`}}>
            <span style={{fontFamily: mono, fontSize: 34, color: C.support}}>
              <span style={{color: C.accent}}>// {String(i + 1).padStart(2, '0')}</span> · {LABELS[i]}
            </span>
            {DATED.has(i) ? (
              <div style={{position: 'absolute', right: 0, top: 76, fontFamily: mono, fontSize: 30, color: C.dim}}>dados de {LEAD.dataBusca}</div>
            ) : null}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: SIDE, right: SIDE, top: 228, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2}}>
        <div style={{width: `${Math.min(100, (t / DURATION) * 100)}%`, height: '100%', background: C.accent, borderRadius: 2}} />
      </div>
    </>
  );
};

// ---------- legenda (até 2 linhas) ----------
type Cue = {text: string; start: number; end: number};
export const Subtitles: React.FC = () => {
  const t = useT();
  const cue = (subtitles as Cue[]).find((c) => t >= c.start - 0.05 && t < c.end);
  if (!cue) return null;
  const o = Math.min(prog(t, cue.start - 0.05, 0.12), 1 - prog(t, cue.end - 0.1, 0.1));
  return (
    <div style={{position: 'absolute', left: SIDE, right: SIDE, bottom: 200, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.28,
          color: '#F7F5EE',
          textAlign: 'center',
          background: 'rgba(8,8,8,0.82)',
          border: `1px solid ${acc(0.14)}`,
          padding: '14px 26px',
          borderRadius: 8,
          maxWidth: 920,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

// ---------- cursor com a etiqueta "Ana" (narradora) ----------
export type CursorKey = {t: number; x: number; y: number; click?: boolean};
export const Cursor: React.FC<{keys: CursorKey[]; until: number}> = ({keys, until}) => {
  const t = useT();
  if (t < keys[0].t - 0.4 || t > until + 0.4) return null;
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t >= a.t) {
      const dur = Math.min(0.75, Math.max(0.25, b.t - a.t));
      const p = prog(t, b.t - dur, dur, easeInOut);
      x = lerp(a.x, b.x, p);
      y = lerp(a.y, b.y, p);
    }
  }
  const o = Math.min(prog(t, keys[0].t - 0.4, 0.35), 1 - prog(t, until, 0.35));
  const clickK = keys.filter((k) => k.click).find((k) => t >= k.t && t < k.t + 0.5);
  const press = clickK ? 1 - Math.abs((t - clickK.t) / 0.12 - 1) : 0;
  const ring = clickK ? prog(t, clickK.t, 0.5) : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, opacity: o, zIndex: 50}}>
      {clickK ? (
        <div style={{position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: 99, border: `3px solid ${C.accent}`, opacity: 1 - ring, transform: `scale(${0.4 + ring * 1.2})`}} />
      ) : null}
      <svg width="46" height="46" viewBox="0 0 24 24" style={{transform: `scale(${1 - Math.max(0, press) * 0.12})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))'}}>
        <path d="M4 2.5 L19.5 13 L12.2 14 L16 21 L13.2 22.3 L9.4 15.3 L4 20 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: x > 760 ? -110 : 34, top: 42, background: C.accent, color: C.onAccent, fontFamily: sans, fontWeight: 600, fontSize: 30, padding: '4px 14px', borderRadius: 6, whiteSpace: 'nowrap'}}>
        Ana
      </div>
    </div>
  );
};

// ---------- ícones de linha ----------
const ic = (d: React.ReactNode, size = 44, color = C.accent) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
export const Icon = {
  search: (s?: number, c?: string) => ic(<><circle cx="11" cy="11" r="6.5" /><path d="M16 16 L20.5 20.5" /></>, s, c),
  card: (s?: number, c?: string) => ic(<><rect x="2.5" y="5.5" width="19" height="13" rx="2" /><path d="M2.5 10 H21.5 M6 15 H10" /></>, s, c),
  chat: (s?: number, c?: string) => ic(<path d="M4 5.5 h16 v10 h-9 l-4.5 3.5 v-3.5 H4 z" />, s, c),
  bell: (s?: number, c?: string) => ic(<><path d="M6 16.5 V11 a6 6 0 0 1 12 0 v5.5 l1.5 1.5 h-15 z" /><path d="M10 20.5 h4" /></>, s, c),
  person: (s?: number, c?: string) => ic(<><circle cx="12" cy="8" r="3.6" /><path d="M5 20.5 c0.8 -4 3.6 -6 7 -6 s6.2 2 7 6" /></>, s, c),
  pin: (s?: number, c?: string) => ic(<><path d="M12 21 c-4.5 -5 -7 -8.6 -7 -11.5 a7 7 0 0 1 14 0 c0 2.9 -2.5 6.5 -7 11.5 z" /><circle cx="12" cy="9.5" r="2.4" /></>, s, c),
  clock: (s?: number, c?: string) => ic(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5 V12 l3 2" /></>, s, c),
  lock: (s?: number, c?: string) => ic(<><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5 V7.5 a4 4 0 0 1 8 0 V10.5" /></>, s, c),
  undo: (s?: number, c?: string) => ic(<><path d="M9 7 L4.5 11.5 L9 16" /><path d="M5 11.5 H14 a5.5 5.5 0 0 1 0 11 H11" /></>, s, c),
  check: (s?: number, c?: string) => ic(<><circle cx="12" cy="12" r="8.5" /><path d="M8 12.3 l2.7 2.7 L16.2 9.5" /></>, s, c),
  x: (s?: number, c?: string) => ic(<><circle cx="12" cy="12" r="8.5" /><path d="M9 9 L15 15 M15 9 L9 15" /></>, s, c),
  sliders: (s?: number, c?: string) => ic(<><path d="M4 7 H20 M4 17 H20" /><circle cx="9" cy="7" r="2.2" /><circle cx="15" cy="17" r="2.2" /></>, s, c),
  pen: (s?: number, c?: string) => ic(<><path d="M4 20 l1 -4.5 L15.5 5 l3.5 3.5 L8.5 19 z" /><path d="M13.5 7 l3.5 3.5" /></>, s, c),
  phone: (s?: number, c?: string) => ic(<><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5 h3" /></>, s, c),
  call: (s?: number, c?: string) => ic(<path d="M5 3.5 h3.5 l1.6 4.2 -2.2 1.6 a11 11 0 0 0 6.8 6.8 l1.6 -2.2 4.2 1.6 v3.5 a2 2 0 0 1 -2 2 A16.5 16.5 0 0 1 3 5.5 a2 2 0 0 1 2 -2 z" />, s, c),
  play: (s?: number, c?: string) => ic(<><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M10 9 L15 12 L10 15 Z" /></>, s, c),
  text: (s?: number, c?: string) => ic(<><path d="M4 6 H20 M4 11 H20 M4 16 H13" /></>, s, c),
  shield: (s?: number, c?: string) => ic(<><path d="M12 3 L19.5 6 V11.5 c0 4.5 -3.2 8 -7.5 9.5 C7.7 19.5 4.5 16 4.5 11.5 V6 Z" /><path d="M9 12 l2.2 2.2 L15.5 10" /></>, s, c),
  badge: (s?: number, c?: string) => ic(<><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5 L7 21 L12 18.5 L17 21 L15.5 13.5" /></>, s, c),
  photo: (s?: number, c?: string) => ic(<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M3.5 17 L9 12.5 L13 15.5 L16 13 L20.5 16.5" /></>, s, c),
  post: (s?: number, c?: string) => ic(<><rect x="4" y="3.5" width="16" height="17" rx="2" /><path d="M8 8 H16 M8 12 H16 M8 16 H12" /></>, s, c),
  home: (s?: number, c?: string) => ic(<><path d="M3.5 11 L12 4 L20.5 11" /><path d="M6 9.5 V20 H18 V9.5" /><path d="M10 20 V14.5 H14 V20" /></>, s, c),
  globe: (s?: number, c?: string) => ic(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12 H20.5 M12 3.5 C9 7 9 17 12 20.5 C15 17 15 7 12 3.5" /></>, s, c),
  diamond: (s?: number, c?: string) => ic(<><path d="M6 4 H18 L22 9 L12 21 L2 9 Z" /><path d="M2 9 H22 M9 4 L7.5 9 L12 21 L16.5 9 L15 4" /></>, s, c),
  star: (fill: number, s = 34) => (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`g${Math.round(fill * 100)}`}>
          <stop offset={`${fill * 100}%`} stopColor={C.accent} />
          <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>
      <path d="M12 2.8 l2.8 5.9 6.4 0.8 -4.7 4.4 1.2 6.4 -5.7 -3.1 -5.7 3.1 1.2 -6.4 -4.7 -4.4 6.4 -0.8 z" fill={`url(#g${Math.round(fill * 100)})`} />
    </svg>
  ),
};

export type IconName = Exclude<keyof typeof Icon, 'star'>;
/** ícone por nome (para props vindas do lead.ts) */
export const icon = (name: IconName, size?: number, color?: string) => (Icon[name] as (s?: number, c?: string) => React.ReactNode)(size, color);
/** ícone do lead (cartões "você" e fecho da reputação) */
export const leadIcon = (size?: number, color?: string) => icon((LEAD.tema.icone ?? 'shield') as IconName, size, color);

export const FRAME = {W, H};
