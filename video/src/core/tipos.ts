// Tipos do lead.ts e dos módulos. Só tipos: o node (tools/orcamento.mjs) lê o lead.ts sem carregar React.
import type React from 'react';
import type {Q, Saida, Part} from './lib';
import type {AberturaP} from '../scenes/fixed/abertura';
import type {ReputacaoP} from '../scenes/fixed/reputacao';
import type {ControleP} from '../scenes/fixed/controle';
import type {ConviteP} from '../scenes/fixed/convite';
import type {FraseP} from '../scenes/modules/frase';
import type {CentralTransparenciaP} from '../scenes/modules/centralTransparencia';
import type {PostPublicoP} from '../scenes/modules/postPublico';
import type {EscritoriosP} from '../scenes/modules/escritorios';
import type {SemAnunciosP} from '../scenes/modules/semAnuncios';
import type {InvestimentoAtualP} from '../scenes/modules/investimentoAtual';
import type {MetodoBuscasP} from '../scenes/modules/metodoBuscas';
import type {BuscaPeloNomeP} from '../scenes/modules/buscaPeloNome';
import type {ForaDoMapaNumaCidadeP} from '../scenes/modules/foraDoMapaNumaCidade';
import type {PatrocinadosNaBuscaP} from '../scenes/modules/patrocinadosNaBusca';
import type {MapaCidadeP} from '../scenes/modules/mapaCidade';
import type {ConcorrenteNoNomeP} from '../scenes/modules/concorrenteNoNome';
import type {AnunciosAntesDoMapaP} from '../scenes/modules/anunciosAntesDoMapa';
import type {FluxoP} from '../scenes/modules/fluxo';
import type {VariacaoEntreRodadasP} from '../scenes/modules/variacaoEntreRodadas';
import type {CelularTresVagasP} from '../scenes/modules/celularTresVagas';
import type {UnidadeSemPerfilP} from '../scenes/modules/unidadeSemPerfil';
import type {CustoDoCliqueP} from '../scenes/modules/custoDoClique';
import type {AnuncioPorServicoCidadeP} from '../scenes/modules/anuncioPorServicoCidade';
import type {IaDentroDaContaP} from '../scenes/modules/iaDentroDaConta';
import type {FluxoWhatsAppP} from '../scenes/modules/fluxoWhatsApp';
import type {DicasP} from '../scenes/modules/dicas';
import type {AberturaV2P} from '../scenes/fixed/aberturaV2';
import type {ConviteV2P} from '../scenes/fixed/conviteV2';
import type {AuditoriaSeoP} from '../scenes/modules/auditoriaSeo';
import type {ConviteLeveP} from '../scenes/modules/conviteLeve';
import type {RelatorioSemanaP} from '../scenes/modules/relatorioSemana';
import type {HeatmapGradeP} from '../scenes/modules/heatmapGrade';
import type {ComparativoCategoriasP} from '../scenes/modules/comparativoCategorias';
import type {MiniMapaP} from '../scenes/modules/miniMapa';
import type {RotaMapaP} from '../scenes/modules/rotaMapa';

export type {Q, Saida, Part};

export type Tema = {
  /** cor de destaque do lead (hex) */
  accent: string;
  /** a mesma cor em "r,g,b" (opcional: é calculada do hex) */
  accentRgb?: string;
  accentLight?: string;
  accentMid?: string;
  accentDeep?: string;
  /** fundo escuro do vídeo */
  fundo: string;
  fundo2?: string;
  apoio?: string;
  apagado?: string;
  texto2?: string;
  /** Poppins, Jost, DMSans, Montserrat, Inter, Lato, OpenSans, Raleway, Nunito, Roboto, Outfit, Manrope */
  fonteTitulo?: string;
  /** CormorantGaramond, Fraunces, PlayfairDisplay */
  fonteSerifa?: string;
  /** desenho sutil atrás de tudo: escudo, diamante, casa, pino, nenhum */
  motivo?: 'escudo' | 'diamante' | 'casa' | 'pino' | 'nenhum';
  /** ícone do lead nos cartões "você" (nome de Icon: shield, diamond, home, pin...) */
  icone?: string;
  /** brilhos extras de fundo (cores secundárias do site do lead) */
  brilhos?: {cor: string; alfa: number}[];
};

export type Lead = {
  /** como o Avatar chama o decisor */
  nome: string;
  empresa: string;
  /** "dados de [data]" nas cenas datadas */
  dataBusca: string;
  tema: Tema;
};

export type CursorP = {ateEm: Q; pontos: {em: Q; x: number; y: number; clique?: boolean}[]};

export type Modulo =
  | AberturaP
  | ReputacaoP
  | ControleP
  | ConviteP
  | FraseP
  | CentralTransparenciaP
  | PostPublicoP
  | EscritoriosP
  | SemAnunciosP
  | InvestimentoAtualP
  | MetodoBuscasP
  | BuscaPeloNomeP
  | ForaDoMapaNumaCidadeP
  | PatrocinadosNaBuscaP
  | MapaCidadeP
  | ConcorrenteNoNomeP
  | AnunciosAntesDoMapaP
  | FluxoP
  | VariacaoEntreRodadasP
  | CelularTresVagasP
  | UnidadeSemPerfilP
  | CustoDoCliqueP
  | AnuncioPorServicoCidadeP
  | IaDentroDaContaP
  | FluxoWhatsAppP
  | DicasP
  | AberturaV2P
  | ConviteV2P
  | AuditoriaSeoP
  | ConviteLeveP
  | RelatorioSemanaP
  | HeatmapGradeP
  | ComparativoCategoriasP
  | MiniMapaP
  | RotaMapaP;
export type ModId = Modulo['id'];

/** Um vídeo é uma lista de cenas; cada cena é uma lista de módulos que entram um depois do outro. */
export type Cena = {
  /** rótulo do topo: "// 05 · o mapa de Fort Myers" */
  rotulo: string;
  /** cena com dado que muda: mostra "dados de [dataBusca]" */
  datado?: boolean;
  modulos: Modulo[];
  cursor?: CursorP;
};

export type ModView<P> = React.FC<{p: P; ate?: number}>;

/** efeito sonoro de um módulo (o tools/sfx_d.py toca a partir do data/sfx.json) */
export type SfxTipo = 'entra' | 'sai' | 'cartao' | 'tique' | 'toc' | 'pop' | 'popAvatar' | 'clique' | 'sino' | 'sino3' | 'ausente' | 'impacto' | 'swish' | 'enche' | 'toggle' | 'digitar';
export type Cue = {em: Q; tipo: SfxTipo; f?: number; pan?: number; trim?: number; texto?: string; cps?: number; ateEm?: Q};

export type Meta<P> = {
  grupo: 'fixa' | 'no-ar' | 'achado' | 'solucao' | 'dica' | 'apoio';
  /** faixa de palavras da narração deste módulo (o tools/orcamento.mjs soma por cena) */
  palavras: [number, number] | ((p: P) => [number, number]);
  /** valores padrão (texto fixo do roteiro Agência, nunca dado de lead) */
  padrao?: Partial<P>;
  /** valores que dependem de outros (ex.: nomeEm = nome) */
  derivar?: (p: P) => Partial<P>;
  /** efeitos sonoros do módulo */
  sfx: (p: P) => Cue[];
};
