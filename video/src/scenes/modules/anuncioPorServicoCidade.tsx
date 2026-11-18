import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {easeOut, Line, Panel, prog, qEnd, Telas, useCena, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, AdExample, Bar, Bullet, Card, BrandMark, Counter, MonoTag, Pill, WhatsAppButton} from '../../parts';
import type {ModView} from '../../core/tipos';


// ---------- anuncioPorServicoCidade ----------
/** "É aqui que entra a Agência Exemplo": cartões "exemplo" de anúncio por serviço e cidade, com Ligar e WhatsApp. */
export type AnuncioPorServicoCidadeP = {
  id: 'anuncioPorServicoCidade';
  em: Q;
  ofertaEm: Q;
  /** em pares (2 por linha); `destaque` acende o cartão até o próximo destaque */
  exemplos: {servico: string; cidade: string; em: Q; destaque?: boolean}[];
  ligarEm: Q;
  whatsEm: Q;
  rodape?: string;
  rodapeEm: Q;
};
export const AnuncioPorServicoCidade: ModView<AnuncioPorServicoCidadeP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const st = p.exemplos.map((e) => q(e.em));
  const dest = p.exemplos.map((e, i) => (e.destaque ? i : -1)).filter((i) => i >= 0);
  const hi = (i: number) => {
    const k = dest.indexOf(i);
    if (k < 0) return 0;
    const next = dest[k + 1];
    return prog(t, st[i], 0.3) * (next !== undefined ? 1 - prog(t, st[next], 0.3) : 1);
  };
  const rows: number[][] = [];
  p.exemplos.forEach((_, i) => (i % 2 === 0 ? rows.push([i]) : rows[rows.length - 1].push(i)));
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
              <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                <BrandMark start={q(p.em)} />
                <Line start={q(p.em)} parts={[['É aqui que entra a', 's'], ['Agência Exemplo.', 'k']]} size={52} keySize={64} />
              </div>
              <Line start={q(p.ofertaEm)} parts={[['Um anúncio para cada', 's'], ['serviço', 'w'], ['e cada', 's'], ['cidade:', 'w']]} size={52} style={{marginTop: 40}} />
              {rows.map((r, k) => (
                <div key={k} style={{display: 'flex', gap: 18, marginTop: k === 0 ? 30 : 18}}>
                  {r.map((i) => (
                    <AdExample key={i} start={st[i]} svc={p.exemplos[i].servico} city={p.exemplos[i].cidade} hi={hi(i)} call={prog(t, q(p.ligarEm) + i * 0.1, 0.3)} wa={prog(t, q(p.whatsEm) + i * 0.1, 0.3)} />
                  ))}
                </div>
              ))}
              <MonoTag start={q(p.rodapeEm)} color={C.support} style={{marginTop: 26}}>
                {p.rodape ?? 'direto para a ligação ou para o WhatsApp'}
              </MonoTag>
            </>
          ),
        },
      ]}
    />
  );
};
