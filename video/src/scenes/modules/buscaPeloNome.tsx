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

// ---------- buscaPeloNome ----------
/** Como o lead aparece quando procuram o nome; opcionalmente uma 2ª busca (categoria + cidade) com a posição no mapa. */
export type BuscaPeloNomeP = {
  id: 'buscaPeloNome';
  em: Q;
  top?: number;
  busca: string;
  buscaSize?: number;
  /** resultado do lead aparece (e o cursor de digitação some) */
  resultadoEm: Q;
  rotulo: string;
  resultado: {dominio: string; titulo: string; tag?: string};
  pills: PillSpec[];
  linhas?: Linha[];
  segunda?: {busca: string; em: Q; resultadoEm: Q; rotulo: string; lugar: Lugar; pills: PillSpec[]};
};
export const BuscaPeloNome: ModView<BuscaPeloNomeP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const r = q(p.resultadoEm);
  const sg = p.segunda;
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: p.top ?? 400,
          saida: 'up',
          c: (
            <>
              <SearchBar text={typed(p.busca, t, q(p.em), 22)} focus={1} size={p.buscaSize ?? 36} caret={t < r} />
              <RowTitle start={r - 0.2} text={p.rotulo} style={{marginTop: 26}} />
              <AdRow start={r} tag={p.resultado.tag} domain={p.resultado.dominio} title={p.resultado.titulo} you />
              <div style={{display: 'flex', gap: 16, marginTop: 18}}>
                {p.pills.map((x) => (
                  <PillX key={x.texto} p={x} />
                ))}
              </div>
              {p.linhas ? <Lines linhas={p.linhas} em={p.em} /> : null}
              {sg ? (
                <>
                  <div style={{marginTop: 54}}>
                    <SearchBar text={typed(sg.busca, t, q(sg.em), 30)} focus={1} size={34} caret={t < q(sg.resultadoEm)} />
                  </div>
                  <RowTitle start={q(sg.resultadoEm) - 0.2} text={sg.rotulo} style={{marginTop: 26}} />
                  <PlaceRow start={q(sg.resultadoEm)} n={sg.lugar.n} name={sg.lugar.nome} rating={sg.lugar.nota} reviews={sg.lugar.avaliacoes} you size={34} />
                  <div style={{display: 'flex', gap: 16, marginTop: 18}}>
                    {sg.pills.map((x) => (
                      <PillX key={x.texto} p={x} />
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
