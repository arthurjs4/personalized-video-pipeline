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

// ---------- fluxo ----------
/** 3 passos ligados por tracejado: o caminho de quem procura (ex.: indicação → busca pelo nome → outra empresa). */
export type FluxoP = {
  id: 'fluxo';
  em: Q;
  top?: number;
  passos: {em: Q; icone: IconName; a: string; b: string; alerta?: boolean}[];
};
export const Fluxo: ModView<FluxoP> = ({p, ate}) => {
  const q = useQ();
  return <Telas ate={ate} telas={[{em: p.em, top: p.top ?? 560, c: <FlowSteps passos={p.passos.map((x) => ({...x, at: q(x.em)}))} />}]} />;
};
