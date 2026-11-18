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

// ---------- concorrenteNoNome ----------
/** Outra empresa anuncia na busca pelo nome do lead (+ fonte da política de marcas do Google Ads na tela). */
export type ConcorrenteNoNomeP = {
  id: 'concorrenteNoNome';
  em: Q;
  /** tela opcional antes: em quantas buscas o concorrente apareceu */
  presenca?: {titulo: Part[]; nome: string; nomeEm: Q; detalhe: string; listaEm: Q; buscas: {q: string; apareceu: boolean}[]; legenda: string};
  anuncio: {
    /** início da tela do anúncio (use quando houver `presenca`) */
    em?: Q;
    busca: string;
    buscaEm: Q;
    selo: {texto: string; em: Q};
    anunciosEm: Q;
    antesEm: Q;
    concorrente: {dominio: string; titulo: string};
    voce: {dominio: string; titulo: string};
    lugar?: Lugar;
    permiteEm: Q;
    permite?: string;
    fonte?: string;
  };
};
export const ConcorrenteNoNome: ModView<ConcorrenteNoNomeP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const pr = p.presenca;
  const a = p.anuncio;
  const tA = q(a.anunciosEm);
  const perm = useEnter(q(a.permiteEm), 20, 0.5);
  return (
    <Telas
      ate={ate}
      telas={[
        pr && {
          em: p.em,
          top: 360,
          saida: 'up',
          c: (
            <>
              <Line start={q(p.em)} parts={pr.titulo} size={58} />
              <Line start={q(pr.nomeEm)} parts={[[pr.nome, 'a']]} keySize={100} style={{marginTop: 12}} />
              <MonoTag start={q(pr.nomeEm) + 0.3} color={C.support} style={{marginTop: 8}}>
                {pr.detalhe}
              </MonoTag>
              <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 34}}>
                {pr.buscas.map((b, i) => (
                  <BuscaVista key={b.q} start={q(pr.listaEm) + i * 0.12} texto={b.q} sim={b.apareceu} />
                ))}
              </div>
              <MonoTag start={q(pr.nomeEm) + 0.5} color={C.dim} style={{marginTop: 14}}>
                {pr.legenda}
              </MonoTag>
            </>
          ),
        },
        {
          em: pr ? a.em! : p.em,
          top: 470,
          saida: 'up',
          c: (
            <>
              <SearchBar text={typed(a.busca, t, q(a.buscaEm), 20)} focus={1} size={38} caret={t < tA} />
              <div style={{marginTop: 22}}>
                <Stamp start={q(a.selo.em)} text={a.selo.texto} />
              </div>
              <RowTitle start={tA - 0.2} text="anúncios nessa busca, nesta ordem" style={{marginTop: 30}} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                <div style={{position: 'relative'}}>
                  <AdRow start={tA} domain={a.concorrente.dominio} title={a.concorrente.titulo} />
                  <div style={{position: 'absolute', right: -6, top: -26}}>
                    <Pill start={q(a.antesEm)} fill color={C.red} style={{fontSize: 30}}>
                      antes de vocês
                    </Pill>
                  </div>
                </div>
                <AdRow start={tA + 0.35} domain={a.voce.dominio} title={a.voce.titulo} you />
                {a.lugar ? <PlaceRow start={tA + 0.6} name={a.lugar.nome} rating={a.lugar.nota} reviews={a.lugar.avaliacoes} sponsored size={30} /> : null}
              </div>
              <div style={{...perm, marginTop: 40, padding: '24px 28px', borderRadius: 12, border: `1.5px solid ${C.line}`, background: acc(0.05)}}>
                <div style={{fontFamily: sans, fontWeight: 600, fontSize: 46, color: C.ink}}>{a.permite ?? 'E o Google permite.'}</div>
                <div style={{fontFamily: mono, fontSize: 30, color: C.support, marginTop: 8, lineHeight: 1.25}}>{a.fonte ?? 'Fonte: política de marcas registradas do Google Ads (marca pode ser usada como palavra-chave)'}</div>
              </div>
            </>
          ),
        },
      ]}
    />
  );
};
const BuscaVista: React.FC<{start: number; texto: string; sim: boolean}> = ({start, texto, sim}) => (
  <div style={{...useEnter(start, 20, 0.4), display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderRadius: 10, background: C.card, border: `1.5px solid ${C.lineSoft}`}}>
    <span style={{fontFamily: sans, fontSize: 32, color: sim ? C.ink2 : C.dim}}>{texto}</span>
    {sim ? Icon.check(40, C.red) : Icon.x(40, C.dim)}
  </div>
);
