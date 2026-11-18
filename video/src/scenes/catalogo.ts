// Catálogo dos módulos: padrões (texto fixo do roteiro Agência), faixa de palavras e efeitos sonoros.
// TS puro (sem React): o tools/orcamento.mjs lê este arquivo no node para conferir âncoras, palavras e gerar o data/sfx.json.
// Módulo novo: crie scenes/modules/<id>.tsx, registre em scenes/registro.tsx, ponha o tipo em core/tipos.ts e a entrada aqui.
import type {Cue, Meta, Modulo, ModId, Q} from '../core/tipos';

type M<I extends ModId> = Meta<Extract<Modulo, {id: I}>>;
type Cat = {[I in ModId]: M<I>};

/** soma segundos a uma âncora: addQ('Abriram', 0.2) = 'Abriram+0.2' */
export const addQ = (q: Q, d: number): Q => {
  if (typeof q === 'number') return q + d;
  const m = q.match(/^(.*?)([+-]\d*\.?\d+)?$/s)!;
  const v = Math.round(((m[2] ? parseFloat(m[2]) : 0) + d) * 1000) / 1000;
  return v === 0 ? m[1] : `${m[1]}${v > 0 ? '+' : ''}${v}`;
};
const cue = (em: Q, tipo: Cue['tipo'], extra: Partial<Cue> = {}): Cue => ({em, tipo, ...extra});
/** "sai" 0,3 s antes de uma tela nova começar */
const sai = (em: Q) => cue(addQ(em, -0.3), 'sai');
/** linhas com palavra-chave ganham um "swish" de entrada */
const linhasSfx = (linhas: {em?: Q; t: [string, string?][]}[], em: Q) =>
  linhas.filter((l) => l.t.some(([, r]) => r === 'k' || r === 'a' || r === 'i')).map((l) => cue(l.em ?? em, 'entra'));
const tiques = (em: Q, n: number, passo: number, f0 = 2100, cresce = 1.12, trim = 0) =>
  Array.from({length: n}, (_, i) => cue(addQ(em, i * passo), 'tique', {f: Math.round(f0 * cresce ** i), pan: -0.4 + (0.8 * i) / Math.max(1, n - 1), trim}));

