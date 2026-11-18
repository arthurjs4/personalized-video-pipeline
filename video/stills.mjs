// Renderiza varios quadros com um unico bundle: node stills.mjs out_dir t1 t2 ... (segundos). SCALE=1 para resolucao cheia.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Exemplo'});
for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * 30));
  const output = path.join(outDir, `f_${String(s).replace('.', '_')}.png`);
  await renderStill({composition, serveUrl, output, frame, scale: parseFloat(process.env.SCALE || '0.5')});
  console.log('ok', s, output);
}

