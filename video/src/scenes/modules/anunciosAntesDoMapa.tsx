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

// ---------- anunciosAntesDoMapa ----------
/** No celular, os anúncios vêm antes do mapa, mesmo onde o lead é 1º no mapa. */
export type AnunciosAntesDoMapaP = {
  id: 'anunciosAntesDoMapa';
  em: Q;
  busca: string;
  caretAteEm: Q;
  pill?: {texto: string; em: Q};
  rotulo: {texto: string; em: Q};
  /** grupo: índice em `grupos` que acende o contorno vermelho deste anúncio */
  anuncios: {dominio: string; titulo: string; grupo?: number}[];
  grupos: {texto: string; em: Q}[];
  mapa: {rotulo: string; em: Q; lugar: Lugar};
};
export const AnunciosAntesDoMapa: ModView<AnunciosAntesDoMapaP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const tR = q(p.rotulo.em);
  const g = p.grupos.map((x) => q(x.em));
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 380,
          saida: 'up',
          c: (
            <>
              <SearchBar text={typed(p.busca, t, q(p.em), 28)} focus={1} size={34} caret={t < q(p.caretAteEm)} />
              {p.pill ? (
                <div style={{marginTop: 18}}>
                  <Pill start={q(p.pill.em)} color={C.accent} style={{fontSize: 30}}>
                    {p.pill.texto}
                  </Pill>
                </div>
              ) : null}
              <RowTitle start={tR - 0.2} text={p.rotulo.texto} style={{marginTop: 28, fontSize: 30}} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                {p.anuncios.map((a, i) => {
                  const k = a.grupo;
                  const hi = k === undefined ? 0 : prog(t, g[k], 0.3) * (k + 1 < g.length ? 1 - prog(t, g[k + 1], 0.3) : 1);
                  return (
                    <div key={a.dominio} style={{borderRadius: 12, boxShadow: `0 0 0 ${3 * hi}px rgba(${C.redRgb},${0.5 * hi})`}}>
                      <AdRow start={tR + i * 0.16} domain={a.dominio} title={a.titulo} />
                    </div>
                  );
                })}
              </div>
              <div style={{display: 'flex', gap: 14, marginTop: 18}}>
                {p.grupos.map((x, i) => (
                  <Pill key={x.texto} start={g[i]} color={C.red} style={{fontSize: 30}}>
                    {x.texto}
                  </Pill>
                ))}
              </div>
              <RowTitle start={q(p.mapa.em)} text={p.mapa.rotulo} style={{marginTop: 24, fontSize: 30}} />
              <PlaceRow start={q(p.mapa.em) + 0.1} n={p.mapa.lugar.n} name={p.mapa.lugar.nome} rating={p.mapa.lugar.nota} reviews={p.mapa.lugar.avaliacoes} you size={32} />
            </>
          ),
        },
      ]}
    />
  );
};
