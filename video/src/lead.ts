// Configuração do lead: quais módulos entram, em que ordem e com quais dados.
// Cada cena = uma linha de CENAS (posição 1 = voz/cena1.txt). Cada módulo entra quando a frase `em` é falada
// e sai 0,3 s antes do próximo módulo da cena. Toda chave `em` ou terminada em `Em` é uma âncora (frase da cenaN.txt).
// Depois de editar: node tools/orcamento.mjs (confere âncoras e palavras e gera os arquivos do kit).
// EXEMPLO 100% FICTÍCIO: empresa "Café Aurora", decisora "Carla", cidade "Cidade Exemplo".
import type {Cena, Lead} from './core/tipos';

export const LEAD: Lead = {
  nome: 'Carla',
  empresa: 'Café Aurora',
  dataBusca: '01/01/2027',
  // identidade visual do lead (troque pelas cores da marca dele)
  tema: {
    accent: '#F38536',
    accentLight: '#F7AE78',
    accentMid: '#D9733A',
    accentDeep: '#253254',
    fundo: '#070A12',
    fundo2: '#0E1322',
    apoio: '#A9AEBD',
    apagado: '#6B7083',
    texto2: '#DCDDE3',
    fonteTitulo: 'Inter',
    motivo: 'nenhum',
    icone: 'badge',
    brilhos: [
      {cor: '#253254', alfa: 0.32},
      {cor: '#F38536', alfa: 0.1},
    ],
  },
};

/** falado → escrito nas legendas (números, nomes compostos que não podem quebrar) */
export const LEGENDAS: [string, string][] = [
  ['quatro minutos', '4 minutos'],
  ['quinze minutos', '15 minutos'],
  ['nota cinco', 'nota 5,0'],
  ['cem avaliações', '100 avaliações'],
];

export const CENAS: Cena[] = [
  // 1
  {
    rotulo: 'oi, Carla',
    modulos: [
      {
        id: 'abertura',
        nome: 'Carla',
        empresa: 'Café Aurora',
        ganchos: [
          {em: 'Nota cinco', numero: '5,0', texto: '100 avaliações no Google'},
          {em: 'Primeiro no mapa', numero: '1º', texto: 'no mapa em 3 buscas', detalhe: 'Cidade Exemplo'},
          {em: 'Mas o site', numero: '2', texto: 'buscas sem o site na 1ª página', alerta: true},
        ],
      },
    ],
  },
  // 2
  {
    rotulo: 'o que vocês já construíram',
    modulos: [
      {id: 'frase', em: 'Primeiro', linhas: [{em: 'o que vocês', t: [['O que vocês', 's']], size: 72}, {em: 'já construíram', t: [['já construíram.', 'k']], keySize: 128}]},
      {id: 'frase', em: 'A reputação', top: 640, icone: 'lead', linhas: [{t: [['A reputação', 's']], size: 74}, {em: 'está pronta', t: [['está pronta.', 'k']], keySize: 140}]},
    ],
  },
  // 3
  {
    rotulo: 'convite',
    modulos: [
      {id: 'convite', nome: 'Carla', empresa: 'Café Aurora', falta: 'aparecer nas buscas do bairro', horarios: ['terça de manhã', 'quinta à tarde']},
    ],
  },
];
