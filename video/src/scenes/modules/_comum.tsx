import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Line, Panel, prog, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, AdRow, Bullet, Card, Dashed, FimDaTela, FlowSteps, MapStrip, MiniMap, MonoTag, PhoneFrame, PhoneMap, Pill, PlaceRow, QueryTitle, RouteMap, RowTitle, ScrollPage, SearchBar, Stamp, typed} from '../../parts';
import type {Linha} from './frase';
import type {ModView} from '../../core/tipos';

// Ajudantes usados por vários módulos.
export type Selo = {texto: string; em: Q; hi?: number};
export type PillSpec = {texto: string; em: Q; tipo?: 'ok' | 'destaque' | 'alerta'; size?: number};
export type Lugar = {n?: string; nome: string; nota: string; avaliacoes: string};

export const PillX: React.FC<{p: PillSpec}> = ({p}) => {
  const q = useQ();
  const tipo = p.tipo ?? 'destaque';
  const st = p.size ? {fontSize: p.size} : undefined;
  if (tipo === 'ok')
    return (
      <Pill start={q(p.em)} fill color={C.ok} style={st}>
        {Icon.check(34, '#10200c')} {p.texto}
      </Pill>
    );
  return (
    <Pill start={q(p.em)} color={tipo === 'alerta' ? C.red : C.accent} style={st}>
      {p.texto}
    </Pill>
  );
};
export const Lines: React.FC<{linhas: Linha[]; em: Q}> = ({linhas, em}) => {
  const q = useQ();
  return (
    <>
      {linhas.map((l, i) => (
        <Line key={i} start={q(l.em ?? em)} parts={l.t} size={l.size ?? 58} keySize={l.keySize} style={l.mt ? {marginTop: l.mt} : undefined} />
      ))}
    </>
  );
};

