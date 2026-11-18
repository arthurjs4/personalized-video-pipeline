import React from 'react';
import {C, CONTENT_W} from '../../core/theme';
import {easeOut, Line, prog, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q, Saida} from '../../core/lib';
import {icon, leadIcon} from '../../core/common';
import type {IconName} from '../../core/common';
import {Dashed} from '../../parts';
import type {ModView} from '../../core/tipos';

export type Linha = {em?: Q; t: Part[]; size?: number; keySize?: number; mt?: number};
/**
 * Frase de impacto em tipografia grande (palavra a palavra). Serve de abertura e fecho de qualquer cena.
 * Papéis das partes: 's' apoio, 'w' branco, 'k' chave grande, 'a' destaque na cor do lead, 'i' itálico serifado.
 */
export type FraseP = {
  id: 'frase';
  em: Q;
  top?: number;
  saida?: Saida;
  linhas: Linha[];
  /** ícone grande acima das linhas ('lead' = ícone do tema) */
  icone?: IconName | 'lead';
  iconeEm?: Q;
  /** barra que enche (ex.: "4 minutos") */
  barraEm?: Q;
  /** caixa tracejada abaixo das linhas (ex.: "Cidade Exemplo: sem perfil próprio no Google") */
  tracejado?: {texto: string; em: Q; size?: number; mt?: number};
};

export const FraseBody: React.FC<{p: Omit<FraseP, 'id'>}> = ({p}) => {
  const t = useT();
  const q = useQ();
  const iconSt = useEnter(q(p.iconeEm ?? p.em) - 0.1, 30, 0.7);
  const barSt = useEnter(p.barraEm !== undefined ? q(p.barraEm) + 0.1 : 0, 20, 0.5);
  return (
    <>
      {p.icone ? <div style={{...iconSt, marginBottom: 30}}>{p.icone === 'lead' ? leadIcon(110) : icon(p.icone, 110)}</div> : null}
      {p.linhas.map((l, i) => (
        <Line key={i} start={q(l.em ?? p.em)} parts={l.t} size={l.size ?? 64} keySize={l.keySize} style={l.mt ? {marginTop: l.mt} : undefined} />
      ))}
      {p.barraEm !== undefined ? (
        <div style={{...barSt, marginTop: 40, height: 6, width: CONTENT_W, background: 'rgba(255,255,255,0.08)', borderRadius: 4}}>
          <div style={{height: '100%', width: `${100 * prog(t, q(p.barraEm), 1.2, easeOut)}%`, background: C.accent, borderRadius: 4}} />
        </div>
      ) : null}
      {p.tracejado ? (
        <div style={{marginTop: p.tracejado.mt ?? 70}}>
          <Dashed start={q(p.tracejado.em)} text={p.tracejado.texto} size={p.tracejado.size ?? 42} />
        </div>
      ) : null}
    </>
  );
};

export const Frase: ModView<FraseP> = ({p, ate}) => <Telas ate={ate} telas={[{em: p.em, top: p.top ?? 600, saida: p.saida, c: <FraseBody p={p} />}]} />;
