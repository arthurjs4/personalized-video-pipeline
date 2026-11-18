import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon, icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, Bullet, Card, Counter, FormatTile, IconRow, MonoTag, Pill, Stamp} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Selo} from './_comum';

// ---------- investimentoAtual ----------
/** Não anuncia, mas investe em site, posts, idiomas: lista de investimentos com ícone. */
export type InvestimentoAtualP = {
  id: 'investimentoAtual';
  em: Q;
  titulo?: string;
  itens: {icone: IconName; a: string; b: string; em: Q}[];
  fonte?: string;
};
export const InvestimentoAtual: ModView<InvestimentoAtualP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 480,
          saida: 'up',
          c: (
            <>
              <MonoTag start={q(p.em)} color={C.support} style={{marginBottom: 26}}>
                {p.titulo ?? 'o que vocês já investem'}
              </MonoTag>
              {p.itens.map((r) => (
                <IconRow key={r.a} start={q(r.em) - 0.05} icone={r.icone} a={r.a} b={r.b} />
              ))}
              {p.fonte ? (
                <MonoTag start={q(p.em) + 0.3} color={C.dim}>
                  {p.fonte}
                </MonoTag>
              ) : null}
            </>
          ),
        },
      ]}
    />
  );
};
