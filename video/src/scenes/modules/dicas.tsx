// Módulo `dicas`: recebe os itens (normalmente 2) e mostra cada um numa tela com "dica N".
// Cada tipo de dica é um sub-bloco. A frase "Duas dicas de presente." é um módulo `frase` antes deste.
import React from 'react';
import {C, mono, sans} from '../../core/theme';
import {easeOut, prog, Telas, useEnter, useQ, useT} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, Arrow, Bullet, Card, MonoTag, Pill} from '../../parts';
import type {ModView} from '../../core/tipos';

type PillSpec = {texto: string; em: Q; tipo?: 'ok' | 'alerta'};
const Pills: React.FC<{pills: PillSpec[]; mt?: number}> = ({pills, mt = 22}) => {
  const q = useQ();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: mt}}>
      {pills.map((x) => (
        <Pill key={x.texto} start={q(x.em)} fill={x.tipo === 'ok'} color={x.tipo === 'ok' ? C.ok : C.red} style={{fontSize: 30}}>
          {x.texto}
        </Pill>
      ))}
    </div>
  );
};
const Final: React.FC<{texto: string; em: Q; size?: number}> = ({texto, em, size = 52}) => {
  const q = useQ();
  return (
    <div style={{...useEnter(q(em), 20, 0.5), display: 'flex', alignItems: 'center', gap: 18, marginTop: 40}}>
      {Icon.check(64, C.ok)}
      <span style={{fontFamily: sans, fontWeight: 600, fontSize: size, color: C.ink}}>{texto}</span>
    </div>
  );
};
const Head: React.FC<{left: string; right?: string; mb?: number}> = ({left, right, mb = 22}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: mono, fontSize: 30, color: C.support, marginBottom: mb}}>
    <span>
      <Bullet />
      {left}
    </span>
    {right ? <span style={{color: C.dim, whiteSpace: 'nowrap'}}>{right}</span> : null}
  </div>
);

// ---------- perfisDuplicados ----------
export type PerfisDuplicados = {
  tipo: 'perfisDuplicados';
  em: Q;
  painelEm: Q;
  cabecalho: string;
  data: string;
  perfis: {nome: string; nota: string; avaliacoes: string; telefone: string; horario: string; endereco: string}[];
  perfisEm: Q;
  telefonesEm: Q;
  horariosEm: Q;
  juntarEm: Q;
  pills: PillSpec[];
};
const PerfisDuplicadosV: React.FC<{d: PerfisDuplicados}> = ({d}) => {
  const t = useT();
  const q = useQ();
  const merge = prog(t, q(d.juntarEm), 0.7, easeOut);
  return (
    <>
      <AccentPanel start={q(d.painelEm)} style={{padding: '40px 40px', marginTop: 18}}>
        <Head left={d.cabecalho} right={d.data} />
        {d.perfis.map((pf, i) => (
          <PerfilCard key={pf.nome} p={pf} st={q(d.perfisEm) + i * 0.25} gone={i > 0 ? merge : 0} merged={i === 0 ? merge : 0} tPhone={q(d.telefonesEm)} tHour={q(d.horariosEm)} />
        ))}
      </AccentPanel>
      <Pills pills={d.pills} />
    </>
  );
};
const PerfilCard: React.FC<{p: PerfisDuplicados['perfis'][number]; st: number; gone: number; merged: number; tPhone: number; tHour: number}> = ({p, st, gone, merged, tPhone, tHour}) => {
  const t = useT();
  const enter = useEnter(st, 22, 0.45);
  const good = merged > 0.5;
  const tag = (txt: string, s0: number) => (
    <span style={{fontFamily: mono, fontSize: 30, padding: '6px 14px', borderRadius: 8, color: good ? C.ok : C.red, border: `1.5px solid ${good ? `rgba(${C.okRgb},0.6)` : `rgba(${C.redRgb},0.55)`}`, opacity: prog(t, s0, 0.3)}}>{txt}</span>
  );
  return (
    <div style={{...enter, opacity: (enter.opacity as number) * (1 - 0.8 * gone), transform: `translateY(${-70 * gone}px) scale(${1 - 0.06 * gone})`, padding: '24px 26px', marginBottom: 16, borderRadius: 12, background: good ? `rgba(${C.okRgb},0.07)` : C.card, border: `1.5px solid ${good ? `rgba(${C.okRgb},0.55)` : C.lineSoft}`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12}}>
        <span style={{fontFamily: sans, fontWeight: 600, fontSize: 36, color: C.ink, whiteSpace: 'nowrap'}}>{p.nome}</span>
        <span style={{fontFamily: sans, fontSize: 30, color: C.support, whiteSpace: 'nowrap'}}>
          <span style={{color: C.accent}}>{p.nota} ★</span> · {p.avaliacoes}
        </span>
      </div>
      <div style={{fontFamily: sans, fontSize: 30, color: C.support, marginTop: 6}}>{p.endereco}</div>
      <div style={{display: 'flex', gap: 14, marginTop: 14}}>
        {tag(p.telefone, tPhone)}
        {tag(p.horario, tHour)}
      </div>
    </div>
  );
};

