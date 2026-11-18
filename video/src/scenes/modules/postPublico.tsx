import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon, icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, Bullet, Card, Counter, FormatTile, IconRow, MonoTag, Pill, Stamp} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Selo} from './_comum';

// ---------- postPublico ----------
export type PostPublicoP = {
  id: 'postPublico';
  em: Q;
  /** linha mono acima do cartão: data e onde foi publicado */
  cabecalho: string;
  autor: string;
  autorEm: Q;
  tipo?: string;
  titulo: string;
  detalhe: string;
  destaque: string;
  destaqueEm: Q;
};
export const PostPublico: ModView<PostPublicoP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 540,
          saida: 'up',
          c: (
            <>
              <MonoTag start={q(p.em)} color={C.support}>
                {p.cabecalho}
              </MonoTag>
              <Card start={q(p.autorEm) - 0.1} style={{marginTop: 24, padding: '36px 40px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                  <div style={{width: 64, height: 64, borderRadius: 99, background: acc(0.14), border: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{Icon.person(38)}</div>
                  <div>
                    <div style={{fontFamily: sans, fontWeight: 600, fontSize: 38, color: C.ink}}>{p.autor}</div>
                    <div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{p.tipo ?? 'publicação pública'}</div>
                  </div>
                </div>
                <div style={{fontFamily: sans, fontWeight: 600, fontSize: 62, color: C.ink, marginTop: 26, lineHeight: 1.12}}>{p.titulo}</div>
                <div style={{fontFamily: sans, fontSize: 36, color: C.support, marginTop: 10}}>{p.detalhe}</div>
                <div style={{marginTop: 28}}>
                  <Pill start={q(p.destaqueEm)} fill color={C.accent} style={{fontSize: 40}}>
                    {p.destaque}
                  </Pill>
                </div>
              </Card>
            </>
          ),
        },
      ]}
    />
  );
};
