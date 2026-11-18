import React from 'react';
import {Easing} from 'remotion';
import {acc, C, mono, sans} from '../core/theme';
import {easeOut, lerp, prog, useEnter, useT} from '../core/lib';
import {Icon, icon, IconName} from '../core/common';
import {AccentPanel, Card, Counter, Dashed} from './base';

// Peças visuais reaproveitadas pelos módulos. Tudo por props, cor só do tema, texto >= 30 px.

// ---------- peças de busca e mapa ----------

export const Arrow: React.FC<{start: number; h?: number}> = ({start, h = 64}) => {
  const t = useT();
  const p = prog(t, start, 0.45);
  return (
    <div style={{height: h, display: 'flex', justifyContent: 'center'}}>
      <svg width="40" height={h} viewBox={`0 0 40 ${h}`}>
        <line x1="20" y1="2" x2="20" y2={2 + (h - 16) * p} stroke={C.accent} strokeWidth="3" strokeLinecap="round" />
        <path d={`M10 ${h - 18} L20 ${h - 6} L30 ${h - 18}`} fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" opacity={p > 0.9 ? 1 : 0} />
      </svg>
    </div>
  );
};

export const WhatsAppButton: React.FC<{start: number; press?: number; label?: string}> = ({start, press = 0, label = 'WhatsApp'}) => {
  const st = useEnter(start, 20, 0.5);
  return (
    <div style={{...st, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 99, background: press > 0 ? C.wa : 'rgba(37,211,102,0.14)', border: `2px solid ${C.wa}`, transform: `${st.transform} scale(${1 - press * 0.06})`}}>
      {Icon.chat(36, press > 0 ? '#06210f' : C.wa)}
      <span style={{fontFamily: sans, fontWeight: 700, fontSize: 36, color: press > 0 ? '#06210f' : C.wa}}>{label}</span>
    </div>
  );
};

/** título de linha de resultado com lupa (consulta digitada) */
export const QueryTitle: React.FC<{start: number; text: string; style?: React.CSSProperties}> = ({start, text, style}) => {
  const st = useEnter(start, 18, 0.45);
  return (
    <div style={{...st, fontFamily: mono, fontSize: 30, color: C.support, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, ...style}}>
      {Icon.search(30, C.support)} {text}
    </div>
  );
};

