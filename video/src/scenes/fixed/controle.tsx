import React from 'react';
import {acc, C, sans} from '../../core/theme';
import {Line, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {icon} from '../../core/common';
import type {IconName} from '../../core/common';
import type {ModView} from '../../core/tipos';

/** Cena fixa "com gente no controle": lista de garantias, cada item acende quando é falado. Texto quase igual em todo vídeo. */
export type ControleP = {
  id: 'controle';
  em?: Q;
  titulo?: Part[];
  itens?: {em: Q; icone: IconName; texto: string}[];
  /** onde toca o sino final (efeito sonoro) */
  fimEm?: Q;
};

export const Controle: ModView<ControleP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const itens = p.itens!;
  const st = itens.map((it) => q(it.em));
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em!,
          top: 360,
          c: (
            <>
              <Line start={q(p.em!)} parts={p.titulo!} size={56} keySize={72} />
              <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12}}>
                {itens.map((it, i) => {
                  const active = t >= st[i] && t < (st[i + 1] ?? 999);
                  return <Item key={it.texto} start={st[i]} active={active} icone={it.icone} texto={it.texto} />;
                })}
              </div>
            </>
          ),
        },
      ]}
    />
  );
};

const Item: React.FC<{start: number; active: boolean; icone: IconName; texto: string}> = ({start, active, icone, texto}) => (
  <div style={{...useEnter(start - 0.05, 26, 0.45), display: 'flex', alignItems: 'center', gap: 22, padding: '12px 22px', borderRadius: 12, background: active ? C.cardHi : C.card, border: `1.5px solid ${active ? acc(0.65) : C.lineSoft}`}}>
    <div style={{width: 66, height: 66, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${C.line}`, flexShrink: 0}}>{icon(icone, 52)}</div>
    <span style={{fontFamily: sans, fontWeight: active ? 600 : 500, fontSize: 34, color: active ? C.ink : C.ink2, lineHeight: 1.18}}>{texto}</span>
  </div>
);
