import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Background, Cursor, Subtitles, TopLabel} from './common';
import {CenaCtx, qAt, SCENES} from './lib';
import {SceneWrap} from '../parts';
import {CENAS} from '../lead';
import type {Cena} from './tipos';
import {completar} from '../scenes/catalogo';
import {REGISTRO} from '../scenes/registro';

// O vídeo é montado a partir de CENAS (lead.ts). O número da cena (at(cena, 'frase'), rótulo "// NN"
// e voz\cenaN.txt) é a posição na lista.

const CenaView: React.FC<{i: number; cena: Cena}> = ({i, cena}) => {
  const s = i + 1;
  const mods = cena.modulos.map((m) => completar(m));
  const starts = mods.map((m) => qAt(s, (m as {em?: number | string}).em ?? 0));
  return (
    <CenaCtx.Provider value={s}>
      <SceneWrap i={i}>
        {mods.map((m, k) => {
          const View = REGISTRO[m.id];
          if (!View) throw new Error(`módulo desconhecido na cena ${s}: "${m.id}" (registre em scenes/registro.tsx)`);
          return <View key={k} p={m} ate={k < mods.length - 1 ? starts[k + 1] - 0.3 : undefined} />;
        })}
        {cena.cursor ? <Cursor until={qAt(s, cena.cursor.ateEm)} keys={cena.cursor.pontos.map((k) => ({t: qAt(s, k.em), x: k.x, y: k.y, click: k.clique}))} /> : null}
      </SceneWrap>
    </CenaCtx.Provider>
  );
};

export const Video: React.FC = () => {
  if (SCENES.length !== CENAS.length) {
    throw new Error(`a timeline tem ${SCENES.length} cenas e o lead.ts tem ${CENAS.length}: rode produzir.ps1 -Etapa montar depois de gravar todas as cenaN.txt`);
  }
  return (
    <AbsoluteFill>
      <Background />
      {CENAS.map((c, i) => (
        <CenaView key={i} i={i} cena={c} />
      ))}
      <TopLabel />
      <Subtitles />
      <Audio src={staticFile('narracao.wav')} />
    </AbsoluteFill>
  );
};
