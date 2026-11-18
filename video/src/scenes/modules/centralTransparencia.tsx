import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon, icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, Bullet, Card, Counter, FormatTile, IconRow, MonoTag, Pill, Stamp} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Selo} from './_comum';

// ---------- centralTransparencia ----------
export type CentralTransparenciaP = {
  id: 'centralTransparencia';
  em: Q;
  dominio: string;
  anuncios: number;
  anunciosEm: Q;
  /** quando a palavra "anúncios" aparece ao lado do número */
  rotuloEm: Q;
  periodo: string;
  selo: Selo;
  formatos?: {icone: IconName; rotulo: string; em: Q}[];
};
export const CentralTransparencia: ModView<CentralTransparenciaP> = ({p, ate}) => {
  const q = useQ();
  const lab = useEnter(q(p.rotuloEm), 16, 0.45);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 450,
          saida: 'zoom',
          c: (
            <AccentPanel start={q(p.em)} style={{padding: '44px 46px 48px'}}>
              <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>
                <Bullet />
                Central de Transparência de Anúncios do Google
              </div>
              <div style={{fontFamily: sans, fontWeight: 500, fontSize: 40, color: C.ink, marginTop: 10}}>{p.dominio}</div>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 26}}>
                <Counter to={p.anuncios} start={q(p.anunciosEm)} dur={0.7} style={{fontFamily: sans, fontWeight: 600, fontSize: 210, lineHeight: 0.9, color: C.accent}} />
                <div style={{...lab, fontFamily: sans, fontSize: 50, color: C.ink, paddingBottom: 22, lineHeight: 1.1}}>
                  anúncios
                  <br />
                  <span style={{color: C.support, fontSize: 40}}>{p.periodo}</span>
                </div>
              </div>
              <div style={{marginTop: 24}}>
                <Stamp start={q(p.selo.em)} text={p.selo.texto} hi={p.selo.hi ?? 1} />
              </div>
              {p.formatos ? (
                <div style={{display: 'flex', gap: 18, marginTop: 34}}>
                  {p.formatos.map((f) => (
                    <FormatTile key={f.rotulo} start={q(f.em)} icone={f.icone} label={f.rotulo} />
                  ))}
                </div>
              ) : null}
            </AccentPanel>
          ),
        },
      ]}
    />
  );
};
