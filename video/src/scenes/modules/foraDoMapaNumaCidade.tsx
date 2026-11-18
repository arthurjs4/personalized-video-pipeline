import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Line, Panel, prog, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, AdRow, Bullet, Card, Dashed, FimDaTela, FlowSteps, MapStrip, MiniMap, MonoTag, PhoneFrame, PhoneMap, Pill, PlaceRow, QueryTitle, RouteMap, RowTitle, ScrollPage, SearchBar, Stamp, typed} from '../../parts';
import {FraseBody} from './frase';
import type {FraseP, Linha} from './frase';
import type {ModView} from '../../core/tipos';
import {Lines, PillX} from './_comum';
import type {Lugar, PillSpec, Selo} from './_comum';

// ---------- foraDoMapaNumaCidade ----------
/** Aparece bem na cidade principal e fica fora do mapa em outra (busca da categoria na cidade 2). */
export type ForaDoMapaNumaCidadeP = {
  id: 'foraDoMapaNumaCidade';
  em: Q;
  busca: string;
  pill?: {texto: string; em: Q};
  tracejado: {texto: string; em: Q};
  lista?: {titulo: string; em: Q; lugares: Lugar[]};
};
export const ForaDoMapaNumaCidade: ModView<ForaDoMapaNumaCidadeP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 420,
          c: (
            <>
              <SearchBar text={typed(p.busca, t, q(p.em), 30)} focus={1} size={34} caret={t < q(p.tracejado.em)} />
              {p.pill ? (
                <div style={{marginTop: 22}}>
                  <Pill start={q(p.pill.em)} color={C.accent} style={{fontSize: 32}}>
                    {p.pill.texto}
                  </Pill>
                </div>
              ) : null}
              <div style={{marginTop: 26}}>
                <Dashed start={q(p.tracejado.em)} text={p.tracejado.texto} size={38} />
              </div>
              {p.lista ? (
                <>
                  <RowTitle start={q(p.lista.em)} text={p.lista.titulo} style={{marginTop: 34}} />
                  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                    {p.lista.lugares.map((l, i) => (
                      <PlaceRow key={l.nome} start={q(p.lista!.em) + 0.1 + i * 0.15} name={l.nome} rating={l.nota} reviews={l.avaliacoes} size={32} />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          ),
        },
      ]}
    />
  );
};
