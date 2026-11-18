import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Line, Telas, useEnter, useQ} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, Bullet} from '../../parts';
import type {ModView} from '../../core/tipos';

// ---------- heatmapGrade (v3, 14/11/2026) ----------
/**
 * Grade de posição no mapa para a busca que OSCILOU entre as 2 rodadas (ela não some, vira grade):
 * mini grade de 5 pontos (centro, norte, sul, leste, oeste; feita na prévia do Google Ads) ou grade
 * de 25 pontos (5 x 5; Local Falcon ou Semrush Local). Cada ponto mostra a posição do lead; `null`
 * = fora dos 20 primeiros. Grade só depois do "sim". Dado de teste: `exemplo: true` (selo na tela).
 */
export type HeatmapGradeP = {
  id: 'heatmapGrade';
  em: Q;
  busca: string;
  /** cidade do centro da grade */
  cidade: string;
  /** 5 valores (centro, norte, sul, leste, oeste) ou 25 (linha por linha, de cima para baixo) */
  pontos: (number | null)[];
  /** "prévia do Google Ads · 5 pontos · 15/11/2026" / "Local Falcon · 25 pontos · 15/11/2026" */
  fonte: string;
  /** quando os pontos acendem (do centro para fora) */
  gradeEm?: Q;
  /** frase de resumo ("1ª em 3 de 25 pontos") */
  resumo?: {em: Q; t: Part[]};
  exemplo?: boolean;
};

const cor = (v: number | null) => (v === null ? C.dim : v <= 3 ? C.ok : v <= 10 ? C.accent : C.red);

export const HeatmapGrade: ModView<HeatmapGradeP> = ({p, ate}) => {
  const q = useQ();
  const g = q(p.gradeEm ?? p.em);
  const mini = p.pontos.length <= 5;
  // posições na grade: mini = cruz numa 3 x 3; 25 = 5 x 5
  const n = mini ? 3 : 5;
  const cel = mini ? 190 : 120;
  const gap = mini ? 26 : 14;
  const lugares: [number, number, string?][] = mini
    ? [
        [1, 1, 'centro'],
        [1, 0, 'norte'],
        [1, 2, 'sul'],
        [2, 1, 'leste'],
        [0, 1, 'oeste'],
      ]
    : Array.from({length: 25}, (_, i) => [i % 5, Math.floor(i / 5)]);
  const centro = (n - 1) / 2;
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 330,
          c: (
            <AccentPanel start={q(p.em)} style={{padding: '34px 36px 38px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>
                  <Bullet />
                  posição no mapa · {p.cidade}
                </div>
                {p.exemplo ? <span style={{fontFamily: mono, fontSize: 30, color: C.onAccent, background: C.accent, padding: '4px 14px', borderRadius: 8}}>exemplo</span> : null}
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}>
                {Icon.search(40, C.accent)}
                <span style={{fontFamily: sans, fontWeight: 600, fontSize: 44, color: C.ink}}>{p.busca}</span>
              </div>
              <div style={{position: 'relative', margin: '34px auto 0', width: n * cel + (n - 1) * gap, height: n * cel + (n - 1) * gap}}>
                {p.pontos.map((v, i) => {
                  const [x, y, rot] = lugares[i] ?? [0, 0];
                  const dist = Math.hypot(x - centro, y - centro);
                  return <Ponto key={i} v={v} x={x * (cel + gap)} y={y * (cel + gap)} cel={cel} start={g + dist * 0.18} rotulo={rot} />;
                })}
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 30, justifyContent: 'center'}}>
                {(
                  [
                    ['1 a 3', C.ok],
                    ['4 a 10', C.accent],
                    ['11 a 20', C.red],
                    ['fora', C.dim],
                  ] as [string, string][]
                ).map(([t, c]) => (
                  <span key={t} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 30, color: C.support}}>
                    <span style={{width: 24, height: 24, borderRadius: 99, background: c}} />
                    {t}
                  </span>
                ))}
              </div>
              <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 18, textAlign: 'center'}}>{p.fonte}</div>
              {p.resumo ? <Line start={q(p.resumo.em)} parts={p.resumo.t} size={46} keySize={56} style={{marginTop: 20}} /> : null}
            </AccentPanel>
          ),
        },
      ]}
    />
  );
};

const Ponto: React.FC<{v: number | null; x: number; y: number; cel: number; start: number; rotulo?: string}> = ({v, x, y, cel, start, rotulo}) => {
  const st = useEnter(start, 0, 0.35);
  const c = cor(v);
  return (
    <div style={{...st, position: 'absolute', left: x, top: y, width: cel, height: cel, borderRadius: 99, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: v === null ? 'rgba(255,255,255,0.05)' : `${c}2E`, border: `3px solid ${c}`}}>
      <span style={{fontFamily: sans, fontWeight: 700, fontSize: cel > 150 ? 64 : 46, color: v === null ? C.support : C.ink, lineHeight: 1}}>{v === null ? '20+' : `${v}º`}</span>
      {rotulo ? <span style={{fontFamily: mono, fontSize: 30, color: C.support, marginTop: 4}}>{rotulo}</span> : null}
    </div>
  );
};

