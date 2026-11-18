// Liga o id de cada módulo ao componente. Módulo novo entra aqui também.
import type {ModId, ModView} from '../core/tipos';
import {Abertura} from './fixed/abertura';
import {Reputacao} from './fixed/reputacao';
import {Controle} from './fixed/controle';
import {Convite} from './fixed/convite';
import {Frase} from './modules/frase';
import {CentralTransparencia} from './modules/centralTransparencia';
import {PostPublico} from './modules/postPublico';
import {Escritorios} from './modules/escritorios';
import {SemAnuncios} from './modules/semAnuncios';
import {InvestimentoAtual} from './modules/investimentoAtual';
import {MetodoBuscas} from './modules/metodoBuscas';
import {BuscaPeloNome} from './modules/buscaPeloNome';
import {ForaDoMapaNumaCidade} from './modules/foraDoMapaNumaCidade';
import {PatrocinadosNaBusca} from './modules/patrocinadosNaBusca';
import {MapaCidade} from './modules/mapaCidade';
import {ConcorrenteNoNome} from './modules/concorrenteNoNome';
import {AnunciosAntesDoMapa} from './modules/anunciosAntesDoMapa';
import {Fluxo} from './modules/fluxo';
import {VariacaoEntreRodadas} from './modules/variacaoEntreRodadas';
import {CelularTresVagas} from './modules/celularTresVagas';
import {UnidadeSemPerfil} from './modules/unidadeSemPerfil';
import {CustoDoClique} from './modules/custoDoClique';
import {AnuncioPorServicoCidade} from './modules/anuncioPorServicoCidade';
import {IaDentroDaConta} from './modules/iaDentroDaConta';
import {FluxoWhatsApp} from './modules/fluxoWhatsApp';
import {Dicas} from './modules/dicas';
import {AberturaV2} from './fixed/aberturaV2';
import {ConviteV2} from './fixed/conviteV2';
import {AuditoriaSeo} from './modules/auditoriaSeo';
import {ConviteLeve} from './modules/conviteLeve';
import {RelatorioSemana} from './modules/relatorioSemana';
import {HeatmapGrade} from './modules/heatmapGrade';
import {ComparativoCategorias} from './modules/comparativoCategorias';
import {MiniMapa} from './modules/miniMapa';
import {RotaMapa} from './modules/rotaMapa';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const REGISTRO: Record<ModId, ModView<any>> = {
  abertura: Abertura,
  reputacao: Reputacao,
  controle: Controle,
  convite: Convite,
  frase: Frase,
  centralTransparencia: CentralTransparencia,
  postPublico: PostPublico,
  escritorios: Escritorios,
  semAnuncios: SemAnuncios,
  investimentoAtual: InvestimentoAtual,
  metodoBuscas: MetodoBuscas,
  buscaPeloNome: BuscaPeloNome,
  foraDoMapaNumaCidade: ForaDoMapaNumaCidade,
  patrocinadosNaBusca: PatrocinadosNaBusca,
  mapaCidade: MapaCidade,
  concorrenteNoNome: ConcorrenteNoNome,
  anunciosAntesDoMapa: AnunciosAntesDoMapa,
  fluxo: Fluxo,
  variacaoEntreRodadas: VariacaoEntreRodadas,
  celularTresVagas: CelularTresVagas,
  unidadeSemPerfil: UnidadeSemPerfil,
  custoDoClique: CustoDoClique,
  anuncioPorServicoCidade: AnuncioPorServicoCidade,
  iaDentroDaConta: IaDentroDaConta,
  fluxoWhatsApp: FluxoWhatsApp,
  dicas: Dicas,
  aberturaV2: AberturaV2,
  conviteV2: ConviteV2,
  auditoriaSeo: AuditoriaSeo,
  conviteLeve: ConviteLeve,
  relatorioSemana: RelatorioSemana,
  heatmapGrade: HeatmapGrade,
  comparativoCategorias: ComparativoCategorias,
  miniMapa: MiniMapa,
  rotaMapa: RotaMapa,
};
