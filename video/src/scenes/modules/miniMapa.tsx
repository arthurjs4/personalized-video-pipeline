import React from 'react';
import {C} from '../../core/theme';
import {Panel, Telas, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {Dashed, MiniMap, QueryTitle} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Linha} from './frase';
import {Lines} from './_comum';

// ---------- miniMapa ----------
/**
 * O bloco do mapa resumido: a busca, as 3 vagas do mapa (com os nomes do print ou "outra empresa")
 * e o tracejado "vocês não estão aqui". Serve para a dor (cena 4) quando o print é simples.
 */
export type MiniMapaP = {
  id: 'miniMapa';
  em: Q;
  /** frase grande acima do mapa (opcional) */
  linhas?: Linha[];
  busca: string;
  buscaEm?: Q;
  mapaEm: Q;
  /** os nomes do print, na ordem; sem nomes = "outra empresa" */
  nomes?: string[];
  titulo?: string;
  tracejado?: {texto: string; em: Q};
  top?: number;
};

export const MiniMapa: ModView<MiniMapaP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: p.top ?? 420,
          c: (
            <>
              {p.linhas ? <Lines linhas={p.linhas} em={p.em} /> : null}
              <Panel start={q(p.buscaEm ?? p.em)} style={{marginTop: p.linhas ? 50 : 0, padding: '32px 32px 36px'}}>
                <QueryTitle start={q(p.buscaEm ?? p.em)} text={p.busca} />
                <MiniMap start={q(p.mapaEm)} nomes={p.nomes} titulo={p.titulo ?? 'mapa · 3 empresas'} n={p.nomes?.length ?? 3} />
                {p.tracejado ? (
                  <div style={{marginTop: 22}}>
                    <Dashed start={q(p.tracejado.em)} text={p.tracejado.texto} size={36} color={C.red} />
                  </div>
                ) : null}
              </Panel>
            </>
          ),
        },
      ]}
    />
  );
};
