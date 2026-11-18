import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {easeOut, Line, Panel, prog, qEnd, Telas, useCena, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, AdExample, Bar, Bullet, Card, BrandMark, Counter, MonoTag, Pill, WhatsAppButton} from '../../parts';
import type {ModView} from '../../core/tipos';


// ---------- custoDoClique ----------
/** Custo por clique do setor com fonte, ano, "mediana" e "estimativa". Sai do vídeo se não houver fonte confiável. */
export type CustoDoCliqueP = {
  id: 'custoDoClique';
  em: Q;
  titulo: Part[];
  tituloSize?: number;
  tituloKeySize?: number;
  painelEm: Q;
  cabecalho: string;
  valor: number;
  valorEm: Q;
  porCliqueEm: Q;
  setores: {rotulo: string; valor: number; destaque?: boolean}[];
  setoresEm: Q;
  pills: {texto: string; em: Q; tipo?: 'alerta' | 'destaque'}[];
  fonte: string;
  fonteEm: Q;
};
export const CustoDoClique: ModView<CustoDoCliqueP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const por = useEnter(q(p.porCliqueEm), 14, 0.4);
  const fonte = useEnter(q(p.fonteEm), 10, 0.4);
  const max = Math.max(10, ...p.setores.map((s) => s.valor));
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 420,
          saida: 'up',
          c: (
            <>
              <Line start={q(p.em)} parts={p.titulo} size={p.tituloSize ?? 56} keySize={p.tituloKeySize ?? 70} />
              <AccentPanel start={q(p.painelEm)} style={{padding: '36px 40px', marginTop: 28}}>
                <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>
                  <Bullet />
                  {p.cabecalho}
                </div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 10}}>
                  <Counter to={p.valor} decimals={2} prefix="US$ " start={q(p.valorEm) - 0.1} dur={0.9} style={{fontFamily: sans, fontWeight: 600, fontSize: 116, color: C.accent, letterSpacing: '-0.03em', whiteSpace: 'nowrap'}} />
                  <span style={{...por, fontFamily: sans, fontSize: 40, color: C.ink, whiteSpace: 'nowrap'}}>por clique</span>
                </div>
                <div style={{marginTop: 22}}>
                  {p.setores.map((s, i) => {
                    const st = q(p.setoresEm) + i * 0.15;
                    const pp = prog(t, st, 0.7, easeOut);
                    return (
                      <div key={s.rotulo} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10, opacity: prog(t, st, 0.3)}}>
                        <div style={{width: 320, fontFamily: sans, fontSize: 30, color: s.destaque ? C.ink : C.support, fontWeight: s.destaque ? 600 : 400, whiteSpace: 'nowrap'}}>{s.rotulo}</div>
                        <div style={{flex: 1, height: 30, background: 'rgba(255,255,255,0.05)', borderRadius: 6}}>
                          <div style={{width: `${(s.valor / max) * 100 * pp}%`, height: '100%', background: s.destaque ? C.accent : acc(0.28), borderRadius: 6}} />
                        </div>
                        <div style={{width: 110, textAlign: 'right', fontFamily: mono, fontSize: 30, color: s.destaque ? C.accent : C.support}}>{s.valor.toFixed(2).replace('.', ',')}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12}}>
                  {p.pills.map((x) => (
                    <Pill key={x.texto} start={q(x.em)} color={x.tipo === 'alerta' ? C.red : C.accent} style={{fontSize: 30}}>
                      {x.texto}
                    </Pill>
                  ))}
                </div>
                <div style={{...fonte, fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 20, lineHeight: 1.3}}>{p.fonte}</div>
              </AccentPanel>
            </>
          ),
        },
      ]}
    />
  );
};