// ---------- erroNaDescricao ----------
export type ErroNaDescricao = {
  tipo: 'erroNaDescricao';
  em: Q;
  painelEm: Q;
  cabecalho?: string;
  dominio: string;
  titulo: string;
  antes: string;
  erro: string;
  certo: string;
  depois: string;
  erroEm: Q;
  corrigirEm: Q;
  pills: PillSpec[];
  final?: {texto: string; em: Q};
};
const ErroNaDescricaoV: React.FC<{d: ErroNaDescricao}> = ({d}) => {
  const t = useT();
  const q = useQ();
  const fix = prog(t, q(d.corrigirEm), 0.6, easeOut);
  return (
    <>
      <AccentPanel start={q(d.painelEm)} style={{padding: '40px 42px', marginTop: 18}}>
        <Head left={d.cabecalho ?? 'descrição do site no Google'} mb={18} />
        <div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{d.dominio}</div>
        <div style={{fontFamily: sans, fontWeight: 600, fontSize: 40, color: C.ink, marginTop: 8, lineHeight: 1.2}}>{d.titulo}</div>
        <div style={{fontFamily: sans, fontSize: 36, color: C.ink2, marginTop: 14, lineHeight: 1.35}}>
          {d.antes}
          <span style={{position: 'relative', fontWeight: 600, color: fix > 0.5 ? C.ok : C.red}}>
            {fix > 0.5 ? d.certo : d.erro}
            <span style={{position: 'absolute', left: 0, right: 0, bottom: -4, height: 3, borderRadius: 2, background: fix > 0.5 ? C.ok : C.red, opacity: prog(t, q(d.erroEm), 0.3)}} />
          </span>
          {d.depois}
        </div>
      </AccentPanel>
      <Pills pills={d.pills} mt={26} />
      {d.final ? <Final texto={d.final.texto} em={d.final.em} /> : null}
    </>
  );
};

// ---------- errosDeDigitacao ----------
export type ErrosDeDigitacao = {
  tipo: 'errosDeDigitacao';
  em: Q;
  painelEm: Q;
  cabecalho: string;
  data: string;
  linhas: {antes: string; erro: string; depois: string; certo: string}[];
  linhasEm: Q;
  erroEm: Q;
  corrigirEm: Q;
  pills: PillSpec[];
};
const ErrosDeDigitacaoV: React.FC<{d: ErrosDeDigitacao}> = ({d}) => {
  const t = useT();
  const q = useQ();
  return (
    <>
      <AccentPanel start={q(d.painelEm)} style={{padding: '44px 44px', marginTop: 18}}>
        <Head left={d.cabecalho} right={d.data} mb={20} />
        {d.linhas.map((r, i) => {
          const fx = prog(t, q(d.corrigirEm) + i * 0.12, 0.5, easeOut);
          return (
            <TypoRow key={i} start={q(d.linhasEm) + i * 0.18} last={i === d.linhas.length - 1}>
              {r.antes}
              <span style={{position: 'relative', color: fx > 0.5 ? C.ok : C.red, fontWeight: 600}}>
                {fx > 0.5 ? r.certo : r.erro}
                <span style={{position: 'absolute', left: 0, right: 0, bottom: -4, height: 3, background: fx > 0.5 ? C.ok : C.red, opacity: prog(t, q(d.erroEm) + i * 0.1, 0.3), borderRadius: 2}} />
              </span>
              {r.depois}
            </TypoRow>
          );
        })}
      </AccentPanel>
      <Pills pills={d.pills} mt={26} />
    </>
  );
};
const TypoRow: React.FC<{start: number; last: boolean; children: React.ReactNode}> = ({start, last, children}) => (
  <div style={{...useEnter(start, 18, 0.4), padding: '24px 0', borderBottom: last ? 'none' : `1px solid ${C.lineSoft}`}}>
    <span style={{fontFamily: sans, fontSize: 40, color: C.ink2}}>{children}</span>
  </div>
);

