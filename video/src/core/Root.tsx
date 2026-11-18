import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {DURATION} from './lib';

const FPS = 30;
const props = {component: Video, durationInFrames: Math.ceil(DURATION * FPS), fps: FPS, width: 1080, height: 1920};

// `Exemplo` é o id que o kit-tools\produzir.ps1 renderiza; `Prospeccao` é um alias.
export const Root: React.FC = () => (
  <>
    <Composition id="Exemplo" {...props} />
    <Composition id="Prospeccao" {...props} />
  </>
);
