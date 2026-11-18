import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Line, Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {Pill, Avatar} from '../../parts';
import type {ModView} from '../../core/tipos';
import {CapaBorrada} from './abertura';

/**
 * Cena fixa final (v3, 14/11/2026): 3:35 a 3:50. Fecha o loop da abertura ("o que falta" e "a parte
 * mais fácil"), mostra a capa borrada do "Mapa do Google da [empresa]", o avatar animado (o mesmo do
 * Avatar) com o nome da Ana e 2 opções de horário (ou o horário já marcado). Sem foto (decisão do
 * Ana, 14/11/2026).
 */
export type ConviteP = {
  id: 'convite';
  em?: Q;
  nome: string;
  empresa: string;
  /** o que falta, em poucas palavras, igual ao achado ("aparecer nas buscas de imposto") */
  falta: string;
  /** 2 opções de horário ("terça de manhã", "quinta à tarde"); ou `marcado` se a call já foi reservada */
  horarios?: [string, string];
  /** call já reservada: "quinta, 10h" */
  marcado?: string;
  assinatura?: [string, string];
  slogan?: string;
  faltaEm?: Q;
  facilEm?: Q;
  mapaEm?: Q;
  narradorEm?: Q;
  horario1Em?: Q;
  horario2Em?: Q;
  soEm?: Q;
};

export const Convite: ModView<ConviteP> = ({p, ate}) => {
  const q = useQ();
  const narr = useEnter(q(p.narradorEm!) - 0.05, 24, 0.5);
  const so = useEnter(q(p.soEm!), 12, 0.4);
  const sig = useEnter(q(p.soEm!) + 0.3, 14, 0.5);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em!,
          top: 520,
          saida: 'up',
          c: (
            <>
              <Line start={q(p.em!)} parts={[['Prometi,', 's'], [`${p.nome}.`, 'k']]} size={64} keySize={110} />
              <Line start={q(p.faltaEm!)} parts={[['O que falta:', 's']]} size={58} style={{marginTop: 60}} />
              <Line start={q(p.faltaEm!) + 0.25} parts={[[p.falta, 'a']]} keySize={74} style={{marginTop: 10}} />
              <div style={{marginTop: 40}}>
                <Pill start={q(p.facilEm!)} fill color={C.ok} style={{fontSize: 40}}>
                  {Icon.check(40, '#10200c')} a parte mais fácil
                </Pill>
              </div>
            </>
          ),
        },
        {
          em: p.mapaEm!,
          top: 320,
          c: (
            <>
              <CapaBorrada empresa={p.empresa} start={q(p.mapaEm!)} altura={430} />
              <div style={{...narr, position: 'relative', height: 150, marginTop: 34}}>
                <Avatar x={66} y={66} size={132} start={q(p.narradorEm!) - 0.1} tag={false} />
                <div style={{position: 'absolute', left: 250, top: 24}}>
                  <div style={{fontFamily: sans, fontWeight: 600, fontSize: 50, color: C.ink, lineHeight: 1.1}}>Ana</div>
                  <div style={{fontFamily: mono, fontSize: 30, color: C.steel, marginTop: 4}}>Agência Exemplo · 15 minutos</div>
                </div>
              </div>
              {p.marcado ? (
                <div style={{marginTop: 30}}>
                  <Pill start={q(p.horario1Em!)} color={C.accent} style={{fontSize: 40}}>
                    {Icon.clock(38, C.accent)} {p.marcado}
                  </Pill>
                </div>
              ) : (
                <div style={{display: 'flex', gap: 18, marginTop: 30, flexWrap: 'wrap'}}>
                  <Horario start={q(p.horario1Em!)} texto={p.horarios![0]} />
                  <Horario start={q(p.horario2Em!)} texto={p.horarios![1]} />
                </div>
              )}
              <div style={{...so, display: 'flex', alignItems: 'center', gap: 14, marginTop: 28}}>
                {Icon.chat(42, C.wa)}
                <span style={{fontFamily: sans, fontSize: 40, color: C.support}}>É só responder por aqui.</span>
              </div>
              <div style={{...sig, marginTop: 26}}>
                <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>{p.assinatura![1]}</div>
                {p.slogan ? <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 6}}>{p.slogan}</div> : null}
              </div>
            </>
          ),
        },
      ]}
    />
  );
};

const Horario: React.FC<{start: number; texto: string}> = ({start, texto}) => {
  const st = useEnter(start - 0.05, 20, 0.4);
  return (
    <div style={{...st, display: 'flex', alignItems: 'center', gap: 14, padding: '20px 26px', borderRadius: 14, background: C.cardHi, border: `1.5px solid ${acc(0.7)}`}}>
      {Icon.clock(38, C.accent)}
      <span style={{fontFamily: sans, fontWeight: 600, fontSize: 40, color: C.ink}}>{texto}</span>
    </div>
  );
};