// ---------- telefonesDiferentes ----------
export type TelefonesDiferentes = {
  tipo: 'telefonesDiferentes';
  em: Q;
  onde1: string;
  tel1: string;
  cardEm: Q;
  onde2: string;
  tel2: string;
  diferenteEm: Q;
  juntarEm: Q;
  final?: string;
};
const TelefonesDiferentesV: React.FC<{d: TelefonesDiferentes}> = ({d}) => {
  const t = useT();
  const q = useQ();
  const merge = prog(t, q(d.juntarEm), 0.6, easeOut);
  const eq = useEnter(q(d.diferenteEm), 10, 0.4);
  return (
    <>
      <Card start={q(d.cardEm)} style={{marginTop: 18, padding: '30px 36px'}}>
        <div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{d.onde1}</div>
        <div style={{fontFamily: sans, fontWeight: 600, fontSize: 72, color: C.ink, marginTop: 4}}>{d.tel1}</div>
      </Card>
      <div style={{...eq, textAlign: 'center', fontFamily: sans, fontWeight: 600, fontSize: 64, color: merge > 0.5 ? C.ok : C.red, margin: '10px 0'}}>{merge > 0.5 ? '=' : '≠'}</div>
      <Card start={q(d.diferenteEm)} style={{padding: '30px 36px', borderColor: merge > 0.5 ? `rgba(${C.okRgb},0.6)` : `rgba(${C.redRgb},0.55)`}}>
        <div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{d.onde2}</div>
        <div style={{position: 'relative', height: 80, marginTop: 4}}>
          <div style={{position: 'absolute', fontFamily: sans, fontWeight: 600, fontSize: 64, color: C.red, opacity: 1 - merge}}>{d.tel2}</div>
          <div style={{position: 'absolute', fontFamily: sans, fontWeight: 600, fontSize: 64, color: C.ok, opacity: merge}}>{d.tel1}</div>
        </div>
      </Card>
      <Final texto={d.final ?? 'Um número só, em todo lugar.'} em={d.juntarEm} size={54} />
    </>
  );
};

// ---------- antes e depois (horarioDoAnuncio, criarPerfilDaUnidade, whatsappNoPerfil) ----------
/** Dica simples de antes e depois. Use `exemplo: true` quando a tela mostrar dado fictício. */
export type AntesDepois = {
  tipo: 'horarioDoAnuncio' | 'criarPerfilDaUnidade' | 'whatsappNoPerfil';
  em: Q;
  painelEm: Q;
  cabecalho: string;
  exemplo?: boolean;
  antes: {rotulo: string; valor: string};
  depois: {rotulo: string; valor: string};
  trocaEm: Q;
  final?: {texto: string; em: Q};
};
const AntesDepoisV: React.FC<{d: AntesDepois}> = ({d}) => {
  const q = useQ();
  return (
    <>
      <AccentPanel start={q(d.painelEm)} style={{padding: '40px 42px', marginTop: 18}}>
        <Head left={d.cabecalho} right={d.exemplo ? 'exemplo' : undefined} />
        <Card start={q(d.painelEm) + 0.2} style={{padding: '26px 30px', borderColor: `rgba(${C.redRgb},0.55)`}}>
          <div style={{fontFamily: mono, fontSize: 30, color: C.red}}>{d.antes.rotulo}</div>
          <div style={{fontFamily: sans, fontWeight: 600, fontSize: 44, color: C.ink, marginTop: 6, lineHeight: 1.2}}>{d.antes.valor}</div>
        </Card>
        <Arrow start={q(d.trocaEm) - 0.2} />
        <Card start={q(d.trocaEm)} style={{padding: '26px 30px', borderColor: `rgba(${C.okRgb},0.6)`, background: `rgba(${C.okRgb},0.07)`}}>
          <div style={{fontFamily: mono, fontSize: 30, color: C.ok}}>{d.depois.rotulo}</div>
          <div style={{fontFamily: sans, fontWeight: 600, fontSize: 44, color: C.ink, marginTop: 6, lineHeight: 1.2}}>{d.depois.valor}</div>
        </Card>
      </AccentPanel>
      {d.final ? <Final texto={d.final.texto} em={d.final.em} /> : null}
    </>
  );
};

// ---------- módulo ----------
export type Dica = PerfisDuplicados | ErroNaDescricao | ErrosDeDigitacao | TelefonesDiferentes | AntesDepois;
export type DicasP = {id: 'dicas'; em: Q; itens: Dica[]};
const TOP: Record<Dica['tipo'], number> = {perfisDuplicados: 420, erroNaDescricao: 480, errosDeDigitacao: 470, telefonesDiferentes: 500, horarioDoAnuncio: 460, criarPerfilDaUnidade: 460, whatsappNoPerfil: 460};

const DicaV: React.FC<{d: Dica}> = ({d}) => {
  switch (d.tipo) {
    case 'perfisDuplicados':
      return <PerfisDuplicadosV d={d} />;
    case 'erroNaDescricao':
      return <ErroNaDescricaoV d={d} />;
    case 'errosDeDigitacao':
      return <ErrosDeDigitacaoV d={d} />;
    case 'telefonesDiferentes':
      return <TelefonesDiferentesV d={d} />;
    default:
      return <AntesDepoisV d={d} />;
  }
};

export const Dicas: ModView<DicasP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={p.itens.map((d, i) => ({
        em: i === 0 ? p.em : d.em,
        top: TOP[d.tipo],
        saida: i < p.itens.length - 1 ? ('up' as const) : undefined,
        c: (
          <>
            <MonoTag start={q(d.em)}>{p.itens.length > 1 ? `dica ${i + 1}` : 'dica de presente'}</MonoTag>
            <DicaV d={d} />
          </>
        ),
      }))}
    />
  );
};
