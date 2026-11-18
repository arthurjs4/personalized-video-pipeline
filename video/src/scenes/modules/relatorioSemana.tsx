import React from 'react';
import {acc, C, mono, sans} from '../../core/theme';
import {Telas, useEnter, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Icon} from '../../core/common';
import type {ModView} from '../../core/tipos';

// ---------- relatorioSemana (v3, 14/11/2026) ----------
/**
 * Cartão "O que a IA fez esta semana" (relatório de segunda), SEMPRE com o selo "exemplo".
 * Entra como 2ª tela da cena 8, depois do `controle`, quando a voz diz "Toda segunda".
 * Não acrescenta voz: usa a frase do relatório que já está no texto do controle.
 */
export type RelatorioSemanaP = {
  id: 'relatorioSemana';
  em: Q;
  titulo?: string;
  /** números de exemplo (nunca de cliente real) */
  itens?: {numero: string; texto: string}[];
  /** rodapé ("relatório de segunda · WhatsApp") */
  rodape?: string;
};

export const RelatorioSemana: ModView<RelatorioSemanaP> = ({p, ate}) => {
  const q = useQ();
  const s = q(p.em);
  const card = useEnter(s - 0.05, 40, 0.55);
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 380,
          saida: 'zoom',
          c: (
            <div style={{...card, padding: '38px 40px 40px', borderRadius: 22, background: C.panelBg, border: `1.5px solid ${acc(0.55)}`, boxShadow: '0 40px 90px rgba(0,0,0,0.5)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  {Icon.chat(40, C.wa)}
                  <span style={{fontFamily: mono, fontSize: 30, color: C.support}}>{p.rodape}</span>
                </div>
                <span style={{fontFamily: mono, fontSize: 30, color: C.onAccent, background: C.accent, padding: '4px 14px', borderRadius: 8}}>exemplo</span>
              </div>
              <div style={{fontFamily: sans, fontWeight: 600, fontSize: 54, color: C.ink, marginTop: 24, lineHeight: 1.12}}>{p.titulo}</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30}}>
                {p.itens!.map((it, i) => (
                  <Linha key={i} start={s + 0.35 + i * 0.4} numero={it.numero} texto={it.texto} />
                ))}
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

const Linha: React.FC<{start: number; numero: string; texto: string}> = ({start, numero, texto}) => {
  const st = useEnter(start, 20, 0.4);
  return (
    <div style={{...st, display: 'flex', alignItems: 'center', gap: 26, padding: '16px 22px', borderRadius: 12, background: C.card, border: `1.5px solid ${C.lineSoft}`}}>
      <div style={{fontFamily: sans, fontWeight: 700, fontSize: 64, color: C.accent, minWidth: 130, textAlign: 'right', lineHeight: 1}}>{numero}</div>
      <div style={{fontFamily: sans, fontSize: 38, color: C.ink2, lineHeight: 1.18}}>{texto}</div>
    </div>
  );
};
