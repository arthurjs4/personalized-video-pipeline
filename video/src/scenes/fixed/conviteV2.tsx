import React from 'react';
import {acc, C, CONTENT_W, mono, sans, SIDE} from '../../core/theme';
import {Line, Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {Avatar} from '../../parts';
import type {ModView} from '../../core/tipos';

/** v2 (até 13/11/2026), usada pelos exemplos. Cena fixa final: 15 minutos com a Ana, pergunta do horário, assinatura e Avatar. */
export type ConviteV2P = {
  id: 'conviteV2';
  em?: Q;
  nome: string;
  /** "quanto vale um cliente novo" / "quanto vale uma obra" */
  valor: string;
  assinatura?: [string, string];
  /** 3ª linha opcional da assinatura (ex.: "Google Ads com IA, revisado por gente.") */
  slogan?: string;
  nomeEm?: Q;
  oQueNaoEm?: Q;
  valorEm?: Q;
  paraVocesEm?: Q;
  queTalEm?: Q;
  quinzeEm?: Q;
  narradorEm?: Q;
  paraFazerEm?: Q;
  horarioEm?: Q;
  soEm?: Q;
};

export const ConviteV2: ModView<ConviteV2P> = ({p, ate}) => {
  const q = useQ();
  const tQual = q(p.horarioEm!);
  const card = useEnter(tQual - 0.05, 30, 0.55);
  const so = useEnter(q(p.soEm!), 12, 0.4);
  const sig = useEnter(tQual + 0.2, 20, 0.6);
  return (
    <>
      <Telas
        ate={ate}
        telas={[
          {
            em: p.em!,
            top: 520,
            saida: 'up',
            c: (
              <>
                <Line start={q(p.em!)} parts={[['Foi isso que a gente viu,', 's']]} size={64} />
                <Line start={q(p.nomeEm!)} parts={[[`${p.nome}.`, 'k']]} keySize={130} />
                <Line start={q(p.oQueNaoEm!)} parts={[['O que não dá para ver daqui:', 's']]} size={58} style={{marginTop: 70}} />
                <Line start={q(p.valorEm!)} parts={[[p.valor, 'a']]} keySize={82} style={{marginTop: 10}} />
                <Line start={q(p.paraVocesEm!)} parts={[['para vocês.', 'w']]} size={64} />
              </>
            ),
          },
          {
            em: p.queTalEm!,
            top: 400,
            c: (
              <>
                <Line start={q(p.queTalEm!)} parts={[['Que tal', 's']]} size={66} />
                <Line start={q(p.quinzeEm!)} parts={[['15 minutos', 'a']]} keySize={160} />
                <Line start={q(p.narradorEm!)} parts={[['com a Ana,', 'k']]} keySize={92} />
                <Line start={q(p.paraFazerEm!)} parts={[['para fazer essa conta juntos?', 's']]} size={54} style={{marginTop: 14}} />
                <div style={{...card, marginTop: 40, padding: '32px 36px', borderRadius: 16, background: C.cardHi, border: `1.5px solid ${acc(0.7)}`}}>
                  <div style={{fontFamily: sans, fontWeight: 600, fontSize: 58, color: C.ink, lineHeight: 1.15}}>Qual horário fica bom para você?</div>
                  <div style={{...so, display: 'flex', alignItems: 'center', gap: 14, marginTop: 18}}>
                    {Icon.chat(44, C.wa)}
                    <span style={{fontFamily: sans, fontSize: 42, color: C.support}}>É só responder por aqui.</span>
                  </div>
                </div>
              </>
            ),
          },
        ]}
      />
      <div style={{...sig, position: 'absolute', left: SIDE + 300, width: CONTENT_W - 300, top: p.slogan ? 1300 : 1370}}>
        <div style={{fontFamily: sans, fontWeight: 600, fontSize: 40, color: C.ink}}>{p.assinatura![0]}</div>
        <div style={{fontFamily: mono, fontSize: 30, color: C.support, marginTop: 6}}>{p.assinatura![1]}</div>
        {p.slogan ? <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 8}}>{p.slogan}</div> : null}
      </div>
      <Avatar x={SIDE + 105} y={1400} size={150} start={q(p.queTalEm!) - 0.2} tag={false} />
    </>
  );
};
