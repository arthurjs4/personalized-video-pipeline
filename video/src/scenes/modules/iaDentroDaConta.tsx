import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {easeOut, Line, Panel, prog, qEnd, Telas, useCena, useEnter, useQ, useT} from '../../core/lib';
import type {Part, Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, AdExample, Bar, Bullet, Card, BrandMark, Counter, MonoTag, Pill, WhatsAppButton} from '../../parts';
import type {ModView} from '../../core/tipos';


// ---------- iaDentroDaConta ----------
/** Inteligência artificial dentro da conta: previsão em faixas e, depois, buscas que trouxeram contato × só gastaram, lance, bloqueio, pausa. */
export type IaDentroDaContaP = {
  id: 'iaDentroDaConta';
  em: Q;
  linha2?: Part[];
  linha2Size?: number;
  trabalhandoEm?: Q;
  previsaoEm?: Q;
  previsaoTitulo?: string;
  quantosEm?: Q;
  sempreEm?: Q;
  nuncaEm?: Q;
  contaEm?: Q;
  contaTitulo?: string;
  /** buscas de exemplo: ok = trouxe ligação; as outras só gastaram e são bloqueadas */
  buscas: {q: string; ok: boolean}[];
  buscasEm?: Q;
  gastaramEm?: Q;
  bloqueiaEm?: Q;
  ajustaEm?: Q;
  lanceBusca: string;
  pausaEm?: Q;
};
export const IaDentroDaConta: ModView<IaDentroDaContaP> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  let nOk = 0;
  let nBad = 0;
  const rows = p.buscas.map((b) => ({...b, st: b.ok ? q(p.buscasEm!) + 0.25 * nOk++ : q(p.gastaramEm!) + 0.25 * nBad++}));
  const lance = prog(t, q(p.ajustaEm!), 0.9, easeOut);
  const block = prog(t, q(p.bloqueiaEm!), 0.4);
  const pause = prog(t, q(p.pausaEm!), 0.3);
  const lanceSt = useEnter(q(p.ajustaEm!), 16, 0.4);
  const pausaSt = useEnter(q(p.pausaEm!), 16, 0.4);
  const pausadoSt = useEnter(q(p.pausaEm!) + 0.3, 10, 0.3);
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
              <Line start={q(p.em)} parts={[['Inteligência artificial', 'a']]} keySize={84} />
              <Line start={q(p.trabalhandoEm!)} parts={p.linha2 ?? [['dentro da conta.', 'k']]} size={p.linha2Size ?? 60} keySize={72} />
              <AccentPanel start={q(p.previsaoEm!)} style={{padding: '34px 40px', marginTop: 40}}>
                <PanelHeadN n="01" titulo={p.previsaoTitulo ?? 'previsão de contatos'} />
                <Bar start={q(p.quantosEm!)} label="verba menor" tag="contatos esperados: uma faixa" w={70} color={C.accentDeep} />
                <Bar start={q(p.quantosEm!) + 0.25} label="verba média" tag="contatos esperados: uma faixa maior" w={100} color={C.accentMid} />
                <Bar start={q(p.quantosEm!) + 0.5} label="verba maior" tag="contatos esperados: a maior faixa" w={130} color={C.accent} />
              </AccentPanel>
              <Line start={q(p.sempreEm!)} parts={[['Sempre uma', 's'], ['faixa,', 'k']]} size={62} keySize={88} style={{marginTop: 40}} />
              <Line start={q(p.nuncaEm!)} parts={[['nunca uma promessa.', 'a']]} keySize={70} />
            </>
          ),
        },
        {
          em: p.contaEm!,
          top: 470,
          c: (
            <AccentPanel start={q(p.contaEm!)} style={{padding: '44px 44px'}}>
              <PanelHeadN n="02" titulo={p.contaTitulo ?? 'dentro da conta'} mb={24} />
              {rows.map((r) => (
                <BuscaRow key={r.q} start={r.st} texto={r.q} ok={r.ok} block={block} />
              ))}
              <div style={{...lanceSt, marginTop: 30}}>
                <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginBottom: 12}}>lance · {p.lanceBusca}</div>
                <div style={{position: 'relative', height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 6}}>
                  <div style={{width: `${35 + 30 * lance}%`, height: '100%', background: C.accent, borderRadius: 6}} />
                  <div style={{position: 'absolute', left: `calc(${35 + 30 * lance}% - 14px)`, top: -9, width: 28, height: 28, borderRadius: 99, background: C.accentLight}} />
                </div>
              </div>
              <div style={{...pausaSt, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 34}}>
                <span style={{fontFamily: sans, fontSize: 32, color: C.support}}>anúncio sem nenhum contato</span>
                <div style={{width: 96, height: 50, borderRadius: 99, background: pause > 0.5 ? 'rgba(255,255,255,0.12)' : C.accent, position: 'relative'}}>
                  <div style={{position: 'absolute', top: 5, left: 5 + 46 * (1 - pause), width: 40, height: 40, borderRadius: 99, background: '#fff'}} />
                </div>
              </div>
              <div style={{...pausadoSt, fontFamily: mono, fontSize: 30, color: C.red, textAlign: 'right', marginTop: 8}}>pausado</div>
            </AccentPanel>
          ),
        },
      ]}
    />
  );
};
const PanelHeadN: React.FC<{n: string; titulo: string; mb?: number}> = ({n, titulo, mb = 22}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: mono, fontSize: 30, color: C.support, marginBottom: mb}}>
    <span>
      <span style={{color: C.accent}}>{n}</span> · {titulo}
    </span>
    <span style={{color: C.dim}}>exemplo</span>
  </div>
);
const BuscaRow: React.FC<{start: number; texto: string; ok: boolean; block: number}> = ({start, texto, ok, block}) => (
  <div style={{...useEnter(start, 20, 0.4), display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '20px 0', borderBottom: `1px solid ${C.lineSoft}`}}>
    <span style={{fontFamily: sans, fontSize: 34, color: !ok && block > 0.5 ? C.dim : C.ink2, textDecoration: !ok && block > 0.5 ? 'line-through' : 'none'}}>{texto}</span>
    <span style={{fontFamily: mono, fontSize: 30, padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${ok ? C.ok : C.red}`, color: ok ? C.ok : C.red, whiteSpace: 'nowrap'}}>{ok ? 'trouxe ligação' : block > 0.5 ? 'bloqueada' : 'só gastou'}</span>
  </div>
);
