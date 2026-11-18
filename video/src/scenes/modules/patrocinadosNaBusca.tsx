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

// ---------- patrocinadosNaBusca ----------
/** Na busca do serviço aparecem N anúncios de outras empresas (mesmo resultado nas 2 rodadas). */
export type ItemBusca =
  | {tipo: 'anuncio'; dominio: string; titulo: string; em?: Q}
  | {tipo: 'lugar'; nome: string; nota: string; avaliacoes: string; patrocinado?: boolean; em?: Q};
export type PatrocinadosNaBuscaP = {
  id: 'patrocinadosNaBusca';
  em: Q;
  top?: number;
  busca: string;
  /** até quando o cursor de digitação pisca */
  caretAteEm: Q;
  /** rótulo mono à esquerda e contagem em vermelho à direita, logo abaixo da busca */
  rotulo?: string;
  contagem?: {texto: string; em: Q};
  /** pill na cor de destaque abaixo da busca (ex.: "o serviço mais elogiado de vocês") */
  pill?: {texto: string; em: Q};
  titulo?: {texto: string; em: Q};
  itens: ItemBusca[];
  /** começo dos itens quando eles não têm `em` próprio (um a cada 0,16 s) */
  itensEm?: Q;
  /** apaga os itens (foco no tracejado) */
  apagarEm?: Q;
  tracejado: {texto: string; em: Q; size?: number};
};
export const PatrocinadosNaBusca: ModView<PatrocinadosNaBuscaP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const dim = p.apagarEm !== undefined ? prog(t, q(p.apagarEm), 0.4) * 0.5 : 0;
  const head = useEnter(q(p.em) + 0.2, 14, 0.45);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: p.top ?? 420,
          saida: 'up',
          c: (
            <>
              <SearchBar text={typed(p.busca, t, q(p.em), 30)} focus={1} size={34} caret={t < q(p.caretAteEm)} />
              {p.rotulo || p.contagem ? (
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 22}}>
                  <div style={{...head, fontFamily: mono, fontSize: 30, color: C.support}}>{p.rotulo ?? ''}</div>
                  {p.contagem ? (
                    <Pill start={q(p.contagem.em)} color={C.red} style={{fontSize: 30}}>
                      {p.contagem.texto}
                    </Pill>
                  ) : null}
                </div>
              ) : null}
              {p.pill ? (
                <div style={{marginTop: 22}}>
                  <Pill start={q(p.pill.em)} color={C.accent} style={{fontSize: 30}}>
                    {p.pill.texto}
                  </Pill>
                </div>
              ) : null}
              {p.titulo ? <RowTitle start={q(p.titulo.em)} text={p.titulo.texto} style={{marginTop: 30}} /> : null}
              <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: p.titulo ? 0 : 20}}>
                {p.itens.map((it, i) => {
                  const st = it.em !== undefined ? q(it.em) : q(p.itensEm ?? p.em) + i * 0.16;
                  return it.tipo === 'anuncio' ? (
                    <AdRow key={i} start={st} domain={it.dominio} title={it.titulo} dim={dim} />
                  ) : (
                    <PlaceRow key={i} start={st} name={it.nome} rating={it.nota} reviews={it.avaliacoes} sponsored={it.patrocinado} size={30} dim={dim} />
                  );
                })}
              </div>
              <div style={{marginTop: 26}}>
                <Dashed start={q(p.tracejado.em)} text={p.tracejado.texto} size={p.tracejado.size ?? 38} />
              </div>
            </>
          ),
        },
      ]}
    />
  );
};
