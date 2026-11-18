import * as Poppins from '@remotion/google-fonts/Poppins';
import * as Jost from '@remotion/google-fonts/Jost';
import * as DMSans from '@remotion/google-fonts/DMSans';
import * as Montserrat from '@remotion/google-fonts/Montserrat';
import * as Inter from '@remotion/google-fonts/Inter';
import * as Lato from '@remotion/google-fonts/Lato';
import * as OpenSans from '@remotion/google-fonts/OpenSans';
import * as Raleway from '@remotion/google-fonts/Raleway';
import * as Nunito from '@remotion/google-fonts/Nunito';
import * as Roboto from '@remotion/google-fonts/Roboto';
import * as Outfit from '@remotion/google-fonts/Outfit';
import * as Manrope from '@remotion/google-fonts/Manrope';
import * as GeistMono from '@remotion/google-fonts/GeistMono';
import * as CormorantGaramond from '@remotion/google-fonts/CormorantGaramond';
import * as Fraunces from '@remotion/google-fonts/Fraunces';
import * as PlayfairDisplay from '@remotion/google-fonts/PlayfairDisplay';
import {LEAD} from '../lead';
import {hexToRgb, mix, rgbStr} from './cor';

// Cor e fonte do vídeo vêm SÓ daqui, e os valores vêm do LEAD.tema (lead.ts).
// Nenhum módulo escreve cor de destaque à mão: use C.accent ou acc(alfa).

type FontMod = {loadFont: (style?: any, opts?: any) => {fontFamily: string}; getInfo: () => {fonts: Record<string, Record<string, unknown>>}};
const SANS: Record<string, FontMod> = {Poppins, Jost, DMSans, Montserrat, Inter, Lato, OpenSans, Raleway, Nunito, Roboto, Outfit, Manrope} as unknown as Record<string, FontMod>;
const SERIF: Record<string, FontMod> = {CormorantGaramond, Fraunces, PlayfairDisplay} as unknown as Record<string, FontMod>;

const load = (mod: FontMod | undefined, nome: string, style: 'normal' | 'italic', weights: string[]) => {
  if (!mod) throw new Error(`fonte não suportada no theme.ts: ${nome}`);
  const disp = Object.keys(mod.getInfo().fonts[style] ?? {});
  const w = weights.filter((x) => disp.includes(x));
  return mod.loadFont(style, {weights: w.length ? w : [disp[0]], subsets: ['latin', 'latin-ext']}).fontFamily;
};

const T = LEAD.tema;
export const sans = load(SANS[T.fonteTitulo ?? 'Poppins'], T.fonteTitulo ?? 'Poppins', 'normal', ['300', '400', '500', '600', '700']);
export const mono = load(GeistMono as unknown as FontMod, 'GeistMono', 'normal', ['400', '500']);
export const serif = load(SERIF[T.fonteSerifa ?? 'CormorantGaramond'], T.fonteSerifa ?? 'CormorantGaramond', 'italic', ['300', '500']);

const accent = T.accent;
const bg = T.fundo;
export const C = {
  bg,
  bg2: T.fundo2 ?? mix(bg, '#FFFFFF', 0.04),
  accent,
  accentRgb: T.accentRgb ?? rgbStr(accent),
  accentLight: T.accentLight ?? mix(accent, '#FFFFFF', 0.35),
  accentMid: T.accentMid ?? mix(accent, bg, 0.3),
  accentDeep: T.accentDeep ?? mix(accent, bg, 0.6),
  ink: '#FFFFFF',
  ink2: T.texto2 ?? '#DEDBD1', // branco quente das listas
  support: T.apoio ?? '#A9AD9C',
  dim: T.apagado ?? '#6C7062',
  line: '',
  lineSoft: 'rgba(255,255,255,0.09)',
  card: 'rgba(255,255,255,0.045)',
  cardHi: '',
  onAccent: '#171407', // texto escuro sobre a cor de destaque
  panelBg: mix(bg, '#FFFFFF', 0.025), // fundo do "celular"
  mapBg: mix(bg, '#FFFFFF', 0.05), // fundo dos mapas estilizados
  red: '#E58A7C',
  redRgb: '229,138,124',
  ok: '#A6D49A',
  okRgb: '166,212,154',
  wa: '#25D366',
  // Agência (só no Avatar e na assinatura)
  steel: '#B6BDC8',
  copperLight: '#D98A5C',
  // nomes antigos (gold...) mantidos como alias para o código copiado dos vídeos antigos
  gold: accent,
  goldLight: '',
  goldMid: '',
  goldDeep: '',
};
C.line = `rgba(${C.accentRgb},0.28)`;
C.cardHi = `rgba(${C.accentRgb},0.10)`;
C.goldLight = C.accentLight;
C.goldMid = C.accentMid;
C.goldDeep = C.accentDeep;

/** cor de destaque com transparência */
export const acc = (a: number) => `rgba(${C.accentRgb},${a})`;
/** qualquer cor hex com transparência */
export const rgba = (hex: string, a: number) => `rgba(${hexToRgb(hex).join(',')},${a})`;

export const W = 1080;
export const H = 1920;
export const SIDE = 80; // margem lateral segura
export const TOP = 200; // margem superior segura
export const CONTENT_W = W - SIDE * 2;
export const MIN_TEXT = 30; // nenhum texto abaixo disso
export const CONTENT_BOTTOM = 1480; // nada abaixo disso
