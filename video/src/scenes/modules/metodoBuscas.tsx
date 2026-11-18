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

// ---------- metodoBuscas ----------
/** "Como as buscas foram feitas": data, 2 rodadas, local simulado. Abre qualquer cena de buscas. */
export type MetodoBuscasP = {
  id: 'metodoBuscas';
  em: Q;
  selos: Selo[];
  rodape?: string;
  rodapeEm: Q;
};
export const MetodoBuscas: ModView<MetodoBuscasP> = ({p, ate}) => {
  const q = useQ();
  const rod = useEnter(q(p.rodapeEm), 16, 0.45);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 520,
          saida: 'zoom',
          c: (
            <AccentPanel start={q(p.em)} style={{padding: '48px 50px'}}>
              <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>
                <Bullet />
                como as buscas foram feitas
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 30, alignItems: 'flex-start'}}>
                {p.selos.map((s) => (
                  <Stamp key={s.texto} start={q(s.em)} text={s.texto} hi={s.hi ?? 0} />
                ))}
              </div>
              <div style={{...rod, display: 'flex', alignItems: 'center', gap: 18, marginTop: 34}}>
                {Icon.pin(52)}
                <span style={{fontFamily: sans, fontSize: 38, color: C.ink}}>{p.rodape ?? 'como alguém que está lá procurando'}</span>
              </div>
            </AccentPanel>
          ),
        },
      ]}
    />
  );
};
