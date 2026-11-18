import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon, icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, Bullet, Card, Counter, FormatTile, IconRow, MonoTag, Pill, Stamp} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Selo} from './_comum';

// ---------- escritorios ----------
export type EscritoriosP = {
  id: 'escritorios';
  em: Q;
  titulo?: string;
  itens: {cidade: string; nota: string; em: Q; destaque?: boolean}[];
  selos?: {icone: IconName; texto: string; em: Q}[];
};
export const Escritorios: ModView<EscritoriosP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 440,
          saida: 'up',
          c: (
            <>
              <MonoTag start={q(p.em)} color={C.support}>
                {p.titulo ?? 'escritórios, segundo o site'}
              </MonoTag>
              <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22}}>
                {p.itens.map((o) => (
                  <Office key={o.cidade} start={q(o.em)} cidade={o.cidade} nota={o.nota} hi={!!o.destaque} />
                ))}
              </div>
              {p.selos ? (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginTop: 34}}>
                  {p.selos.map((s) => (
                    <Pill key={s.texto} start={q(s.em)} color={C.accent} style={{fontSize: 34}}>
                      {icon(s.icone, 34)} {s.texto}
                    </Pill>
                  ))}
                </div>
              ) : null}
            </>
          ),
        },
      ]}
    />
  );
};
const Office: React.FC<{start: number; cidade: string; nota: string; hi: boolean}> = ({start, cidade, nota, hi}) => (
  <div style={{...useEnter(start, 26, 0.45), display: 'flex', alignItems: 'center', gap: 24, padding: '22px 28px', borderRadius: 12, background: hi ? C.cardHi : C.card, border: `1.5px solid ${hi ? acc(0.7) : C.lineSoft}`}}>
    {Icon.pin(54, hi ? C.accent : C.accentMid)}
    <div style={{flex: 1}}>
      <div style={{fontFamily: sans, fontWeight: 600, fontSize: 46, color: C.ink}}>{cidade}</div>
      <div style={{fontFamily: sans, fontSize: 32, color: C.support}}>{nota}</div>
    </div>
  </div>
);
