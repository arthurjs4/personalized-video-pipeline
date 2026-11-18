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

// ---------- variacaoEntreRodadas ----------
/** O resultado mudou entre manhã e tarde: mostra as duas rodadas com honestidade (ex.: "tela 2" no celular). */
export type VariacaoEntreRodadasP = {
  id: 'variacaoEntreRodadas';
  em: Q;
  busca: string;
  buscaEm: Q;
  caretAteEm: Q;
  pills?: {texto: string; em: Q}[];
  manha: {rotulo?: string; em: Q; texto: string; textoEm: Q};
  tarde: {
    rotulo?: string;
    em: Q;
    rolarEm: Q;
    chegaEm: Q;
    linhas: {texto: string; destaqueEm?: Q}[];
    lead: {rotulo: string; nome: string; detalhe: string};
    lado?: [string, string];
  };
};
export const VariacaoEntreRodadas: ModView<VariacaoEntreRodadasP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const m = p.manha;
  const d = p.tarde;
  const mSt = useEnter(q(m.em), 14, 0.4);
  const tSt = useEnter(q(d.em), 14, 0.4);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 330,
          saida: 'up',
          c: (
            <>
              <SearchBar text={typed(p.busca, t, q(p.buscaEm), 26)} focus={1} size={36} caret={t < q(p.caretAteEm)} />
              {p.pills ? (
                <div style={{display: 'flex', gap: 14, marginTop: 22}}>
                  {p.pills.map((x) => (
                    <Pill key={x.texto} start={q(x.em)} color={C.accentLight} style={{fontSize: 30}}>
                      {x.texto}
                    </Pill>
                  ))}
                </div>
              ) : null}
              <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34}}>
                <div style={{...mSt, fontFamily: mono, fontSize: 32, color: C.support, width: 150}}>{m.rotulo ?? 'manhã'}</div>
                <Dashed start={q(m.textoEm)} text={m.texto} size={36} />
              </div>
              <div style={{...tSt, fontFamily: mono, fontSize: 32, color: C.support, marginTop: 34, marginBottom: 16}}>{d.rotulo ?? 'tarde'}</div>
              <ScrollPage
                start={q(d.em) + 0.1}
                scrollFrom={q(d.rolarEm) - 0.2}
                scrollTo={q(d.chegaEm) + 0.6}
                linhas={d.linhas.map((l) => ({texto: l.texto, hiAt: l.destaqueEm !== undefined ? q(l.destaqueEm) : undefined}))}
                lead={d.lead}
                ladoBaixo={d.lado}
              />
            </>
          ),
        },
      ]}
    />
  );
};
