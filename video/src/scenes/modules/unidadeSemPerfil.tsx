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

// ---------- unidadeSemPerfil ----------
/**
 * Unidade sem perfil próprio no Google: a busca na cidade da unidade leva ao perfil da cidade principal,
 * e o mapa da categoria na cidade 2 não mostra o lead. Fecha com o mapa das duas unidades e a rota.
 */
export type UnidadeSemPerfilP = {
  id: 'unidadeSemPerfil';
  em: Q;
  provas: {
    selo: string;
    rotuloEndereco: string;
    perfil: {nome: string; detalhe: string; em: Q; pill: string; pillEm: Q};
    busca: {texto: string; em: Q};
    mapaEm: Q;
    tracejado: {texto: string; em: Q};
  };
  /** frase entre as provas e a rota (opcional) */
  meio?: Omit<FraseP, 'id'>;
  rota: {
    em: Q;
    rotaEm: Q;
    cardEm: Q;
    escritorioEm: Q;
    perdidoEm: Q;
    cidadeUnidade: string;
    cidadePerfil: string;
    escritorio: {titulo: string; texto: string};
    perdido?: string;
    tempo: string;
    unico?: string;
    linha?: Linha;
  };
};
export const UnidadeSemPerfil: ModView<UnidadeSemPerfilP> = ({p, ate}) => {
  const q = useQ();
  const v = p.provas;
  const r = p.rota;
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 330,
          saida: 'zoom',
          c: (
            <Panel start={q(p.em)} style={{padding: '40px 44px 46px'}}>
              <Stamp start={q(p.em) + 0.1} text={v.selo} />
              <div style={{marginTop: 34}}>
                <QueryTitle start={q(p.em) + 0.2} text={v.rotuloEndereco} />
                <Card start={q(v.perfil.em)} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 26px'}}>
                  <div>
                    <div style={{fontFamily: sans, fontWeight: 700, fontSize: 40, color: C.ink}}>{v.perfil.nome}</div>
                    <div style={{fontFamily: sans, fontSize: 32, color: C.support, marginTop: 4}}>{v.perfil.detalhe}</div>
                  </div>
                  <Pill start={q(v.perfil.pillEm)} color={C.accentLight} style={{fontSize: 30}}>
                    {v.perfil.pill}
                  </Pill>
                </Card>
              </div>
              <div style={{marginTop: 40}}>
                <QueryTitle start={q(v.busca.em)} text={v.busca.texto} />
                <MiniMap start={q(v.mapaEm)} />
                <div style={{marginTop: 18}}>
                  <Dashed start={q(v.tracejado.em)} text={v.tracejado.texto} size={36} />
                </div>
              </div>
            </Panel>
          ),
        },
        p.meio && {em: p.meio.em, top: p.meio.top ?? 540, saida: p.meio.saida, c: <FraseBody p={p.meio} />},
        {
          em: r.em,
          top: 330,
          c: (
            <>
              <RouteMap
                start={q(r.em) - 0.1}
                routeAt={q(r.rotaEm)}
                cardBAt={q(r.cardEm)}
                officeAt={q(r.escritorioEm)}
                lostAt={q(r.perdidoEm)}
                cidadeA={r.cidadeUnidade}
                cidadeB={r.cidadePerfil}
                escritorio={r.escritorio}
                perdido={r.perdido ?? 'quem procura no Google não chega aqui'}
                tempo={r.tempo}
                unico={r.unico ?? 'o único perfil no Google'}
              />
              {r.linha ? <Line start={q(r.linha.em ?? r.em)} parts={r.linha.t} size={r.linha.size ?? 52} keySize={r.linha.keySize} style={{marginTop: 10}} /> : null}
            </>
          ),
        },
      ]}
    />
  );
};
