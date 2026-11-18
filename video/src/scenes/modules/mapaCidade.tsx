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

// ---------- mapaCidade ----------
/** Mapa de uma cidade no celular: quem aparece, "fim da tela" e a lista completa (com o lead ou sem ele). */
export type MapaCidadeP = {
  id: 'mapaCidade';
  em: Q;
  cabecalho: [string, string];
  busca: string;
  buscaEm: Q;
  caretAteEm: Q;
  mapaEm: Q;
  mapaAltura?: number;
  /** quando há anúncio dentro do mapa: o 1º pino fica vermelho e a 1ª linha ganha contorno */
  anuncioNoMapaEm?: Q;
  lugares: (Lugar & {patrocinado?: boolean})[];
  lugaresEm: Q;
  lugarSize?: number;
  pill?: {texto: string; em: Q};
  fimEm: Q;
  lista?: {
    titulo: string;
    em: Q;
    /** lista de linhas com posição (lead aparece em Nº) */
    linhas?: (Lugar & {voce?: boolean; apagado?: boolean; em?: Q})[];
    /** ou resumo por página (lead não aparece) */
    paginas?: {rotulo: string; nomes: string}[];
  };
  tracejado?: {texto: string; em: Q};
};
export const MapaCidade: ModView<MapaCidadeP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const hiAd = p.anuncioNoMapaEm !== undefined ? prog(t, q(p.anuncioNoMapaEm), 0.3) : 0;
  const L = p.lista;
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 300,
          saida: 'zoom',
          c: (
            <>
              <PhoneFrame start={q(p.em)} cabecalho={p.cabecalho}>
                <SearchBar text={typed(p.busca, t, q(p.buscaEm), 28)} focus={1} size={32} caret={t < q(p.caretAteEm)} />
                <div style={{marginTop: 14}}>
                  <MapStrip start={q(p.mapaEm)} h={p.mapaAltura ?? 100} hiFirst={hiAd} firstSpecial={p.anuncioNoMapaEm !== undefined} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14}}>
                  {p.lugares.map((l, i) => (
                    <div key={l.nome} style={i === 0 && p.anuncioNoMapaEm !== undefined ? {borderRadius: 12, boxShadow: `0 0 0 ${4 * hiAd}px rgba(${C.redRgb},${0.35 * hiAd})`} : undefined}>
                      <PlaceRow start={q(p.lugaresEm) + i * 0.18} name={l.nome} rating={l.nota} reviews={l.avaliacoes} sponsored={l.patrocinado} size={p.lugarSize ?? 30} />
                    </div>
                  ))}
                </div>
                {p.pill ? (
                  <div style={{marginTop: 16}}>
                    <Pill start={q(p.pill.em)} color={C.accent} style={{fontSize: 30}}>
                      {p.pill.texto}
                    </Pill>
                  </div>
                ) : null}
              </PhoneFrame>
              <FimDaTela start={q(p.fimEm)} />
              {L ? <RowTitle start={q(L.em) - (L.paginas ? 0.2 : 0)} text={L.titulo} style={{marginTop: 4}} /> : null}
              {L?.linhas ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                  {L.linhas.map((l, i) => (
                    <PlaceRow key={l.nome} start={l.em !== undefined ? q(l.em) : q(L.em) + 0.1 + i * 0.15} n={l.n} name={l.nome} rating={l.nota} reviews={l.avaliacoes} you={l.voce} dim={l.apagado ? 0.5 : 0} size={l.voce ? 33 : 31} />
                  ))}
                </div>
              ) : null}
              {L?.paginas ? (
                <div style={{display: 'flex', gap: 10}}>
                  {L.paginas.map((g, i) => (
                    <Pagina key={g.rotulo} start={q(L.em) + i * 0.15} rotulo={g.rotulo} nomes={g.nomes} />
                  ))}
                </div>
              ) : null}
              {p.tracejado ? (
                <div style={{marginTop: 14}}>
                  <Dashed start={q(p.tracejado.em)} text={p.tracejado.texto} size={34} color={C.accent} />
                </div>
              ) : null}
            </>
          ),
        },
      ]}
    />
  );
};
const Pagina: React.FC<{start: number; rotulo: string; nomes: string}> = ({start, rotulo, nomes}) => (
  <div style={{...useEnter(start, 20, 0.4), flex: 1, padding: '14px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${C.lineSoft}`}}>
    <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>{rotulo}</div>
    <div style={{fontFamily: sans, fontSize: 30, color: C.dim, lineHeight: 1.15, marginTop: 4}}>{nomes.split(', ').slice(0, 2).join(', ')}...</div>
  </div>
);
