import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Line, prog, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import type {IconName} from '../../core/common';
import {IconRow, MonoTag, RatingCard, Review} from '../../parts';
import type {ModView} from '../../core/tipos';

/**
 * Cena fixa 2 (o miolo): nota contando no perfil do Google, elogios específicos, temas mais citados
 * e selos opcionais (licença, fotos, postagens, ano de fundação...). A abertura ("O que vocês já construíram")
 * e o fecho ("A reputação está pronta") são módulos `frase` antes e depois deste.
 */
export type ReputacaoP = {
  id: 'reputacao';
  em: Q;
  nota: {
    local: string;
    empresa: string;
    nota: number;
    notaEm: Q;
    avaliacoes: number;
    avaliacoesEm: Q;
    /** segunda unidade com nota própria (opcional) */
    outra?: {nome: string; nota: string; avaliacoes: number; em: Q; contaEm: Q};
  };
  elogios: {em: Q; titulo?: Part[]; itens: {em: Q; titulo: string; texto: string}[]};
  temas?: {em: Q; titulo: Part[]; itens: {rotulo: string; mencoes: string; em: Q}[]; destaques?: number; fonte?: string};
  selos?: {em: Q; itens: {em: Q; icone: IconName; a: string; b: string}[]; fonte?: string};
};

export const Reputacao: ModView<ReputacaoP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const n = p.nota;
  const el = p.elogios;
  const tm = p.temas;
  const se = p.selos;
  const temaFonte = useEnter(tm ? q(tm.itens[0].em) + 0.3 : 0, 14, 0.45);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: n.outra ? 460 : 540,
          saida: 'zoom',
          c: (
            <RatingCard
              start={q(p.em)}
              local={n.local}
              empresa={n.empresa}
              nota={n.nota}
              notaAt={q(n.notaEm)}
              avaliacoes={n.avaliacoes}
              avaliacoesAt={q(n.avaliacoesEm)}
              outra={n.outra ? {nome: n.outra.nome, nota: n.outra.nota, avaliacoes: n.outra.avaliacoes, at: q(n.outra.em), contaAt: q(n.outra.contaEm)} : undefined}
            />
          ),
        },
        {
          em: el.em,
          top: 420,
          saida: 'up',
          c: (
            <>
              <Line start={q(el.em)} parts={el.titulo ?? [['Os elogios são', 's'], ['específicos:', 'w']]} size={60} />
              <div style={{marginTop: 18}}>
                {el.itens.map((r, i) => (
                  <Review key={r.titulo} start={q(r.em) - 0.1} dim={el.itens[i + 1] ? prog(t, q(el.itens[i + 1].em), 0.4) * 0.6 : 0} title={r.titulo} body={r.texto} />
                ))}
              </div>
            </>
          ),
        },
        tm && {
          em: tm.em,
          top: 580,
          saida: 'up',
          c: (
            <>
              <Line start={q(tm.em)} parts={tm.titulo} size={66} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 40}}>
                {tm.itens.map((r, i) => {
                  const hi = i < (tm.destaques ?? 1);
                  return (
                    <TemaRow key={r.rotulo} start={q(r.em)} hi={hi} rotulo={r.rotulo} mencoes={r.mencoes} />
                  );
                })}
              </div>
              <div style={{...temaFonte, fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 22}}>{tm.fonte ?? 'temas das avaliações, segundo o Google'}</div>
            </>
          ),
        },
        se && {
          em: se.em,
          top: 560,
          saida: 'blur',
          c: (
            <>
              {se.itens.map((r) => (
                <IconRow key={r.a} start={q(r.em) - 0.05} icone={r.icone} a={r.a} b={r.b} />
              ))}
              {se.fonte ? (
                <MonoTag start={q(se.em) + 0.3} color={C.dim} style={{fontSize: 30}}>
                  {se.fonte}
                </MonoTag>
              ) : null}
            </>
          ),
        },
      ]}
    />
  );
};

const TemaRow: React.FC<{start: number; hi: boolean; rotulo: string; mencoes: string}> = ({start, hi, rotulo, mencoes}) => (
  <div style={{...useEnter(start, 24, 0.45), display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 30px', borderRadius: 12, background: hi ? C.cardHi : C.card, border: `1.5px solid ${hi ? acc(0.7) : C.lineSoft}`}}>
    <span style={{fontFamily: sans, fontWeight: hi ? 600 : 500, fontSize: hi ? 50 : 42, color: hi ? C.ink : C.support}}>{rotulo}</span>
    <span style={{fontFamily: mono, fontSize: hi ? 44 : 36, color: hi ? C.accent : C.dim}}>{mencoes} menções</span>
  </div>
);
