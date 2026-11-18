import React from 'react';
import {Line, Telas, useQ} from '../../core/lib';
import type {Q} from '../../core/lib';
import {RouteMap} from '../../parts';
import type {ModView} from '../../core/tipos';
import type {Linha} from './frase';

// ---------- rotaMapa ----------
/**
 * Mapa com a rota entre 2 cidades: a cidade onde o cliente procura (sem perfil ou sem o lead no mapa)
 * e a cidade do único perfil, com o tempo de carro. Serve para "várias unidades ou cidades".
 * O mesmo desenho fecha o `unidadeSemPerfil`; aqui ele entra sozinho.
 */
export type RotaMapaP = {
  id: 'rotaMapa';
  em: Q;
  rotaEm: Q;
  cardEm: Q;
  escritorioEm: Q;
  perdidoEm: Q;
  /** cidade onde a pessoa procura */
  cidadeA: string;
  /** cidade do perfil que existe */
  cidadeB: string;
  escritorio: {titulo: string; texto: string};
  /** "1h28 de carro" (fonte: rota do Google Maps, com data no 02-pesquisa) */
  tempo: string;
  perdido?: string;
  unico?: string;
  linha?: Linha;
};

export const RotaMapa: ModView<RotaMapaP> = ({p, ate}) => {
  const q = useQ();
  return (
    <Telas
      ate={ate}
      telas={[
        {
          em: p.em,
          top: 330,
          c: (
            <>
              <RouteMap
                start={q(p.em) - 0.1}
                routeAt={q(p.rotaEm)}
                cardBAt={q(p.cardEm)}
                officeAt={q(p.escritorioEm)}
                lostAt={q(p.perdidoEm)}
                cidadeA={p.cidadeA}
                cidadeB={p.cidadeB}
                escritorio={p.escritorio}
                perdido={p.perdido ?? 'quem procura no Google não chega aqui'}
                tempo={p.tempo}
                unico={p.unico ?? 'o único perfil no Google'}
              />
              {p.linha ? <Line start={q(p.linha.em ?? p.em)} parts={p.linha.t} size={p.linha.size ?? 52} keySize={p.linha.keySize} style={{marginTop: 10}} /> : null}
            </>
          ),
        },
      ]}
    />
  );
};
