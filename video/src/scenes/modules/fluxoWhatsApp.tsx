import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {easeOut, Line, Panel, prog, qEnd, Telas, useCena, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, AdExample, Bar, Bullet, Card, BrandMark, Counter, MonoTag, Pill, WhatsAppButton} from '../../parts';
import type {ModView} from '../../core/tipos';


// ---------- fluxoWhatsApp ----------
/** Busca → anúncio por serviço → botão WhatsApp → conversa com mensagem pronta. */
export type FluxoWhatsAppP = {
  id: 'fluxoWhatsApp';
  em: Q;
  titulo?: Part[];
  anuncios: {rotulo: string; em: Q}[];
  /** cartão extra de uma unidade (ex.: "Unidade perto de você") */
  unidade?: {cabecalho: string; titulo: string; subtitulo: string; em: Q; botao: string; botaoEm: Q};
  toque: {
    em: Q;
    botaoEm: Q;
    conversaEm: Q;
    prontaEm: Q;
    msgEm: Q;
    /** fim da mensagem falada (usa o fim da última palavra da frase) */
    msgFimEm: Q;
    empresa: string;
    iniciais: string;
    mensagem: string;
    botao?: string;
  };
};
export const FluxoWhatsApp: ModView<FluxoWhatsAppP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const s = useCena();
  const k = p.toque;
  const tBotao = q(k.botaoEm);
  const tOi = q(k.msgEm);
  const tOiEnd = qEnd(s, k.msgFimEm);
  const press = t >= tBotao && t < tBotao + 0.35 ? 1 : 0;
  const shown = t < tOi ? '' : k.mensagem.slice(0, Math.ceil(k.mensagem.length * prog(t, tOi, tOiEnd - tOi + 0.1, (x) => x)));
  const uniHi = p.unidade ? prog(t, q(p.unidade.em), 0.5) : 0;
  const bubble = useEnter(tOi - 0.3, 24, 0.45);
  const sent = useEnter(tOiEnd + 0.15, 10, 0.4);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 330,
          saida: 'up',
          c: (
            <>
              <Line start={q(p.em)} parts={p.titulo ?? [['Um anúncio para', 's'], ['cada serviço:', 'w']]} size={62} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 36}}>
                {p.anuncios.map((a, i) => (
                  <Card key={a.rotulo} start={q(a.em) - 0.1} dim={uniHi * 0.5} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 30px'}}>
                    <div>
                      <div style={{fontFamily: mono, fontSize: 30, color: C.accent}}>anúncio {String(i + 1).padStart(2, '0')} · exemplo</div>
                      <div style={{fontFamily: sans, fontWeight: 700, fontSize: 46, color: C.ink, marginTop: 4}}>{a.rotulo}</div>
                    </div>
                    <span style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: sans, fontWeight: 700, fontSize: 32, color: C.wa}}>
                      {Icon.chat(30, C.wa)} WhatsApp
                    </span>
                  </Card>
                ))}
                {p.unidade ? (
                  <Card start={q(p.unidade.em)} style={{padding: '28px 30px', borderColor: acc(0.7), background: C.cardHi}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
                      <span style={{fontFamily: mono, fontSize: 30, color: C.accent}}>{p.unidade.cabecalho}</span>
                      <span style={{fontFamily: mono, fontSize: 30, color: C.dim}}>exemplo</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10}}>
                      {Icon.pin(48, C.accentLight)}
                      <span style={{fontFamily: sans, fontWeight: 700, fontSize: 46, color: C.ink}}>{p.unidade.titulo}</span>
                    </div>
                    <div style={{fontFamily: sans, fontSize: 36, color: C.support, marginTop: 6}}>{p.unidade.subtitulo}</div>
                    <div style={{marginTop: 18}}>
                      <WhatsAppButton start={q(p.unidade.botaoEm)} label={p.unidade.botao} />
                    </div>
                  </Card>
                ) : null}
              </div>
            </>
          ),
        },
        {
          em: k.em,
          top: 380,
          c: (
            <>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <WhatsAppButton start={q(k.em) - 0.1} press={press} label={k.botao ?? 'Falar no WhatsApp'} />
              </div>
              <div style={{marginTop: 50}}>
                <Panel start={q(k.conversaEm)} style={{padding: 0, overflow: 'hidden'}} tilt={0.5}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '30px 36px', borderBottom: `1.5px solid ${C.lineSoft}`}}>
                    <div style={{width: 84, height: 84, borderRadius: 99, border: `2px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.accentLight}}>{k.iniciais}</div>
                    <div>
                      <div style={{fontFamily: sans, fontWeight: 700, fontSize: 44, color: C.ink}}>{k.empresa}</div>
                      <div style={{fontFamily: mono, fontSize: 30, color: C.wa, marginTop: 4}}>conversa no WhatsApp · exemplo</div>
                    </div>
                  </div>
                  <div style={{padding: '36px 36px 46px', minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 22}}>
                    <MonoTag start={q(k.prontaEm) - 0.1} style={{alignSelf: 'flex-start', color: C.support, fontSize: 32}}>
                      mensagem pronta, vinda do anúncio
                    </MonoTag>
                    <div style={{...bubble, maxWidth: 700, background: 'rgba(37,211,102,0.16)', border: '1.5px solid rgba(37,211,102,0.45)', borderRadius: '22px 22px 6px 22px', padding: '24px 30px', minHeight: 70}}>
                      <span style={{fontFamily: sans, fontSize: 44, color: C.ink, lineHeight: 1.3}}>{shown}</span>
                    </div>
                    <div style={{...sent, fontFamily: mono, fontSize: 30, color: C.support}}>enviada ✓✓</div>
                  </div>
                </Panel>
              </div>
            </>
          ),
        },
      ]}
    />
  );
};
