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

// ---------- celularTresVagas ----------
/** Celular com o mapa e só 3 vagas: quem não aparece nem entra na escolha. */
export type CelularTresVagasP = {
  id: 'celularTresVagas';
  em: Q;
  titulo: Part[];
  busca: string;
  celularEm: Q;
  vagasEm: Q;
  toqueEm: Q;
  mensagemEm: Q;
  semRolarEm: Q;
};
export const CelularTresVagas: ModView<CelularTresVagasP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 320,
          saida: 'zoom',
          c: (
            <>
              <Line start={q(p.em)} parts={p.titulo} size={64} keySize={92} />
              <div style={{marginTop: 40}}>
                <PhoneMap start={q(p.celularEm) - 0.2} busca={p.busca} slotsAt={q(p.vagasEm)} tapAt={q(p.toqueEm)} msgAt={q(p.mensagemEm)} noScrollAt={q(p.semRolarEm)} />
              </div>
            </>
          ),
        },
      ]}
    />
  );
};
