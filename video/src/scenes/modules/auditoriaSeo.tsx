import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon} from '../../core/common';
import {AccentPanel, Bullet, Card, MonoTag} from '../../parts';
import type {ModView} from '../../core/tipos';
import {PillX} from './_comum';
import type {PillSpec} from './_comum';

// ---------- auditoriaSeo ----------
/**
 * Checklist de SEO (perfil do Google ou site): cada item acende quando falado, com status
 * ok (verde), falta (vermelho) ou pouco (cor do lead). Opcional: 2ª tela com o que o Google
 * diz (citação curta + fonte na tela, regra 6 do guia).
 */
export type ItemSeo = {texto: string; detalhe?: string; status: 'ok' | 'falta' | 'pouco'; em: Q};
export type AuditoriaSeoP = {
  id: 'auditoriaSeo';
  em: Q;
  cabecalho: string;
  data?: string;
  itens: ItemSeo[];
  pills?: PillSpec[];
  top?: number;
  google?: {em: Q; titulo: string; citacao: string; citacaoEm: Q; fonte: string; pills?: PillSpec[]};
};

const Mark: React.FC<{s: ItemSeo['status']}> = ({s}) => {
  const cor = s === 'ok' ? C.ok : s === 'falta' ? C.red : C.accent;
  return (
    <div style={{width: 64, height: 64, borderRadius: 99, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${cor}`, background: s === 'ok' ? `rgba(${C.okRgb},0.12)` : s === 'falta' ? `rgba(${C.redRgb},0.10)` : acc(0.1)}}>
      {s === 'ok' ? Icon.check(36, cor) : s === 'falta' ? Icon.x(32, cor) : <span style={{fontFamily: sans, fontWeight: 700, fontSize: 40, color: cor, lineHeight: 1}}>!</span>}
    </div>
  );
};

const Row: React.FC<{it: ItemSeo; start: number}> = ({it, start}) => {
  const st = useEnter(start, 24, 0.45);
  return (
    <div style={{...st, display: 'flex', alignItems: 'center', gap: 26, padding: '18px 0', borderBottom: `1px solid ${C.line}`}}>
      <Mark s={it.status} />
      <div>
        <div style={{fontFamily: sans, fontWeight: 600, fontSize: 42, color: C.ink, lineHeight: 1.15}}>{it.texto}</div>
        {it.detalhe ? <div style={{fontFamily: mono, fontSize: 30, color: C.support, marginTop: 4}}>{it.detalhe}</div> : null}
      </div>
    </div>
  );
};

export const AuditoriaSeo: ModView<AuditoriaSeoP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: p.top ?? 360,
          saida: 'up',
          c: (
            <>
              <AccentPanel start={q(p.em)} style={{padding: '34px 42px 30px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 30, color: C.support}}>
                  <span>
                    <Bullet />
                    {p.cabecalho}
                  </span>
                  {p.data ? <span>{p.data}</span> : null}
                </div>
                <div style={{marginTop: 10}}>
                  {p.itens.map((it) => (
                    <Row key={it.texto} it={it} start={q(it.em) - 0.05} />
                  ))}
                </div>
              </AccentPanel>
              {p.pills ? (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 26}}>
                  {p.pills.map((x) => (
                    <PillX key={x.texto} p={x} />
                  ))}
                </div>
              ) : null}
            </>
          ),
        },
        p.google
          ? {
              em: p.google.em,
              top: 520,
              saida: 'zoom',
              c: (
                <>
                  <MonoTag start={q(p.google.em)} color={C.support} style={{marginBottom: 22}}>
                    {p.google.titulo}
                  </MonoTag>
                  <Card start={q(p.google.citacaoEm)} style={{padding: '40px 44px', borderColor: acc(0.5)}}>
                    <div style={{fontFamily: sans, fontWeight: 500, fontSize: 50, color: C.ink, lineHeight: 1.25}}>“{p.google.citacao}”</div>
                    <div style={{fontFamily: mono, fontSize: 30, color: C.dim, marginTop: 22}}>{p.google.fonte}</div>
                  </Card>
                  {p.google.pills ? (
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 30}}>
                      {p.google.pills.map((x) => (
                        <PillX key={x.texto} p={x} />
                      ))}
                    </div>
                  ) : null}
                </>
              ),
            }
          : null,
      ]}
    />
  );
};
