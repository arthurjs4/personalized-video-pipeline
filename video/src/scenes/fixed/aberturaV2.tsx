import React from 'react';
import {C} from '../../core/theme';
import {easeOut, Line, prog, Telas, useQ, useT} from '../../core/lib';
import type {Q} from '../../core/lib';
import {MonoTag, SearchBar, typed, Avatar} from '../../parts';
import type {ModView} from '../../core/tipos';

/** v2 (até 13/11/2026), usada pelos exemplos. Cena fixa 1: "Oi, [nome]", Avatar, busca digitando o nome da empresa, "menos de 4 minutos". */
export type AberturaV2P = {
  id: 'aberturaV2';
  em?: Q;
  /** como o Avatar chama o decisor */
  nome: string;
  /** texto digitado na busca (nome da empresa, minúsculo) */
  busca: string;
  /** nome curto da empresa em destaque */
  destaque: string;
  destaqueSize?: number;
  /** "como a" / "como o" antes do destaque */
  comoTexto?: string;
  nomeEm?: Q;
  aquiEm?: Q;
  agenteEm?: Q;
  euEm?: Q;
  pesquisouEm?: Q;
  googleEm?: Q;
  comoEm?: Q;
  destaqueEm?: Q;
  apareceEm?: Q;
  saoEm?: Q;
  quatroEm?: Q;
  minutosEm?: Q;
};

export const AberturaV2: ModView<AberturaV2P> = ({p, ate}) => {
  const t = useT();
  const q = useQ();
  const sharp = prog(t, q(p.pesquisouEm!) - 0.2, 0.7, easeOut);
  return (
    <>
      <Telas
        ate={ate}
        telas={[
          {
            em: p.em ?? 0,
            top: 560,
            saida: 'up',
            c: (
              <>
                <Line start={0.3} parts={[['Oi,', 's'], [`${p.nome}.`, 'k']]} size={88} keySize={170} />
                <Line start={q(p.aquiEm!)} parts={[['Aqui é o', 's'], ['Avatar,', 'w']]} size={64} style={{marginTop: 46}} />
                <Line start={q(p.agenteEm!)} parts={[['agente da', 's'], ['Agência Exemplo.', 'a']]} size={64} keySize={64} />
              </>
            ),
          },
          {
            em: p.euEm!,
            top: 480,
            saida: 'blur',
            c: (
              <>
                <MonoTag start={q(p.euEm!)} color={C.support} style={{fontSize: 32}}>
                  trabalho com o <span style={{color: C.accent}}>Ana</span>, da Agência Exemplo
                </MonoTag>
                <div style={{marginTop: 46, opacity: 0.35 + 0.65 * sharp, filter: `blur(${5 * (1 - sharp)}px)`}}>
                  <SearchBar text={typed(p.busca, t, q(p.pesquisouEm!), 18)} focus={sharp} size={38} caret={t < q(p.googleEm!)} />
                </div>
                <Line start={q(p.comoEm!)} parts={[[p.comoTexto ?? 'como a', 's']]} size={64} style={{marginTop: 56}} />
                <Line start={q(p.destaqueEm!)} parts={[[p.destaque, 'a']]} keySize={p.destaqueSize ?? 140} />
                <Line start={q(p.apareceEm!)} parts={[['aparece hoje', 'w'], ['no Google.', 's']]} size={66} />
              </>
            ),
          },
          {
            em: p.saoEm!,
            top: 600,
            c: (
              <>
                <Line start={q(p.saoEm!)} parts={[['Menos de', 's']]} size={70} />
                <Line start={q(p.quatroEm!)} parts={[['4 minutos.', 'k']]} keySize={176} />
                <Bar4 em={p.minutosEm!} />
              </>
            ),
          },
        ]}
      />
      <Avatar x={270} y={1300} size={200} start={q(p.aquiEm!) - 0.15} />
    </>
  );
};

const Bar4: React.FC<{em: Q}> = ({em}) => {
  const t = useT();
  const q = useQ();
  const s = q(em);
  const o = prog(t, s + 0.1, 0.5 * 0.6);
  return (
    <div style={{opacity: o, marginTop: 40, height: 6, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 4}}>
      <div style={{height: '100%', width: `${100 * prog(t, s, 1.2, easeOut)}%`, background: C.accent, borderRadius: 4}} />
    </div>
  );
};
