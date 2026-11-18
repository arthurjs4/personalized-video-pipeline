import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Line, Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon} from '../../core/common';
import type {ModView} from '../../core/tipos';

// ---------- conviteLeve (v3, 14/11/2026) ----------
/**
 * Convite leve perto de 2:00 (entre 1:45 e 2:15), sem pressão: um balão de conversa com a pergunta
 * fácil e uma linha de apoio. O convite firme (2 horários) fica para a cena 10.
 */
export type ConviteLeveP = {
  id: 'conviteLeve';
  em: Q;
  /** texto do balão ("Quer ver o mapa completo?") */
  pergunta: string;
  /** linha de apoio ("15 minutos com a Ana, sem compromisso") */
  apoio?: string;
  apoioEm?: Q;
  /** frase grande depois do balão ("Mas antes, a boa notícia.") */
  depois?: {em: Q; texto: string};
  top?: number;
};

export const ConviteLeve: ModView<ConviteLeveP> = ({p, ate}) => {
  const q = useQ();
  const bal = useEnter(q(p.em) - 0.05, 30, 0.5);
  const ap = useEnter(q(p.apoioEm ?? p.em) + 0.1, 14, 0.4);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: p.top ?? 520,
          c: (
            <>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, ...bal}}>
                {Icon.chat(40, C.wa)}
                <span style={{fontFamily: mono, fontSize: 30, color: C.support}}>se fizer sentido</span>
              </div>
              <div style={{...bal, marginTop: 20, padding: '40px 44px', borderRadius: '28px 28px 28px 6px', background: C.cardHi, border: `1.5px solid ${acc(0.6)}`}}>
                <div style={{fontFamily: sans, fontWeight: 600, fontSize: 64, color: C.ink, lineHeight: 1.12}}>{p.pergunta}</div>
                {p.apoio ? <div style={{...ap, fontFamily: sans, fontSize: 40, color: C.support, marginTop: 18, lineHeight: 1.2}}>{p.apoio}</div> : null}
              </div>
              {p.depois ? <Line start={q(p.depois.em)} parts={[[p.depois.texto, 'w']]} size={60} style={{marginTop: 70}} /> : null}
            </>
          ),
        },
      ]}
    />
  );
};
