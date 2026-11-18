import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import mouth from '../data/mouth.json';
import {acc, C, mono, sans} from '../core/theme';
import {backOut, clamp01, prog, SCENES, useEnter, useT} from '../core/lib';
import {Icon, leadIcon} from '../core/common';

/** janela de cada cena: entra 0,55 s antes da fala e sai de 0,4 s antes do fim até 0,55 s depois */
export const SceneWrap: React.FC<{i: number; children: React.ReactNode}> = ({i, children}) => {
  const t = useT();
  const s = SCENES[i];
  const last = i === SCENES.length - 1;
  if (t < s.start - 0.55 || (!last && t > s.end + 0.6)) return null;
  const e = last ? 0 : prog(t, s.end - 0.4, 0.95, Easing.bezier(0.4, 0, 1, 1));
  return (
    <AbsoluteFill style={{opacity: 1 - e, filter: `blur(${e * 18}px)`, transform: `scale(${1 - 0.05 * e})`}}>
      {children}
    </AbsoluteFill>
  );
};

/** texto digitado letra por letra */
export const typed = (full: string, t: number, start: number, cps = 24) => {
  if (t < start) return '';
  return full.slice(0, Math.floor((t - start) * cps));
};

export const SearchBar: React.FC<{text: string; focus?: number; caret?: boolean; size?: number; style?: React.CSSProperties}> = ({
  text,
  focus = 0,
  caret = true,
  size = 40,
  style,
}) => {
  const t = useT();
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        height: size * 2.4,
        padding: `0 ${size * 0.6}px`,
        borderRadius: size * 1.2,
        background: 'rgba(255,255,255,0.06)',
        border: `2px solid ${focus > 0 ? acc(0.25 + 0.6 * focus) : 'rgba(255,255,255,0.12)'}`,
        ...style,
      }}
    >
      {Icon.search(size * 1.05, C.support)}
      <span style={{fontFamily: sans, fontSize: size, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', flex: 1}}>
        {text}
        {caret ? <span style={{opacity: blink ? 1 : 0, color: C.accent}}>|</span> : null}
      </span>
    </div>
  );
};

export const Stamp: React.FC<{start: number; text: string; hi?: number; style?: React.CSSProperties}> = ({start, text, hi = 0, style}) => {
  const st = useEnter(start, 16, 0.5);
  return (
    <div style={{...st, display: 'inline-flex', alignItems: 'center', padding: '10px 18px', borderRadius: 6, border: `1.5px solid ${acc(0.28 + hi * 0.6)}`, background: acc(0.06 + hi * 0.12), ...style}}>
      <span style={{width: 12, height: 12, borderRadius: 99, background: C.accent, marginRight: 14}} />
      <span style={{fontFamily: mono, fontSize: 30, color: hi > 0.5 ? C.accent : C.support}}>{text}</span>
    </div>
  );
};