export const CATALOGO: Cat = {
  // ===== cenas fixas =====
  abertura: {
    grupo: 'fixa',
    palavras: [36, 44],
    padrao: {em: 0, aquiEm: 'Aqui', marcaEm: 'Agência', loopEm: 'No fim', faltaEm: 'o que falta', facilEm: 'mais fácil'},
    derivar: (p) => ({nomeEm: p.nomeEm ?? p.nome}),
    sfx: (p) => [
      cue(0, 'swish'),
      cue(p.nomeEm!, 'entra'),
      cue(addQ(p.aquiEm!, -0.1), 'popAvatar'),
      cue(p.marcaEm!, 'entra'),
      sai(p.ganchos[0].em),
      ...p.ganchos.slice(0, 3).map((g, i) => cue(addQ(g.em, -0.05), g.alerta ? 'impacto' : 'cartao', {f: 700 + i * 60})),
      sai(p.loopEm!),
      cue(p.faltaEm!, 'entra'),
      cue(addQ(p.faltaEm!, 0.2), 'cartao'),
      cue(p.facilEm!, 'sino', {trim: -3}),
    ],
  },
  aberturaV2: {
    grupo: 'fixa',
    palavras: [32, 40],
    padrao: {em: 0, aquiEm: 'Aqui', agenteEm: 'agente', euEm: 'Eu trabalho', pesquisouEm: 'pesquisou', googleEm: 'Google', comoEm: 'como', apareceEm: 'aparece', saoEm: 'São', quatroEm: 'quatro', minutosEm: 'minutos'},
    derivar: (p) => ({nomeEm: p.nomeEm ?? p.nome, destaqueEm: p.destaqueEm ?? p.destaque}),
    sfx: (p) => [
      cue(0, 'swish'),
      cue(p.nomeEm!, 'entra'),
      cue(addQ(p.aquiEm!, -0.1), 'popAvatar'),
      cue(p.agenteEm!, 'entra'),
      sai(p.euEm!),
      cue(p.euEm!, 'tique', {f: 2400}),
      cue(p.pesquisouEm!, 'digitar', {texto: p.busca, cps: 18, ateEm: p.googleEm}),
      cue(p.destaqueEm!, 'entra'),
      cue(p.apareceEm!, 'entra'),
      sai(p.saoEm!),
      cue(p.quatroEm!, 'pop'),
      cue(addQ(p.minutosEm!, 0.05), 'enche', {trim: -3}),
    ],
  },
  reputacao: {
    grupo: 'fixa',
    palavras: [50, 75],
    sfx: (p) => [
      cue(addQ(p.em, -0.05), 'cartao'),
      cue(addQ(p.nota.notaEm, -0.1), 'sino'),
      ...tiques(addQ(p.nota.notaEm, 0.1), 5, 0.09),
      cue(p.nota.avaliacoesEm, 'toc', {f: 820}),
      ...(p.nota.outra ? [cue(addQ(p.nota.outra.em, -0.05), 'toc'), cue(p.nota.outra.contaEm, 'tique', {f: 2500})] : []),
      sai(p.elogios.em),
      cue(addQ(p.elogios.em, 0.5), 'entra'),
      ...p.elogios.itens.map((r) => cue(addQ(r.em, -0.12), 'toc')),
      ...(p.temas ? [sai(p.temas.em), cue(addQ(p.temas.em, 0.4), 'entra'), ...p.temas.itens.map((r, i) => cue(r.em, 'tique', {f: 2500 - i * 150, pan: [-0.2, 0.1, -0.1, 0.2][i % 4]}))] : []),
      ...(p.selos ? [sai(p.selos.em), ...p.selos.itens.map((r, i) => cue(addQ(r.em, -0.06), 'toc', {f: 700 + i * 60}))] : []),
    ],
  },
  controle: {
    grupo: 'fixa',
    palavras: [50, 58],
    padrao: {
      em: 'Mas ela',
      titulo: [
        ['A IA não faz', 's'],
        ['nada sozinha.', 'k'],
      ],
      itens: [
        {em: 'A inteligência', icone: 'search', texto: 'A IA vigia sua conta todo dia.'},
        {em: 'Quem decide', icone: 'person', texto: 'Quem decide é um especialista da Agência Exemplo.'},
        {em: 'Verba travada', icone: 'lock', texto: 'Verba travada no limite combinado.'},
        {em: 'conta no seu', icone: 'shield', texto: 'A conta fica no seu nome.'},
        {em: 'sem tempo', icone: 'check', texto: 'Sem tempo mínimo nem multa.'},
        {em: 'Ninguém garante', icone: 'x', texto: 'Ninguém garante posição no Google.'},
      ],
      fimEm: 'nem a gente+0.1',
    },
    sfx: (p) => [cue(addQ(p.em!, 0.6), 'entra'), ...p.itens!.map((it, i) => cue(addQ(it.em, -0.05), 'toc', {f: 680 + i * 30})), cue(p.fimEm!, 'sino', {trim: -3})],
  },
  convite: {
    grupo: 'fixa',
    palavras: [38, 44],
    padrao: {
      em: 'Prometi',
      faltaEm: 'o que falta',
      facilEm: 'mais fácil',
      mapaEm: 'Mapa do Google',
      narradorEm: 'te mostro',
      soEm: 'É só',
      assinatura: ['Ana · Agência Exemplo', 'WhatsApp +1 555 010 0100 · exemplo.com'],
      slogan: 'Anúncios que prestam contas.',
    },
    derivar: (p) => {
      const w = (x?: string) => (x ?? '').split(/[ ,]/)[0];
      return {horario1Em: p.horario1Em ?? w(p.marcado ?? p.horarios?.[0]), horario2Em: p.horario2Em ?? (p.marcado ? undefined : w(p.horarios?.[1]))};
    },
    sfx: (p) => [
      cue(p.em!, 'entra'),
      cue(p.faltaEm!, 'entra'),
      cue(p.facilEm!, 'sino', {trim: -3}),
      sai(p.mapaEm!),
      cue(p.mapaEm!, 'cartao'),
      cue(p.narradorEm!, 'pop'),
      cue(p.horario1Em!, 'toc'),
      ...(p.horario2Em ? [cue(p.horario2Em, 'toc', {f: 820})] : []),
      cue(p.soEm!, 'tique', {f: 2400}),
    ],
  },
  conviteV2: {
    grupo: 'fixa',
    palavras: [38, 48],
    padrao: {
      em: 'Foi isso',
      oQueNaoEm: 'O que não',
      valorEm: 'quanto vale',
      paraVocesEm: 'para vocês',
      queTalEm: 'Que tal',
      quinzeEm: 'quinze',
      narradorEm: 'com a Ana',
      paraFazerEm: 'para fazer',
      horarioEm: 'Qual horário',
      soEm: 'É só',
      assinatura: ['Ana · Agência Exemplo', 'WhatsApp +1 555 010 0100'],
      slogan: 'Anúncios que prestam contas.',
    },
    derivar: (p) => ({nomeEm: p.nomeEm ?? p.nome}),
    sfx: (p) => [
      cue(p.nomeEm!, 'entra'),
      cue(p.valorEm!, 'entra'),
      sai(p.queTalEm!),
      cue(p.quinzeEm!, 'pop'),
      cue(p.narradorEm!, 'entra'),
      cue(addQ(p.horarioEm!, -0.05), 'cartao'),
      cue(p.soEm!, 'pop', {f: 1150}),
      cue(addQ(p.horarioEm!, 0.3), 'sino3', {trim: -2}),
    ],
  },

  // ===== apoio =====
  frase: {
    grupo: 'apoio',
    palavras: (p) => [Math.max(3, p.linhas.length * 2), p.linhas.length * 5 + 4],
    sfx: (p) => [
      ...linhasSfx(p.linhas, p.em),
      ...(p.icone ? [cue(addQ(p.iconeEm ?? p.em, -0.1), 'pop', {f: 1000})] : []),
      ...(p.barraEm !== undefined ? [cue(addQ(p.barraEm, 0.05), 'enche', {trim: -3})] : []),
      ...(p.tracejado ? [cue(p.tracejado.em, 'ausente')] : []),
    ],
  },
  fluxo: {
    grupo: 'apoio',
    palavras: [12, 24],
    sfx: (p) => p.passos.map((r, i) => (r.alerta ? cue(addQ(r.em, 0.1), 'ausente', {trim: -2}) : cue(addQ(r.em, -0.1), 'toc', {f: 760 - i * 80}))),
  },
  metodoBuscas: {
    grupo: 'apoio',
    palavras: [16, 26],
    sfx: (p) => [cue(p.em, 'cartao'), ...p.selos.map((s) => cue(s.em, 'tique', {f: 2400}))],
  },

  // ===== o que já está no ar =====
  centralTransparencia: {
    grupo: 'no-ar',
    palavras: [18, 30],
    sfx: (p) => [cue(p.em, 'cartao'), ...tiques(p.anunciosEm, Math.min(8, Math.max(2, p.anuncios)), 0.08, 1800, 1.06, -3), cue(p.selo.em, 'tique', {f: 2600}), ...(p.formatos ?? []).map((f, i) => cue(f.em, 'toc', {f: 760 + i * 40}))],
  },
  postPublico: {
    grupo: 'no-ar',
    palavras: [12, 22],
    sfx: (p) => [cue(p.em, 'tique', {f: 2300}), cue(addQ(p.autorEm, -0.1), 'cartao'), cue(p.destaqueEm, 'pop', {f: 1050})],
  },
  escritorios: {
    grupo: 'no-ar',
    palavras: [14, 26],
    sfx: (p) => [cue(p.em, 'tique', {f: 2300}), ...p.itens.map((o, i) => cue(o.em, 'toc', {f: 760 + i * 30})), ...(p.selos ?? []).map((s, i) => cue(s.em, 'pop', {f: 1050 + i * 100}))],
  },
  semAnuncios: {
    grupo: 'no-ar',
    palavras: [14, 24],
    sfx: (p) => [cue(p.em, 'cartao'), cue(p.zeroEm, 'ausente'), ...p.selos.map((s, i) => cue(s.em, 'tique', {f: 2400 + i * 100}))],
  },
  investimentoAtual: {
    grupo: 'no-ar',
    palavras: [12, 26],
    sfx: (p) => p.itens.map((r, i) => cue(addQ(r.em, -0.06), 'toc', {f: 700 + i * 60})),
  },

  // ===== achados =====
  auditoriaSeo: {
    grupo: 'achado',
    palavras: [30, 66],
    sfx: (p) => [
      cue(p.em, 'cartao'),
      ...p.itens.map((it, i) => cue(addQ(it.em, -0.05), it.status === 'falta' ? 'ausente' : 'toc', {f: 760 + i * 40})),
      ...(p.pills ?? []).map((x) => cue(x.em, x.tipo === 'ok' ? 'sino' : 'tique', {f: 2500})),
      ...(p.google ? [sai(p.google.em), cue(p.google.em, 'swish'), cue(p.google.citacaoEm, 'pop', {f: 1000}), ...(p.google.pills ?? []).map((x) => cue(x.em, x.tipo === 'ok' ? 'sino' : 'tique', {f: 2500}))] : []),
    ],
  },
  heatmapGrade: {
    grupo: 'achado',
    palavras: [24, 40],
    sfx: (p) => [cue(p.em, 'cartao'), ...tiques(p.gradeEm ?? addQ(p.em, 0.3), Math.min(5, p.pontos.length), 0.18), ...(p.resumo ? [cue(p.resumo.em, 'entra')] : [])],
  },
  comparativoCategorias: {
    grupo: 'achado',
    palavras: [30, 50],
    sfx: (p) => [
      cue(p.em, 'cartao'),
      ...(p.tracejado ? [cue(p.tracejado.em, 'ausente')] : []),
      ...[0, 1, 2].map((i) => cue(addQ(p.outrosEm, i * 0.25), 'toc', {f: 740 - i * 20})),
      cue(p.faltaEm, 'pop', {f: 1050}),
    ],
  },
  miniMapa: {
    grupo: 'achado',
    palavras: [16, 30],
    sfx: (p) => [
      ...(p.linhas ? linhasSfx(p.linhas, p.em) : []),
      cue(p.buscaEm ?? p.em, 'tique', {f: 2300}),
      ...[0, 1, 2].map((i) => cue(addQ(p.mapaEm, i * 0.12), 'toc', {f: 740 - i * 20})),
      ...(p.tracejado ? [cue(p.tracejado.em, 'ausente')] : []),
    ],
  },
  rotaMapa: {
    grupo: 'achado',
    palavras: [20, 36],
    sfx: (p) => [
      cue(addQ(p.em, -0.1), 'cartao'),
      cue(addQ(p.rotaEm, -0.2), 'enche', {trim: -3}),
      cue(addQ(p.rotaEm, 0.4), 'pop'),
      cue(p.escritorioEm, 'toc'),
      cue(p.cardEm, 'toc', {f: 820}),
      cue(p.perdidoEm, 'ausente'),
    ],
  },
  conviteLeve: {
    grupo: 'apoio',
    palavras: [12, 22],
    sfx: (p) => [cue(p.em, 'pop', {f: 1000}), ...(p.apoioEm ? [cue(p.apoioEm, 'tique', {f: 2400})] : []), ...(p.depois ? [cue(p.depois.em, 'entra')] : [])],
  },
  relatorioSemana: {
    grupo: 'fixa',
    palavras: [0, 0],
    padrao: {
      titulo: 'O que a IA fez esta semana',
      rodape: 'relatório de segunda',
      itens: [
        {numero: '312', texto: 'buscas lidas'},
        {numero: '9', texto: 'gastando sem trazer contato'},
        {numero: '7', texto: 'cortes aprovados por um especialista'},
        {numero: '2', texto: 'em observação'},
      ],
    },
    sfx: (p) => [sai(p.em), cue(p.em, 'cartao'), ...tiques(addQ(p.em, 0.35), p.itens!.length, 0.4)],
  },
  buscaPeloNome: {
    grupo: 'achado',
    palavras: (p) => (p.segunda ? [24, 38] : [12, 24]),
    sfx: (p) => [
      cue(addQ(p.em, -0.25), 'clique'),
      cue(p.em, 'digitar', {texto: p.busca, cps: 22, ateEm: p.resultadoEm}),
      cue(p.resultadoEm, 'pop', {f: 1050}),
      ...p.pills.map((x) => (x.tipo === 'ok' ? cue(x.em, 'sino', {trim: -2}) : cue(x.em, 'tique', {f: 2600}))),
      ...(p.linhas ? linhasSfx(p.linhas, p.em) : []),
      ...(p.segunda
        ? [cue(addQ(p.segunda.em, -0.2), 'clique'), cue(p.segunda.em, 'digitar', {texto: p.segunda.busca, cps: 30, ateEm: p.segunda.resultadoEm}), cue(p.segunda.resultadoEm, 'pop'), ...p.segunda.pills.map((x) => cue(x.em, 'tique', {f: 2600}))]
        : []),
    ],
  },
  foraDoMapaNumaCidade: {
    grupo: 'achado',
    palavras: [14, 26],
    sfx: (p) => [
      cue(p.em, 'digitar', {texto: p.busca, cps: 30, ateEm: p.tracejado.em}),
      ...(p.pill ? [cue(p.pill.em, 'pop', {f: 1050})] : []),
      cue(p.tracejado.em, 'ausente'),
      cue(addQ(p.tracejado.em, -0.05), 'impacto', {trim: -4}),
      ...(p.lista ? p.lista.lugares.map((_, i) => cue(addQ(p.lista!.em, 0.1 + i * 0.15), 'toc', {f: 760 - i * 20})) : []),
    ],
  },
  patrocinadosNaBusca: {
    grupo: 'achado',
    palavras: [14, 28],
    sfx: (p) => [
      cue(p.em, 'digitar', {texto: p.busca, cps: 30, ateEm: p.caretAteEm}),
      ...(p.contagem ? [cue(p.contagem.em, 'pop', {f: 700})] : []),
      ...(p.pill ? [cue(p.pill.em, 'tique', {f: 2400})] : []),
      ...p.itens.map((it, i) => cue(it.em ?? addQ(p.itensEm ?? p.em, i * 0.16), 'toc', {f: 760 - i * 15})),
      cue(p.tracejado.em, 'ausente'),
    ],
  },
  mapaCidade: {
    grupo: 'achado',
    palavras: [30, 46],
    sfx: (p) => [
      cue(p.em, 'cartao'),
      cue(p.buscaEm, 'digitar', {texto: p.busca, cps: 28, ateEm: p.caretAteEm}),
      ...tiques(addQ(p.mapaEm, 0.2), 6, 0.08, 1900, 1.06, -3),
      ...p.lugares.map((_, i) => cue(addQ(p.lugaresEm, i * 0.18), 'toc', {f: 780 - i * 20})),
      ...(p.anuncioNoMapaEm !== undefined ? [cue(p.anuncioNoMapaEm, 'pop', {f: 700})] : []),
      ...(p.pill ? [cue(p.pill.em, 'pop', {f: 1050})] : []),
      cue(addQ(p.fimEm, -0.1), 'swish', {trim: -2}),
      ...(p.lista ? [cue(addQ(p.lista.em, 0.15), 'toc', {f: 700})] : []),
      ...(p.lista?.linhas ?? []).filter((l) => l.voce).map((l) => cue(l.em ?? p.lista!.em, 'sino', {trim: -3})),
      ...(p.tracejado ? [cue(p.tracejado.em, 'ausente')] : []),
    ],
  },
  concorrenteNoNome: {
    grupo: 'achado',
    palavras: (p) => (p.presenca ? [34, 52] : [20, 34]),
    sfx: (p) => [
      ...(p.presenca ? [cue(p.presenca.nomeEm, 'entra'), ...p.presenca.buscas.map((b, i) => cue(addQ(p.presenca!.listaEm, i * 0.12), b.apareceu ? 'tique' : 'toc', {f: b.apareceu ? 2200 : 700, trim: -3})), sai(p.anuncio.em!)] : []),
      cue(p.anuncio.buscaEm, 'digitar', {texto: p.anuncio.busca, cps: 20, ateEm: p.anuncio.anunciosEm}),
      cue(p.anuncio.selo.em, 'tique', {f: 2400}),
      cue(p.anuncio.anunciosEm, 'toc'),
      cue(p.anuncio.antesEm, 'impacto', {trim: -4}),
      cue(addQ(p.anuncio.anunciosEm, 0.35), 'toc', {f: 820}),
      cue(p.anuncio.permiteEm, 'cartao'),
    ],
  },
  anunciosAntesDoMapa: {
    grupo: 'achado',
    palavras: [20, 34],
    sfx: (p) => [
      cue(p.em, 'digitar', {texto: p.busca, cps: 28, ateEm: p.caretAteEm}),
      ...(p.pill ? [cue(p.pill.em, 'tique', {f: 2400})] : []),
      ...p.anuncios.map((_, i) => cue(addQ(p.rotulo.em, i * 0.16), 'toc', {f: 760 - i * 15, pan: -0.2 + 0.13 * i})),
      ...p.grupos.map((g, i) => cue(g.em, 'pop', {f: 700 + i * 60})),
      cue(addQ(p.mapa.em, 0.1), 'tique', {f: 2600}),
    ],
  },
  variacaoEntreRodadas: {
    grupo: 'achado',
    palavras: [30, 46],
    sfx: (p) => [
      cue(p.buscaEm, 'digitar', {texto: p.busca, cps: 26, ateEm: p.caretAteEm}),
      ...(p.pills ?? []).map((x) => cue(x.em, 'tique', {f: 2400})),
      cue(p.manha.em, 'tique', {f: 2200}),
      cue(p.manha.textoEm, 'ausente'),
      cue(p.tarde.em, 'tique', {f: 2400}),
      cue(addQ(p.tarde.rolarEm, -0.2), 'swish', {trim: -3}),
      cue(addQ(p.tarde.chegaEm, 0.4), 'pop', {f: 1050}),
    ],
  },
  celularTresVagas: {
    grupo: 'achado',
    palavras: [15, 28],
    sfx: (p) => [cue(p.em, 'entra'), cue(addQ(p.celularEm, -0.2), 'cartao'), ...[0, 1, 2].map((i) => cue(addQ(p.vagasEm, i * 0.15), 'toc', {f: 760 - i * 20})), cue(addQ(p.toqueEm, 0.2), 'clique'), cue(p.mensagemEm, 'pop', {f: 1150}), cue(p.semRolarEm, 'ausente')],
  },
  unidadeSemPerfil: {
    grupo: 'achado',
    palavras: [50, 72],
    sfx: (p) => [
      cue(p.em, 'cartao'),
      cue(addQ(p.em, 0.1), 'tique', {f: 2400}),
      cue(p.provas.perfil.em, 'toc'),
      cue(p.provas.perfil.pillEm, 'pop', {f: 1050}),
      cue(p.provas.busca.em, 'tique', {f: 2300}),
      ...[0, 1, 2].map((i) => cue(addQ(p.provas.mapaEm, i * 0.12), 'toc', {f: 740 - i * 20})),
      cue(p.provas.tracejado.em, 'ausente'),
      ...(p.meio ? [sai(p.meio.em), ...linhasSfx(p.meio.linhas, p.meio.em)] : []),
      sai(p.rota.em),
      cue(addQ(p.rota.em, -0.1), 'cartao'),
      cue(addQ(p.rota.rotaEm, -0.2), 'enche', {trim: -3}),
      cue(addQ(p.rota.rotaEm, 0.4), 'pop'),
      cue(p.rota.escritorioEm, 'toc'),
      cue(p.rota.cardEm, 'toc', {f: 820}),
      cue(p.rota.perdidoEm, 'ausente'),
    ],
  },

  // ===== solução =====
  custoDoClique: {
    grupo: 'solucao',
    palavras: [24, 40],
    sfx: (p) => [
      ...linhasSfx([{em: p.em, t: p.titulo}], p.em),
      cue(p.painelEm, 'cartao'),
      ...tiques(addQ(p.valorEm, -0.1), 8, 0.1, 1700, 1.07, -4),
      ...p.setores.map((_, i) => cue(addQ(p.setoresEm, i * 0.15), 'toc', {f: 760 + i * 40})),
      ...p.pills.map((x) => (x.tipo === 'alerta' ? cue(x.em, 'ausente', {trim: -3}) : cue(x.em, 'pop'))),
    ],
  },
  anuncioPorServicoCidade: {
    grupo: 'solucao',
    palavras: [22, 34],
    sfx: (p) => [cue(addQ(p.em, 0.6), 'entra'), cue(p.ofertaEm, 'entra'), ...p.exemplos.map((e) => cue(e.em, 'toc', {f: 780})), cue(p.ligarEm, 'clique'), cue(p.whatsEm, 'pop', {f: 1150})],
  },
  iaDentroDaConta: {
    grupo: 'solucao',
    palavras: [34, 52],
    padrao: {trabalhandoEm: 'trabalhando', previsaoEm: 'Antes de começar', quantosEm: 'quantos', sempreEm: 'Sempre', nuncaEm: 'nunca', contaEm: 'Depois', buscasEm: 'quais buscas', gastaramEm: 'só gastaram', bloqueiaEm: 'bloqueia', ajustaEm: 'ajusta', pausaEm: 'pausa'},
    sfx: (p) => [
      cue(p.em, 'entra'),
      cue(p.trabalhandoEm!, 'entra'),
      cue(p.previsaoEm!, 'cartao'),
      ...[0, 1, 2].map((i) => cue(addQ(p.quantosEm!, i * 0.25), 'tique', {f: 2000 + i * 200})),
      cue(p.sempreEm!, 'entra'),
      cue(p.nuncaEm!, 'entra'),
      sai(p.contaEm!),
      cue(p.contaEm!, 'cartao'),
      cue(p.buscasEm!, 'tique', {f: 2400}),
      cue(addQ(p.buscasEm!, 0.25), 'tique', {f: 2500}),
      cue(p.gastaramEm!, 'ausente', {trim: -3}),
      cue(p.ajustaEm!, 'enche', {trim: -3}),
      cue(p.bloqueiaEm!, 'tique', {f: 1500}),
      cue(addQ(p.bloqueiaEm!, 0.08), 'tique', {f: 1300}),
      cue(p.pausaEm!, 'toggle'),
    ],
  },
  fluxoWhatsApp: {
    grupo: 'solucao',
    palavras: [34, 52],
    sfx: (p) => [
      cue(p.em, 'entra'),
      ...p.anuncios.map((a, i) => cue(addQ(a.em, -0.1), 'toc', {f: 760 + i * 30})),
      ...(p.unidade ? [cue(p.unidade.em, 'cartao'), cue(p.unidade.botaoEm, 'pop', {f: 1150})] : []),
      sai(p.toque.em),
      cue(p.toque.botaoEm, 'clique'),
      cue(p.toque.conversaEm, 'cartao'),
      cue(p.toque.msgEm, 'digitar', {texto: p.toque.mensagem, cps: 30}),
      cue(p.toque.msgFimEm, 'sino', {trim: -3}),
    ],
  },

  // ===== dicas =====
  dicas: {
    grupo: 'dica',
    palavras: (p) => [p.itens.length * 18, p.itens.length * 28],
    sfx: (p) =>
      p.itens.flatMap((d, i): Cue[] => {
        const base = [...(i > 0 ? [sai(d.em)] : []), cue(d.em, 'tique', {f: 2400})];
        switch (d.tipo) {
          case 'perfisDuplicados':
            return [...base, cue(d.painelEm, 'cartao'), ...d.perfis.map((_, k) => cue(addQ(d.perfisEm, k * 0.25), 'toc', {f: 760 + k * 40})), cue(d.telefonesEm, 'ausente'), cue(d.horariosEm, 'tique', {f: 2200}), cue(d.juntarEm, 'swish', {trim: -2}), cue(addQ(d.juntarEm, 0.3), 'sino', {trim: -2})];
          case 'erroNaDescricao':
            return [...base, cue(d.painelEm, 'cartao'), cue(d.erroEm, 'ausente'), cue(d.corrigirEm, 'pop', {f: 1250, trim: -2}), ...(d.final ? [cue(d.final.em, 'sino', {trim: -3})] : [])];
          case 'errosDeDigitacao':
            return [...base, cue(d.painelEm, 'cartao'), ...d.linhas.map((_, k) => cue(addQ(d.linhasEm, k * 0.18), 'toc', {f: 760 + k * 20})), cue(d.erroEm, 'ausente'), cue(d.corrigirEm, 'pop', {f: 1250, trim: -2})];
          case 'telefonesDiferentes':
            return [...base, cue(d.cardEm, 'toc'), cue(d.diferenteEm, 'ausente'), cue(d.juntarEm, 'swish', {trim: -2}), cue(addQ(d.juntarEm, 0.3), 'sino', {trim: -2})];
          default:
            return [...base, cue(d.painelEm, 'cartao'), cue(d.trocaEm, 'swish', {trim: -2}), ...(d.final ? [cue(d.final.em, 'sino', {trim: -3})] : [])];
        }
      }),
  },
};

/** props completas do módulo: padrão do catálogo + valores derivados + o que veio do lead.ts */
export const completar = <T extends Modulo>(m: T): T => {
  const meta = CATALOGO[m.id] as unknown as Meta<T>;
  const base = {...(meta.padrao ?? {}), ...m} as T;
  return {...base, ...(meta.derivar ? meta.derivar(base) : {})} as T;
};
export const palavrasDe = (m: Modulo): [number, number] => {
  const meta = CATALOGO[m.id] as unknown as Meta<Modulo>;
  const p = completar(m);
  return typeof meta.palavras === 'function' ? meta.palavras(p) : meta.palavras;
};
export const sfxDe = (m: Modulo): Cue[] => {
  const meta = CATALOGO[m.id] as unknown as Meta<Modulo>;
  return meta.sfx(completar(m));
};
