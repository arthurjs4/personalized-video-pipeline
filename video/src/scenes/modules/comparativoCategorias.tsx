import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Q} from '../../core/lib';
import {leadIcon, Icon} from '../../core/common';
import {Bullet, Dashed} from '../../parts';
import type {ModView} from '../../core/tipos';

// ---------- comparativoCategorias (v3, 14/11/2026) ----------
/**
 * Categorias do perfil no Google: o lead e os 3 do mapa da busca principal (dado do Maps, com data).
 * A 1ª categoria de cada um é a principal. As categorias que os outros têm e o lead não acendem
 * quando a voz fala delas ("o Google não sabe que vocês fazem isso").
 */
export type PerfilCat = {nome: string; categorias: string[]};
export type ComparativoCategoriasP = {
  id: 'comparativoCategorias';
  em: Q;
  /** busca de onde vêm os 3 do mapa */
  busca: string;
  lead: PerfilCat;
  /** os 3 do mapa, na ordem do print */
  outros: PerfilCat[];
  /** categorias que os outros têm e o lead não (texto igual ao de `outros`) */
  faltam: string[];
  outrosEm: Q;
  faltaEm: Q;
  /** texto do tracejado no cartão do lead ("o Google não sabe que vocês fazem isso") */
  tracejado?: {texto: string; em: Q};
  /** "Google Maps · 14/11/2026" */
  fonte: string;
};

const MAX = 4;

export const ComparativoCategorias: ModView<ComparativoCategoriasP> = ({p, ate}) => {
  const q = useQ();
  const t = useT();
  const fa = q(p.faltaEm);
  const acende = t >= fa;
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 320,
          c: (
            <>
              <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>
                <Bullet />
                categorias no Google · {p.busca}
              </div>
              <Cartao start={q(p.em)} perfil={p.lead} destaque faltam={[]} acende={false} />
              {p.tracejado ? (
                <div style={{marginTop: 14}}>
                  <Dashed start={q(p.tracejado.em)} text={p.tracejado.texto} size={34} />
                </div>
              ) : null}
              <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26}}>
                {p.outros.slice(0, 3).map((o, i) => (
                  <Cartao key={o.nome} start={q(p.outrosEm) + i * 0.25} perfil={o} faltam={p.faltam} acende={acende} />
                ))}
              </div>
              <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 18}}>{p.fonte}</div>
            </>
          ),
        },
      ]}
    />
  );
};

const Cartao: React.FC<{start: number; perfil: PerfilCat; destaque?: boolean; faltam: string[]; acende: boolean}> = ({start, perfil, destaque, faltam, acende}) => {
  const st = useEnter(start, 26, 0.45);
  const cats = perfil.categorias.slice(0, MAX);
  const resto = perfil.categorias.length - cats.length;
  return (
    <div style={{...st, marginTop: destaque ? 18 : 0, padding: destaque ? '26px 28px' : '18px 24px', borderRadius: 16, background: destaque ? C.cardHi : C.card, border: `1.5px solid ${destaque ? acc(0.6) : C.lineSoft}`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        {destaque ? leadIcon(40, C.accent) : Icon.pin(34, C.support)}
        <span style={{fontFamily: sans, fontWeight: 600, fontSize: destaque ? 44 : 36, color: C.ink}}>{perfil.nome}</span>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12}}>
        {cats.map((c, i) => {
          const hi = acende && faltam.includes(c);
          return (
            <span key={c} style={{fontFamily: sans, fontSize: 30, fontWeight: i === 0 ? 600 : 400, padding: '6px 16px', borderRadius: 99, color: hi ? C.onAccent : i === 0 ? C.ink : C.ink2, background: hi ? C.accent : 'rgba(255,255,255,0.06)', border: `1.5px solid ${hi ? C.accent : i === 0 ? acc(0.5) : C.lineSoft}`}}>
              {c}
            </span>
          );
        })}
        {resto > 0 ? <span style={{fontFamily: mono, fontSize: 30, color: C.dim, padding: '6px 6px'}}>+{resto}</span> : null}
      </div>
    </div>
  );
};