/** mapa com N vagas cinza; sem `nomes`, todas com o mesmo rótulo ("outra empresa") */
export const MiniMap: React.FC<{start: number; label?: string; titulo?: string; n?: number; nomes?: string[]}> = ({start, label = 'outra empresa', titulo = 'mapa · 3 empresas', n = 3, nomes}) => {
  const head = useEnter(start - 0.15, 14, 0.4);
  return (
    <div>
      <div style={{...head, fontFamily: mono, fontSize: 30, color: C.dim, marginBottom: 10}}>{titulo}</div>
      <div style={{display: 'flex', gap: 14}}>
        {Array.from({length: n}, (_, i) => (
          <Card key={i} start={start + i * 0.12} dist={24} style={{flex: 1, padding: '18px 18px', background: 'rgba(255,255,255,0.05)', borderColor: C.lineSoft}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              {Icon.pin(30, C.dim)}
              <span style={{fontFamily: sans, fontSize: 30, color: nomes ? C.ink2 : C.support, lineHeight: 1.15}}>{nomes?.[i] ?? label}</span>
            </div>
            <div style={{height: 10, width: '70%', background: 'rgba(255,255,255,0.10)', borderRadius: 4, marginTop: 14}} />
          </Card>
        ))}
      </div>
    </div>
  );
};

/** página de resultados no celular rolando até o bloco do lead ("tela 1, 2, 3") */
export const ScrollPage: React.FC<{
  start: number;
  scrollFrom: number;
  scrollTo: number;
  linhas: {texto: string; hiAt?: number}[];
  lead: {rotulo: string; nome: string; detalhe: string};
  ladoTopo?: string;
  ladoBaixo?: [string, string];
}> = ({start, scrollFrom, scrollTo, linhas, lead, ladoTopo = 'no celular', ladoBaixo = ['vocês aparecem', 'só aqui embaixo']}) => {
  const t = useT();
  const st = useEnter(start, 40, 0.6);
  const H = 560;
  const rowH = 150;
  const total = linhas.length * rowH + 220;
  const p = prog(t, scrollFrom, scrollTo - scrollFrom, easeOut);
  const y = lerp(0, total - H + 40, p);
  const screen = 1 + Math.min(2, Math.floor(y / (H * 0.85) + 0.0001));
  const loc = prog(t, scrollTo - 0.3, 0.5);
  return (
    <div style={{...st, display: 'flex', gap: 26, alignItems: 'flex-start'}}>
      <div style={{position: 'relative', width: 470, height: H, borderRadius: 34, border: '3px solid rgba(255,255,255,0.18)', background: C.panelBg, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', flexShrink: 0}}>
        <div style={{position: 'absolute', left: 22, right: 22, top: 26 - y}}>
          {linhas.map((r) => {
            const hi = r.hiAt !== undefined ? prog(t, r.hiAt, 0.3) : 0;
            return (
              <div key={r.texto} style={{height: rowH - 18, marginBottom: 18, borderRadius: 12, padding: '18px 20px', background: hi > 0 ? `rgba(255,255,255,${0.06 + 0.06 * hi})` : 'rgba(255,255,255,0.05)', border: `1.5px solid ${hi > 0 ? acc(0.6 * hi) : 'rgba(255,255,255,0.06)'}`}}>
                <div style={{fontFamily: sans, fontWeight: 500, fontSize: 30, color: hi > 0 ? C.ink : C.support}}>{r.texto}</div>
                <div style={{height: 10, width: '80%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginTop: 16}} />
                <div style={{height: 10, width: '55%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginTop: 10}} />
              </div>
            );
          })}
          <div style={{borderRadius: 12, padding: '18px 20px', background: C.cardHi, border: `2px solid ${acc(0.3 + 0.6 * loc)}`}}>
            <div style={{fontFamily: mono, fontSize: 30, color: C.accent}}>{lead.rotulo}</div>
            <div style={{fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.ink, marginTop: 6}}>{lead.nome}</div>
            <div style={{fontFamily: sans, fontSize: 30, color: C.support}}>{lead.detalhe}</div>
          </div>
        </div>
      </div>
      <div style={{paddingTop: 30}}>
        <div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{ladoTopo}</div>
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 92, color: t >= scrollFrom ? C.accentLight : C.ink, lineHeight: 1, marginTop: 10}}>tela {screen}</div>
        <div style={{...useEnter(scrollTo - 0.2, 12, 0.4), fontFamily: sans, fontSize: 36, color: C.support, marginTop: 24, lineHeight: 1.25}}>
          {ladoBaixo[0]}
          <br />
          {ladoBaixo[1]}
        </div>
      </div>
    </div>
  );
};

/** celular com o mapa e só 3 vagas */
export const PhoneMap: React.FC<{start: number; busca: string; slotsAt: number; tapAt: number; msgAt: number; noScrollAt: number}> = ({start, busca, slotsAt, tapAt, msgAt, noScrollAt}) => {
  const t = useT();
  const st = useEnter(start, 50, 0.7);
  const tapped = t >= tapAt;
  const msg = useEnter(msgAt, 14, 0.45);
  const noScroll = useEnter(noScrollAt, 10, 0.4);
  return (
    <div style={{...st, display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 560, height: 820, borderRadius: 44, border: '3px solid rgba(255,255,255,0.18)', background: C.panelBg, padding: '34px 26px', boxShadow: '0 40px 90px rgba(0,0,0,0.55)'}}>
        <div style={{height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px'}}>
          {Icon.search(30, C.support)}
          <span style={{fontFamily: sans, fontSize: 30, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{busca}</span>
        </div>
        <div style={{position: 'relative', height: 190, marginTop: 20, borderRadius: 16, background: C.mapBg, overflow: 'hidden'}}>
          <svg width="508" height="190" style={{position: 'absolute', inset: 0}}>
            <path d="M0 120 C120 90 200 150 320 110 S460 60 508 80" stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
            <path d="M180 0 L220 190" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          </svg>
          {[[120, 70], [270, 110], [390, 55]].map(([x, y], i) => (
            <div key={i} style={{position: 'absolute', left: x, top: y, opacity: prog(t, slotsAt + i * 0.15, 0.3)}}>{Icon.pin(40, i === 0 && tapped ? C.accentLight : '#d9d4c3')}</div>
          ))}
        </div>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
          {[0, 1, 2].map((i) => {
            const on = prog(t, slotsAt + i * 0.15, 0.4);
            const hi = i === 0 && tapped;
            return (
              <div key={i} style={{opacity: 0.25 + 0.75 * on, borderRadius: 14, padding: '16px 18px', background: hi ? C.cardHi : 'rgba(255,255,255,0.05)', border: `1.5px solid ${hi ? C.accentLight : 'rgba(255,255,255,0.07)'}`, transform: `scale(${hi && t < tapAt + 0.25 ? 0.97 : 1})`}}>
                <div style={{fontFamily: sans, fontWeight: 600, fontSize: 30, color: C.ink}}>empresa {i + 1}</div>
                <div style={{height: 9, width: '60%', background: 'rgba(255,255,255,0.10)', borderRadius: 4, marginTop: 10}} />
              </div>
            );
          })}
          <div style={{...noScroll, alignSelf: 'center', marginTop: 6, padding: '10px 24px', borderRadius: 99, border: '1.5px dashed rgba(255,255,255,0.2)', fontFamily: sans, fontSize: 30, color: C.dim}}>mais empresas</div>
        </div>
        <div style={{...msg, position: 'absolute', right: -40, top: 300, background: 'rgba(37,211,102,0.18)', border: `1.5px solid ${C.wa}`, borderRadius: '20px 20px 6px 20px', padding: '14px 20px', fontFamily: sans, fontSize: 30, color: C.ink, boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>mensagem enviada ✓✓</div>
      </div>
    </div>
  );
};

/** mapa de duas unidades com a rota entre elas */
export const RouteMap: React.FC<{
  start: number;
  routeAt: number;
  cardBAt: number;
  officeAt: number;
  lostAt: number;
  cidadeA: string;
  cidadeB: string;
  escritorio: {titulo: string; texto: string};
  perdido: string;
  tempo: string;
  unico: string;
}> = ({start, routeAt, cardBAt, officeAt, lostAt, cidadeA, cidadeB, escritorio, perdido, tempo, unico}) => {
  const t = useT();
  const pins = useEnter(start, 30, 0.6);
  const r = prog(t, routeAt - 0.2, 1.0, easeOut);
  const lab = useEnter(routeAt + 0.4, 10, 0.4);
  return (
    <div style={{position: 'relative', height: 780}}>
      <svg width="920" height="780" style={{position: 'absolute', inset: 0}}>
        <path d="M470 105 C 690 170, 780 400, 560 565" stroke={C.accent} strokeWidth="4" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${r} 1`} opacity={0.85} />
      </svg>
      <div style={{...pins, position: 'absolute', left: 30, top: 60, display: 'flex', alignItems: 'center', gap: 14}}>
        {Icon.pin(84, C.accentLight)}
        <span style={{fontFamily: sans, fontWeight: 700, fontSize: 60, color: C.ink}}>{cidadeA}</span>
      </div>
      <div style={{position: 'absolute', left: 40, top: 170, width: 500}}>
        <Card start={officeAt} style={{padding: '20px 24px', background: C.panelBg}}>
          <div style={{fontFamily: mono, fontSize: 30, color: C.accent}}>{escritorio.titulo}</div>
          <div style={{fontFamily: sans, fontWeight: 500, fontSize: 34, color: C.ink, marginTop: 6}}>{escritorio.texto}</div>
        </Card>
        <Dashed start={lostAt} text={perdido} size={32} style={{marginTop: 14}} />
      </div>
      <div style={{...lab, position: 'absolute', left: 600, top: 278, padding: '10px 22px', whiteSpace: 'nowrap', borderRadius: 99, background: C.accent, color: C.onAccent, fontFamily: sans, fontWeight: 700, fontSize: 34}}>{tempo}</div>
      <div style={{...pins, position: 'absolute', left: 470, top: 560, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap'}}>
        {Icon.pin(84, C.accentLight)}
        <span style={{fontFamily: sans, fontWeight: 700, fontSize: 60, color: C.ink}}>{cidadeB}</span>
      </div>
      <div style={{position: 'absolute', left: 480, top: 670, whiteSpace: 'nowrap'}}>
        <Card start={cardBAt} style={{padding: '16px 22px', borderColor: acc(0.55), background: C.cardHi}}>
          <span style={{fontFamily: sans, fontWeight: 500, fontSize: 32, color: C.ink}}>{unico}</span>
        </Card>
      </div>
    </div>
  );
};

/** cartão de nota do Google */
export const RatingCard: React.FC<{
  start: number;
  local: string;
  empresa: string;
  nota: number;
  notaAt: number;
  avaliacoes: number;
  avaliacoesAt: number;
  outra?: {nome: string; nota: string; avaliacoes: number; at: number; contaAt: number};
}> = ({start, local, empresa, nota, notaAt, avaliacoes, avaliacoesAt, outra}) => {
  const t = useT();
  const fills = [0, 1, 2, 3, 4].map((i) => Math.max(0, Math.min(1, nota - i)));
  return (
    <AccentPanel start={start} style={{padding: outra ? '56px 60px' : '64px 64px'}}>
      <div style={{fontFamily: mono, fontSize: 30, color: C.support, marginBottom: 18}}>
        <span style={{color: C.accent}}>●</span> perfil no Google · {local}
      </div>
      <div style={{fontFamily: sans, fontWeight: 600, fontSize: 46, color: C.ink, marginBottom: 6}}>{empresa}</div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 36}}>
        <Counter from={0} to={nota} decimals={1} start={notaAt - 0.15} dur={0.8} style={{fontFamily: sans, fontWeight: 600, fontSize: outra ? 270 : 290, lineHeight: 0.95, color: C.ink, letterSpacing: '-0.04em'}} />
        <div style={{paddingBottom: 26}}>
          <div style={{display: 'flex', gap: 6}}>
            {fills.map((f, i) => (
              <span key={i}>{Icon.star(f * prog(t, notaAt + 0.1 + i * 0.09, 0.35), 62)}</span>
            ))}
          </div>
          <div style={{...useEnter(notaAt + 0.2, 18, 0.5), fontFamily: sans, fontWeight: 500, fontSize: 50, color: C.ink, marginTop: 12}}>no Google</div>
        </div>
      </div>
      <div style={{...useEnter(avaliacoesAt, 18, 0.5), fontFamily: sans, fontSize: outra ? 56 : 58, color: C.support, marginTop: 20}}>
        <Counter to={avaliacoes} start={avaliacoesAt} dur={0.9} style={{color: C.accent, fontWeight: 600}} /> avaliações
      </div>
      {outra ? (
        <div style={{...useEnter(outra.at - 0.05, 18, 0.5), marginTop: 34, padding: '22px 26px', borderRadius: 12, background: C.card, border: `1.5px solid ${C.line}`}}>
          <div style={{fontFamily: sans, fontWeight: 600, fontSize: 40, color: C.ink}}>{outra.nome}</div>
          <div style={{fontFamily: sans, fontSize: 38, color: C.support, marginTop: 4}}>
            <span style={{color: C.accent, fontWeight: 600}}>{outra.nota} ★</span> · <Counter to={outra.avaliacoes} start={outra.contaAt} dur={0.7} style={{color: C.ink}} /> avaliações
          </div>
        </div>
      ) : null}
    </AccentPanel>
  );
};

// ---------- peças comuns das cenas ----------

export const Review: React.FC<{start: number; title: string; body: string; dim?: number}> = ({start, title, body, dim = 0}) => (
  <Card start={start} dim={dim} style={{padding: '32px 38px', marginTop: 26}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <span style={{fontFamily: mono, fontSize: 30, color: C.accent}}>avaliação no Google</span>
      <span style={{display: 'flex', gap: 2}}>{[0, 1, 2, 3, 4].map((i) => <span key={i}>{Icon.star(1, 30)}</span>)}</span>
    </div>
    <div style={{fontFamily: sans, fontWeight: 600, fontSize: 50, color: C.ink, lineHeight: 1.18, marginTop: 8}}>{title}</div>
    <div style={{fontFamily: sans, fontSize: 40, color: C.support, lineHeight: 1.25, marginTop: 4}}>{body}</div>
  </Card>
);

/** linha grande com ícone no círculo + título + subtítulo (selos, fatos) */
export const IconRow: React.FC<{start: number; icone: IconName; a: string; b: string}> = ({start, icone, a, b}) => (
  <div style={{...useEnter(start, 30, 0.5), display: 'flex', alignItems: 'center', gap: 30, padding: '36px 38px', marginBottom: 30, borderRadius: 14, background: C.card, border: `1.5px solid ${C.line}`}}>
    <div style={{width: 104, height: 104, borderRadius: 99, border: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: acc(0.06), flexShrink: 0}}>{icon(icone, 64)}</div>
    <div>
      <div style={{fontFamily: sans, fontWeight: 600, fontSize: 56, color: C.ink}}>{a}</div>
      <div style={{fontFamily: sans, fontSize: 38, color: C.support, marginTop: 4}}>{b}</div>
    </div>
  </div>
);

/** passos ligados por linha tracejada (indicação → busca → outra empresa) */
export const FlowSteps: React.FC<{passos: {at: number; icone: IconName; a: string; b: string; alerta?: boolean}[]}> = ({passos}) => (
  <>
    {passos.map((r, i) => (
      <React.Fragment key={r.a}>
        <div style={{...useEnter(r.at - 0.1, 30, 0.5), display: 'flex', alignItems: 'center', gap: 28, padding: '28px 32px', borderRadius: 14, background: r.alerta ? `rgba(${C.redRgb},0.08)` : C.card, border: `1.5px solid ${r.alerta ? `rgba(${C.redRgb},0.5)` : C.line}`}}>
          <div style={{width: 100, height: 100, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${C.lineSoft}`, flexShrink: 0}}>{icon(r.icone, 60, r.alerta ? C.red : undefined)}</div>
          <div>
            <div style={{fontFamily: sans, fontWeight: 600, fontSize: 50, color: C.ink}}>{r.a}</div>
            <div style={{fontFamily: sans, fontSize: 36, color: C.support, marginTop: 4}}>{r.b}</div>
          </div>
        </div>
        {i < passos.length - 1 ? <div style={{...useEnter(r.at + 0.3, 10, 0.4), height: 60, marginLeft: 82, borderLeft: `3px dashed ${C.line}`}} /> : null}
      </React.Fragment>
    ))}
  </>
);

export const FormatTile: React.FC<{start: number; icone: IconName; label: string}> = ({start, icone, label}) => (
  <div style={{...useEnter(start - 0.05, 26, 0.45), flex: 1, padding: '32px 18px', borderRadius: 12, background: C.card, border: `1.5px solid ${C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
    {icon(icone, 58)}
    <div style={{fontFamily: sans, fontWeight: 500, fontSize: 35, color: C.ink, textAlign: 'center', lineHeight: 1.15}}>{label}</div>
  </div>
);

/** cartão "exemplo" de anúncio por serviço e cidade, com Ligar e WhatsApp */
export const AdExample: React.FC<{start: number; svc: string; city: string; hi: number; call: number; wa: number; tag?: string}> = ({start, svc, city, hi, call, wa, tag = 'exemplo'}) => (
  <div style={{...useEnter(start, 30, 0.5), flex: 1, padding: '24px 24px 26px', borderRadius: 14, background: hi > 0.5 ? C.cardHi : C.card, border: `1.5px solid ${hi > 0.5 ? acc(0.75) : C.line}`}}>
    <div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{tag}</div>
    <div style={{fontFamily: sans, fontWeight: 600, fontSize: 38, color: C.ink, marginTop: 6, lineHeight: 1.12}}>{svc}</div>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6}}>
      {Icon.pin(30, C.accent)}
      <span style={{fontFamily: sans, fontSize: 31, color: C.support}}>{city}</span>
    </div>
    <div style={{display: 'flex', gap: 10, marginTop: 18}}>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 99, border: `1.5px solid ${C.accent}`, background: call > 0.5 ? C.accent : 'transparent', transform: `scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, call))})`}}>
        {Icon.call(28, call > 0.5 ? C.onAccent : C.accent)}
        <span style={{fontFamily: sans, fontWeight: 600, fontSize: 30, color: call > 0.5 ? C.onAccent : C.accent}}>Ligar</span>
      </div>
      <div style={{flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 99, border: `1.5px solid ${C.wa}`, background: wa > 0.5 ? C.wa : 'transparent'}}>
        {Icon.chat(28, wa > 0.5 ? '#062010' : C.wa)}
        <span style={{fontFamily: sans, fontWeight: 600, fontSize: 30, color: wa > 0.5 ? '#062010' : C.wa}}>WhatsApp</span>
      </div>
    </div>
  </div>
);

/** faixa de previsão (nunca um número exato) */
export const Bar: React.FC<{start: number; label: string; tag: string; w: number; color: string}> = ({start, label, tag, w, color}) => {
  const t = useT();
  const p = prog(t, start, 0.8, easeOut);
  return (
    <div style={{marginBottom: 18}}>
      <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginBottom: 6}}>{label}</div>
      <div style={{position: 'relative', height: 34, background: 'rgba(255,255,255,0.06)', borderRadius: 6}}>
        <div style={{position: 'absolute', left: `${w * 0.35 * p}%`, width: `${w * 0.4 * p}%`, top: 0, bottom: 0, background: color, borderRadius: 6, opacity: 0.85}} />
      </div>
      <div style={{fontFamily: sans, fontSize: 30, color: C.support, marginTop: 4}}>{tag}</div>
    </div>
  );
};

/** faixa de mapa estilizada com pinos (sem copiar a interface do Google) */
export const MapStrip: React.FC<{start: number; h?: number; hiFirst?: number; firstSpecial?: boolean}> = ({start, h = 100, hiFirst = 0, firstSpecial = false}) => {
  const t = useT();
  const o = prog(t, start, 0.5);
  const pins = [
    [120, 70],
    [300, 120],
    [420, 60],
    [560, 140],
    [250, 170],
    [470, 190],
  ] as [number, number][];
  const ky = (h - 12) / 230;
  return (
    <div style={{opacity: o, position: 'relative', height: h, borderRadius: 14, overflow: 'hidden', background: C.mapBg, border: `1.5px solid ${C.lineSoft}`}}>
      <svg width="100%" height={h} viewBox="0 0 680 230" preserveAspectRatio="none">
        <path d="M0 60 C150 80 260 30 420 70 S620 40 680 70" stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
        <path d="M0 170 C180 150 320 200 470 160 S620 190 680 180" stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" />
        <path d="M330 0 C320 60 360 130 340 230" stroke="rgba(255,255,255,0.09)" strokeWidth="16" fill="none" />
        <path d="M560 0 L600 230" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      </svg>
      {pins.map(([x, y], i) => {
        const p = prog(t, start + 0.2 + i * 0.08, 0.4, Easing.bezier(0.34, 1.6, 0.64, 1));
        const big = firstSpecial ? i === 0 : i < 3;
        const color = firstSpecial && i === 0 ? (hiFirst > 0.5 ? C.red : C.accentMid) : big ? C.accentMid : acc(0.5);
        return (
          <div key={i} style={{position: 'absolute', left: x * 1.25, top: y * ky + 6, transform: `translate(-50%,-100%) scale(${p})`}}>
            {Icon.pin(big ? 50 : 40, color)}
          </div>
        );
      })}
    </div>
  );
};

/** moldura de celular com cabeçalho mono (data e local da busca) */
export const PhoneFrame: React.FC<{start: number; cabecalho: [string, string]; children: React.ReactNode}> = ({start, cabecalho, children}) => (
  <div style={{...useEnter(start, 60, 0.7), borderRadius: 48, border: '3px solid rgba(255,255,255,0.18)', background: C.panelBg, padding: '26px 26px 30px', boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 30, color: C.dim, padding: '0 10px 12px'}}>
      <span>{cabecalho[0]}</span>
      <span>{cabecalho[1]}</span>
    </div>
    {children}
  </div>
);

/** linha tracejada vermelha "fim da tela" */
export const FimDaTela: React.FC<{start: number; texto?: string}> = ({start, texto = 'fim da tela'}) => {
  const t = useT();
  const lineY = prog(t, start - 0.1, 0.5, easeOut);
  return (
    <div style={{position: 'relative', marginTop: 26, height: 40}}>
      <div style={{position: 'absolute', left: 0, top: 18, height: 3, width: `${100 * lineY}%`, background: `repeating-linear-gradient(90deg, ${C.red} 0 18px, transparent 18px 30px)`}} />
      <div style={{...useEnter(start, 10, 0.4), position: 'absolute', right: 0, top: -8, fontFamily: mono, fontSize: 30, color: C.red, background: C.bg, padding: '2px 12px'}}>{texto}</div>
    </div>
  );
};

/** marca da Agência (os dois círculos), só aço e cobre */
export const BrandMark: React.FC<{start: number}> = ({start}) => (
  <svg width="96" height="60" viewBox="0 0 96 60" style={{...useEnter(start, 16, 0.5), flexShrink: 0}}>
    <circle cx="30" cy="30" r="28" fill={C.steel} />
    <circle cx="66" cy="30" r="18" fill={C.steel} />
    <clipPath id="brandc">
      <circle cx="30" cy="30" r="28" />
    </clipPath>
    <circle cx="66" cy="30" r="18" fill={C.copperLight} clipPath="url(#brandc)" />
  </svg>
);

/** cabeçalho mono de painel: "● título" à esquerda e algo apagado à direita */
export const PanelHead: React.FC<{left: React.ReactNode; right?: string; mb?: number}> = ({left, right, mb = 22}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: mono, fontSize: 30, color: C.support, marginBottom: mb}}>
    <span>{left}</span>
    {right ? <span style={{color: C.dim, whiteSpace: 'nowrap'}}>{right}</span> : null}
  </div>
);
export const Bullet: React.FC = () => <span style={{color: C.accent}}>● </span>;
