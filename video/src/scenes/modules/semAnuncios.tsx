import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon, icon} from '../../core/common';
import type {IconName} from '../../core/common';
import {AccentPanel, Bullet, Card, Counter, FormatTile, IconRow, MonoTag, Pill, Stamp} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Selo} from './_comum';

// ---------- semAnuncios ----------
export type SemAnunciosP = {
  id: 'semAnuncios';
  em: Q;
  dominio: string;
  zeroEm: Q;
  selos: Selo[];
};
export const SemAnuncios: ModView<SemAnunciosP> = ({p, ate}) => {
  const q = useQ();
  const z = q(p.zeroEm);
  const n0 = useEnter(z - 0.1, 30, 0.6);
  const lab = useEnter(z, 16, 0.45);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 480,
          saida: 'zoom',
          c: (
            <AccentPanel start={q(p.em)} style={{padding: '44px 46px 48px'}}>
              <div style={{fontFamily: mono, fontSize: 30, color: C.support}}>
                <Bullet />
                Central de Transparência de Anúncios do Google
              </div>
              <div style={{fontFamily: sans, fontWeight: 500, fontSize: 40, color: C.ink, marginTop: 12}}>{p.dominio}</div>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 22}}>
                <div style={{...n0, fontFamily: sans, fontWeight: 600, fontSize: 220, lineHeight: 0.9, color: C.accent}}>0</div>
                <div style={{...lab, fontFamily: sans, fontSize: 50, color: C.ink, paddingBottom: 24, lineHeight: 1.1}}>
                  anúncios
                  <br />
                  <span style={{color: C.support, fontSize: 40}}>encontrados</span>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginTop: 30}}>
                {p.selos.map((s) => (
                  <Stamp key={s.texto} start={q(s.em)} text={s.texto} hi={s.hi ?? 0} />
                ))}
              </div>
            </AccentPanel>
          ),
        },
      ]}
    />
  );
};
