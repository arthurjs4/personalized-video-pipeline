import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {easeOut, Line, prog, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Q} from '../../core/lib';
import {icon, Icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {MonoTag, Pill, Avatar} from '../../parts';
import type {ModView} from '../../core/tipos';

/**
 * Cena fixa 1 (v3, 14/11/2026): 0:00 a 0:15. "Oi, [nome]", Ana da Agência (sem foto:
 * o mesmo avatar animado do Avatar, com a etiqueta "Ana", desde 14/11/2026), 2 ou 3 ganchos empilhados
 * com fatos dele (CONFIRMADOS, o achado entre eles) e o loop aberto: "No fim, mostro o que falta,
 * e é a parte mais fácil." A capa borrada do Mapa do Google aparece aqui e volta no convite (cena 10).
 */
export type Gancho = {
  em: Q;
  /** número grande do fato ("5,0", "1ª", "0"); opcional */
  numero?: string;
  /** o fato em poucas palavras ("131 avaliações no Google") */
  texto: string;
  /** linha menor de apoio ("busca: accountant Marlborough") */
  detalhe?: string;
  icone?: IconName;
  /** o achado (a dor): borda e número em vermelho suave */
  alerta?: boolean;
};

export type AberturaP = {
  id: 'abertura';
  em?: Q;
  /** como a Ana chama o decisor */
  nome: string;
  /** nome da empresa na capa do "Mapa do Google da [empresa]" */
  empresa: string;
  /** 2 ou 3 fatos dele */
  ganchos: Gancho[];
  nomeEm?: Q;
  aquiEm?: Q;
  marcaEm?: Q;
  /** "No fim" */
  loopEm?: Q;
  /** "o que falta" */
  faltaEm?: Q;
  /** "mais fácil" */
  facilEm?: Q;
};

export const Abertura: ModView<AberturaP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const g0 = q(p.ganchos[0].em);
  const yuriOut = 1 - prog(t, g0 - 0.35, 0.3);
  return (
    <>
      <Telas
        ate={ate}
        telas={[
          {
            em: p.em ?? 0,
            top: 560,
            saida: 'up',
            c: (
              <>
                <Line start={0.2} parts={[['Oi,', 's'], [`${p.nome}.`, 'k']]} size={88} keySize={170} />
                <Line start={q(p.aquiEm!)} parts={[['Aqui é o', 's'], ['Ana,', 'w']]} size={64} style={{marginTop: 46}} />
                <Line start={q(p.marcaEm!)} parts={[['da', 's'], ['Agência Exemplo.', 'a']]} size={64} keySize={64} />
              </>
            ),
          },
          {
            em: p.ganchos[0].em,
            top: 360,
            saida: 'blur',
            c: (
              <>
                <MonoTag start={g0 - 0.1} color={C.support} style={{fontSize: 30}}>
                  o que a gente viu no Google
                </MonoTag>
                <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 30}}>
                  {p.ganchos.slice(0, 3).map((g, i) => (
                    <GanchoCard key={i} g={g} start={q(g.em)} />
                  ))}
                </div>
              </>
            ),
          },
          {
            em: p.loopEm!,
            top: 400,
            c: (
              <>
                <Line start={q(p.loopEm!)} parts={[['No fim, mostro', 's']]} size={64} />
                <Line start={q(p.faltaEm!)} parts={[['o que falta.', 'k']]} keySize={128} />
                <CapaBorrada empresa={p.empresa} start={q(p.faltaEm!) + 0.15} />
                <div style={{marginTop: 34}}>
                  <Pill start={q(p.facilEm!)} fill color={C.ok} style={{fontSize: 40}}>
                    {Icon.check(40, '#10200c')} a parte mais fácil
                  </Pill>
                </div>
              </>
            ),
          },
        ]}
      />
      <div style={{opacity: yuriOut}}>
        <Avatar x={270} y={1300} size={200} start={q(p.aquiEm!) - 0.15} nome="Ana" papel="Agência Exemplo" />
      </div>
    </>
  );
};

const GanchoCard: React.FC<{g: Gancho; start: number}> = ({g, start}) => {
  const st = useEnter(start - 0.05, 30, 0.45);
  const cor = g.alerta ? C.red : C.accent;
  return (
    <div style={{...st, display: 'flex', alignItems: 'center', gap: 28, padding: '26px 30px', borderRadius: 18, background: g.alerta ? `rgba(${C.redRgb},0.08)` : C.cardHi, border: `1.5px solid ${g.alerta ? `rgba(${C.redRgb},0.55)` : acc(0.55)}`}}>
      {g.numero ? (
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 104, lineHeight: 1, color: cor, minWidth: 150, textAlign: 'center'}}>{g.numero}</div>
      ) : (
        <div style={{width: 120, height: 120, borderRadius: 99, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${cor}`}}>{icon(g.icone ?? 'search', 64, cor)}</div>
      )}
      <div style={{flex: 1}}>
        <div style={{fontFamily: sans, fontWeight: 600, fontSize: 46, color: C.ink, lineHeight: 1.15}}>{g.texto}</div>
        {g.detalhe ? <div style={{fontFamily: mono, fontSize: 30, color: C.support, marginTop: 8}}>{g.detalhe}</div> : null}
      </div>
    </div>
  );
};

/** capa borrada do "Mapa do Google da [empresa]" (abertura e convite usam a mesma) */
export const CapaBorrada: React.FC<{empresa: string; start: number; nitidez?: number; altura?: number}> = ({empresa, start, nitidez = 0, altura = 470}) => {
  const st = useEnter(start, 40, 0.6);
  const t = useT();
  const pins: [number, number][] = [
    [140, 120],
    [330, 210],
    [520, 90],
    [700, 260],
    [260, 330],
    [610, 360],
  ];
  const blur = 7 * (1 - nitidez);
  const cheg = prog(t, start + 0.2, 0.8, easeOut);
  return (
    <div style={{...st, position: 'relative', marginTop: 36, height: altura, borderRadius: 22, overflow: 'hidden', border: `1.5px solid ${acc(0.5)}`, background: C.mapBg}}>
      <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px)`}}>
        {Array.from({length: 7}, (_, i) => (
          <div key={'h' + i} style={{position: 'absolute', left: 0, right: 0, top: 40 + i * 64, height: 3, background: 'rgba(255,255,255,0.08)'}} />
        ))}
        {Array.from({length: 6}, (_, i) => (
          <div key={'v' + i} style={{position: 'absolute', top: 0, bottom: 0, left: 60 + i * 150, width: 3, background: 'rgba(255,255,255,0.07)'}} />
        ))}
        {pins.map(([x, y], i) => (
          <div key={i} style={{position: 'absolute', left: x, top: y * (0.6 + 0.4 * cheg)}}>
            {Icon.pin(58, i === 0 ? C.accent : C.support)}
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <div key={'c' + i} style={{position: 'absolute', left: 40, right: 40, top: altura - 150 + i * 40, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.10)', width: `${70 - i * 15}%`}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, padding: '28px 34px', background: `linear-gradient(180deg, ${C.bg}EE 0%, ${C.bg}00 100%)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          {Icon.lock(40, C.accent)}
          <span style={{fontFamily: mono, fontSize: 30, color: C.support}}>Mapa do Google da</span>
        </div>
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 60, color: C.ink, marginTop: 6, lineHeight: 1.05}}>{empresa}</div>
      </div>
    </div>
  );
};
