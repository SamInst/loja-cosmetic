// src/data/produtos.js

const IMAGEM_PADRAO = "/images/hidratante-corporal-paixao.jpg";
const IMAGEM_PADRAO_2 = "/images/logo.jpg";

export const produtos = [
  {
    id: 1,
    categoria: "MAKE",
    nome: "Sabonete facial",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Sabonete facial suave que remove impurezas, controla a oleosidade e deixa a pele limpa, fresca e macia desde o primeiro uso.",
    imagens: [IMAGEM_PADRAO_2, IMAGEM_PADRAO],
  },
  {
    id: 2,
    categoria: "MAKE",
    nome: "Serum",
    preco: 18.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Sérum facial leve e de rápida absorção, que hidrata profundamente, melhora a textura da pele e deixa um brilho saudável imediato.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 3,
    categoria: "MAKE",
    nome: "Bruma",
    preco: 15.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Bruma facial refrescante que hidrata, fixa a maquiagem e devolve o viço natural da pele ao longo do dia.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 4,
    categoria: "MAKE",
    nome: "Base Bruna Tavares",
    preco: 50.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Cobertura média, acabamento natural e textura leve que se adapta à pele, garantindo duração e uniformidade ao longo do dia.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 5,
    categoria: "MAKE",
    nome: "Corretivo",
    preco: 25.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Alta cobertura, textura cremosa e fácil de espalhar, disfarçando olheiras e imperfeições sem pesar.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 6,
    categoria: "MAKE",
    nome: "Contorno Stick Labranche",
    preco: 15.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura cremosa, fácil de esfumar e ideal para definir o rosto com acabamento natural e duradouro.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 7,
    categoria: "MAKE",
    nome: "Contorno Stick LOVE RAIN",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Fórmula cremosa, super fácil de espalhar, garantindo definição natural e acabamento uniforme.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 8,
    categoria: "MAKE",
    nome: "Quarteto de Blush",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Quatro tons versáteis com textura aveludada, que entregam cor suave, esfumado fácil e um toque de luminosidade na pele.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 9,
    categoria: "MAKE",
    nome: "Blush Líquido Fabella",
    preco: 18.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura leve, fácil de espalhar, entrega cor natural e efeito saudável que dura o dia todo.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 10,
    categoria: "MAKE",
    nome: "Paleta de Blush/Contorno CARLA SECRET",
    preco: 55.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Blush e contorno de textura cremosa, fáceis de esfumar e com tons versáteis para um acabamento natural e bem definido.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 11,
    categoria: "MAKE",
    nome: "Iluminador Líquido FABELLA",
    preco: 18.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura leve e luminosa que realça a pele com brilho radiante e natural.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 12,
    categoria: "MAKE",
    nome: "Caneta de sobrancelha",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Ponta precisa que preenche fio a fio, garantindo definição natural e longa duração.",
    imagens: [IMAGEM_PADRAO],
  },

  // OLHOS E SOBRANCELHAS
  {
    id: 13,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Paleta de sobrancelha",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Tons versáteis, textura macia e fácil de aplicar para corrigir, definir e preencher com naturalidade.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 14,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Caneta de sobrancelha",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Ponta precisa que preenche fio a fio, garantindo definição natural e longa duração.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 15,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Gel de sobrancelha CHANDELLE",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao: "Fixa, modela e mantém os fios no lugar com efeito natural e duradouro.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 16,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Gel de sobrancelha MIA MAKE",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Modela, fixa e define os fios, garantindo sobrancelhas alinhadas e naturalmente bonitas.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 17,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Gel de sobrancelha RUBY ROSE",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Fixa e define os fios, proporcionando sobrancelhas alinhadas com acabamento natural.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 18,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Paleta de sombra SARAH’S",
    preco: 25.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Cores pigmentadas, textura macia e fácil de esfumar, perfeita para criar desde looks suaves até marcantes.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 19,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Delineador PLAYBOY",
    preco: 12.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Alta pigmentação, secagem rápida e ponta precisa para traços definidos e duradouros.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 20,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Cola de cílios",
    preco: 10.0,
    precoAntigo: 0,
    promocao: false,
    descricao: "Secagem rápida e alta fixação para garantir aplicação segura e longa duração.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 21,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Rímel FABELLA",
    preco: 17.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Alonga, define e dá volume aos cílios, garantindo olhar marcante e longa duração.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 22,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Rímel MELU",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Alonga e dá volume, é à prova d’água e não mancha, garantindo cílios impecáveis o dia todo.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 23,
    categoria: "OLHOS E SOBRANCELHAS",
    nome: "Lápis de olho",
    preco: 6.0,
    precoAntigo: 0,
    promocao: false,
    descricao: "Textura macia e pigmentação intensa para um traço preciso e duradouro.",
    imagens: [IMAGEM_PADRAO],
  },

  // LÁBIOS
  {
    id: 24,
    categoria: "LÁBIOS",
    nome: "Lápis de boca",
    preco: 10.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura macia, alta pigmentação e precisão para contornar e definir os lábios com facilidade.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 25,
    categoria: "LÁBIOS",
    nome: "Batom (lip combo)",
    preco: 23.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Batom e lápis de contorno com textura macia, alta pigmentação e acabamento uniforme para lábios definidos e irresistíveis.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 26,
    categoria: "LÁBIOS",
    nome: "Gloss Brilho",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura leve, efeito espelhado e acabamento iluminado que realça os lábios sem pesar.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 27,
    categoria: "LÁBIOS",
    nome: "Gloss Max Love",
    preco: 15.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura leve e confortável, proporcionando lábios hidratados com acabamento natural.",
    imagens: [IMAGEM_PADRAO],
  },

  // ACESSÓRIOS
  {
    id: 28,
    categoria: "ACESSÓRIOS",
    nome: "Esponja",
    preco: 5.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Macia e de alta precisão, ideal para aplicar e espalhar a maquiagem com acabamento uniforme e natural.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 29,
    categoria: "ACESSÓRIOS",
    nome: "Kit de pincéis p/ bolsa",
    preco: 17.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Compacto e prático, com pincéis essenciais para retoques rápidos e acabamento perfeito em qualquer lugar.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 30,
    categoria: "ACESSÓRIOS",
    nome: "Mini Esponja",
    preco: 2.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Macia e precisa, perfeita para aplicar corretivo e alcançar áreas menores com acabamento impecável.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 31,
    categoria: "ACESSÓRIOS",
    nome: "Esponja p/ pó",
    preco: 2.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Macia e aveludada, ideal para aplicar e selar a maquiagem com acabamento suave e uniforme.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 32,
    categoria: "ACESSÓRIOS",
    nome: "Mini esponja p/ pó",
    preco: 2.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Aveludada e precisa, perfeita para selar áreas menores com acabamento suave e impecável.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 33,
    categoria: "ACESSÓRIOS",
    nome: "Kit pincéis",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Cerdas macias e alta precisão para aplicar, esfumar e finalizar a maquiagem com acabamento profissional.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 34,
    categoria: "ACESSÓRIOS",
    nome: "Faixa",
    preco: 10.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Macia e ajustável, mantém o cabelo no lugar durante a maquiagem e cuidados com a pele.",
    imagens: [IMAGEM_PADRAO],
  },

  // CORPORAL
  {
    id: 35,
    categoria: "CORPORAL",
    nome: "Hidratante corporal",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Textura leve, rápida absorção e hidratação prolongada que deixa a pele macia e perfumada.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 36,
    categoria: "CORPORAL",
    nome: "Esfoliante corporal",
    preco: 20.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Remove células mortas, deixa a pele mais lisa e macia, renovada desde a primeira aplicação.",
    imagens: [IMAGEM_PADRAO],
  },
  {
    id: 37,
    categoria: "CORPORAL",
    nome: "Lenço Demaquilante",
    preco: 15.0,
    precoAntigo: 0,
    promocao: false,
    descricao:
      "Remove a maquiagem com facilidade, limpa suavemente e deixa a pele fresca e macia.",
    imagens: [IMAGEM_PADRAO],
  },
];