export const Card: React.FC<{start: number; dim?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number; hi?: boolean}> = ({
  start,
  dim = 0,
  children,
  style,
  dist = 50,
  hi = false,
}) => {
  const st = useEnter(start, dist, 0.6);
  return (
    <div
      style={{
        ...st,
        opacity: (st.opacity as number) * (1 - 0.6 * dim),
        background: hi ? C.cardHi : C.card,
        border: `1.5px solid ${hi ? acc(0.6) : C.line}`,
        borderRadius: 10,
        padding: '28px 34px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{start: number; color?: string; fill?: boolean; children: React.ReactNode; style?: React.CSSProperties}> = ({
  start,
  color = C.accent,
  fill = false,
  children,
  style,
}) => {
  const t = useT();
  const p = prog(t, start, 0.5, Easing.bezier(0.34, 1.6, 0.64, 1));
  const o = prog(t, start, 0.25);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        opacity: o,
        transform: `scale(${0.6 + 0.4 * p})`,
        padding: '10px 22px',
        borderRadius: 99,
        background: fill ? color : 'transparent',
        border: `2px solid ${color}`,
        color: fill ? C.onAccent : color,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 34,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export const Dashed: React.FC<{start: number; text: string; size?: number; color?: string; style?: React.CSSProperties}> = ({start, text, size = 36, color = C.accent, style}) => {
  const t = useT();
  const st = useEnter(start, 20, 0.5);
  const dashOffset = -(t * 30) % 40;
  return (
    <div style={{...st, position: 'relative', padding: '18px 26px', ...style}}>
      <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="9" fill={acc(0.05)} stroke={color} strokeWidth="2.5" strokeDasharray="14 10" strokeDashoffset={dashOffset} />
      </svg>
      <span style={{position: 'relative', fontFamily: sans, fontWeight: 500, fontSize: size, color}}>{text}</span>
    </div>
  );
};

export const MonoTag: React.FC<{start: number; children: React.ReactNode; style?: React.CSSProperties; color?: string}> = ({start, children, style, color = C.accent}) => {
  const st = useEnter(start, 14, 0.45);
  return <div style={{...st, fontFamily: mono, fontSize: 30, color, ...style}}>{children}</div>;
};

/** número que conta até o valor final */
export const Counter: React.FC<{from?: number; to: number; start: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; style?: React.CSSProperties}> = ({
  from = 0,
  to,
  start,
  dur = 0.9,
  decimals = 0,
  prefix = '',
  suffix = '',
  style,
}) => {
  const t = useT();
  const p = prog(t, start, dur, Easing.bezier(0.16, 1, 0.3, 1));
  const v = from + (to - from) * p;
  return <span style={style}>{prefix + v.toFixed(decimals).replace('.', ',') + suffix}</span>;
};

/** resultado patrocinado estilizado (sem copiar a interface do Google) */
export const AdRow: React.FC<{start: number; domain: string; title: string; you?: boolean; dim?: number; tag?: string}> = ({start, domain, title, you = false, dim = 0, tag = 'patrocinado'}) => {
  const st = useEnter(start, 34, 0.5);
  return (
    <div
      style={{
        ...st,
        opacity: (st.opacity as number) * (1 - 0.55 * dim),
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '18px 24px',
        borderRadius: 10,
        background: you ? C.cardHi : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${you ? acc(0.75) : C.lineSoft}`,
      }}
    >
      <div style={{width: 52, height: 52, borderRadius: 99, background: you ? C.accent : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        {you ? leadIcon(28, C.onAccent) : <span style={{fontFamily: sans, fontWeight: 600, fontSize: 30, color: C.support}}>{domain[0].toUpperCase()}</span>}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontFamily: mono, fontSize: 30, color: C.dim, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <span style={{color: you ? C.accent : C.support, fontWeight: 500}}>{tag}</span> · {domain}
        </div>
        <div style={{fontFamily: sans, fontWeight: 500, fontSize: 33, color: you ? C.ink : C.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2}}>{title}</div>
      </div>
    </div>
  );
};

/** linha de empresa no mapa */
export const PlaceRow: React.FC<{start: number; n?: string; name: string; rating: string; reviews: string; sponsored?: boolean; you?: boolean; dim?: number; size?: number}> = ({
  start,
  n,
  name,
  rating,
  reviews,
  sponsored = false,
  you = false,
  dim = 0,
  size = 34,
}) => {
  const st = useEnter(start, 30, 0.5);
  return (
    <div
      style={{
        ...st,
        opacity: (st.opacity as number) * (1 - 0.6 * dim),
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '16px 20px',
        borderRadius: 10,
        background: you ? C.cardHi : sponsored ? `rgba(${C.redRgb},0.08)` : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${you ? acc(0.75) : sponsored ? `rgba(${C.redRgb},0.45)` : C.lineSoft}`,
      }}
    >
      {n ? <div style={{fontFamily: mono, fontSize: size * 0.8, color: you ? C.accent : C.dim, width: size * 1.3}}>{n}</div> : null}
      <div style={{flex: 1, minWidth: 0}}>
        {sponsored ? <div style={{fontFamily: mono, fontSize: 30, color: C.red, marginBottom: 2}}>anúncio pago</div> : null}
        <div style={{fontFamily: sans, fontWeight: 600, fontSize: size, color: you ? C.ink : C.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{name}</div>
        <div style={{fontFamily: sans, fontSize: size * 0.78, color: C.support, marginTop: 2}}>
          <span style={{color: C.accent}}>{rating} ★</span> · {reviews} avaliações
        </div>
      </div>
      {Icon.pin(size * 1.1, you ? C.accent : C.dim)}
    </div>
  );
};

/**
 * Avatar da Agência (os dois círculos do logo com rosto), boca pela voz. O narrador não usa foto: a
 * etiqueta mostra `nome` (padrão "Ana").
 */
export const Avatar: React.FC<{x: number; y: number; size?: number; start: number; tag?: boolean; nome?: string; papel?: string}> = ({x, y, size = 200, start, tag = true, nome = 'Ana', papel = 'Agência Exemplo'}) => {
  const t = useT();
  const pop = prog(t, start, 0.7, backOut);
  const cyc = (t + 1.3) % 4.6;
  const blink = cyc < 0.14 ? Math.max(0.12, Math.abs(cyc - 0.07) / 0.07) : 1;
  const bob = Math.sin(t * 3.2) * 5;
  const wave = Math.sin(t * 6) * 8 * prog(t, start + 0.3, 0.4);
  const r = size / 2;
  const v = mouth as number[];
  const o = Math.min(1, v[Math.round(t * 30)] ?? 0);
  const mL = r * (0.74 + o * 0.05);
  const mR = r * (1.2 - o * 0.05);
  const mY = r * 1.21;
  const id = `yu${size}${Math.round(x)}`;
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: size * 1.7, height: size * 1.5, transform: `scale(${pop}) translateY(${bob}px)`, transformOrigin: `${r}px ${r}px`, opacity: clamp01(pop * 1.4)}}>
      <svg width={size * 1.6} height={size} viewBox={`0 0 ${size * 1.6} ${size}`} style={{overflow: 'visible'}}>
        <defs>
          <clipPath id={`${id}b`}>
            <circle cx={r} cy={r} r={r} />
          </clipPath>
        </defs>
        <circle cx={r} cy={r} r={r} fill={C.steel} />
        <circle cx={r * 2 + r * 0.05} cy={r - wave} r={r * 0.62} fill={C.steel} />
        <circle cx={r * 2 + r * 0.05} cy={r - wave} r={r * 0.62} fill={C.copperLight} clipPath={`url(#${id}b)`} />
        <ellipse cx={r * 0.72} cy={r * 0.86} rx={r * 0.11} ry={r * 0.16 * blink} fill={C.bg} />
        <ellipse cx={r * 1.22} cy={r * 0.86} rx={r * 0.11} ry={r * 0.16 * blink} fill={C.bg} />
        {blink > 0.5 ? (
          <>
            <circle cx={r * 0.75} cy={r * 0.8} r={r * 0.035} fill="#fff" />
            <circle cx={r * 1.25} cy={r * 0.8} r={r * 0.035} fill="#fff" />
          </>
        ) : null}
        {o < 0.06 ? (
          <path d={`M ${r * 0.72} ${r * 1.22} Q ${r * 0.97} ${r * 1.27} ${r * 1.22} ${r * 1.22}`} stroke={C.bg} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />
        ) : (
          <path
            d={`M ${mL} ${mY} Q ${r * 0.97} ${mY + r * 0.06} ${mR} ${mY} Q ${r * 0.97} ${mY + r * 0.08 + o * r * 0.3} ${mL} ${mY} Z`}
            fill={C.bg}
            stroke={C.bg}
            strokeWidth={r * 0.06}
            strokeLinejoin="round"
          />
        )}
      </svg>
      {tag ? (
        <div style={{...useEnter(start + 0.35, 16, 0.45), position: 'absolute', top: size * 1.1, left: 0, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 12, background: 'rgba(22,22,24,0.9)', border: `1px solid ${C.lineSoft}`, borderTop: `2px solid ${C.copperLight}`, whiteSpace: 'nowrap'}}>
          <span style={{fontFamily: sans, fontWeight: 600, fontSize: 36, color: C.ink}}>{nome}</span>
          <span style={{fontFamily: mono, fontSize: 30, color: C.steel}}>{papel}</span>
        </div>
      ) : null}
    </div>
  );
};

/** cartão grande com borda na cor de destaque que endireita devagar (estilo dos cartões do site) */
export const AccentPanel: React.FC<{start: number; style?: React.CSSProperties; children: React.ReactNode}> = ({start, style, children}) => {
  const t = useT();
  const p = prog(t, start, 0.8, backOut);
  const settle = prog(t, start, 4, Easing.bezier(0.22, 1, 0.36, 1));
  const o = prog(t, start, 0.45);
  return (
    <div
      style={{
        opacity: o,
        transform: `perspective(1900px) translateY(${(1 - p) * 110}px) rotateX(${(1 - settle) * 12 + 2}deg) rotateY(${-(1 - settle) * 7 - 1.5}deg)`,
        transformOrigin: '50% 0%',
        filter: `blur(${(1 - o) * 10}px)`,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))',
        border: `1.5px solid ${C.line}`,
        borderRadius: 14,
        boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const RowTitle: React.FC<{start: number; text: string; style?: React.CSSProperties}> = ({start, text, style}) => {
  const st = useEnter(start, 12, 0.4);
  return <div style={{...st, fontFamily: mono, fontSize: 30, color: C.dim, marginBottom: 12, letterSpacing: '0.02em', ...style}}>{text}</div>;
};

/** nome antigo do AccentPanel (mantido para não quebrar código copiado dos vídeos antigos) */
export const GoldPanel = AccentPanel;
