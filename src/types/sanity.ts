// src/types/sanity.ts
import { PortableTextBlock } from '@portabletext/types';

// Tipo base para referências do Sanity
export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

// Tipo base para slugs
export interface Slug {
  _type: 'slug';
  current: string;
}

// Alias para compatibilidade
export type SanitySlug = Slug;

// Tipo para imagens do Sanity
export interface SanityImageObject {
  _type: 'image';
  asset: SanityReference;
  _key?: string;
  _ref?: string;
  alt?: string;
  legenda?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Tipo para categorias
export interface Categoria {
  _id: string;
  _type: 'categoria';
  nome: string;
  slug: Slug;
  descricao?: string;
}

// Tipo para notícias
export interface NoticiaCard {
  _id: string;
  _type: 'noticia';
  titulo: string;
  slug: Slug;
  imagemDeCapa?: SanityImageObject;
  resumo?: string;
  dataPublicacao: string;
  dataDePublicacao?: string; // Alias para compatibilidade
  categoria?: Categoria;
  categorias?: Categoria[]; // Para múltiplas categorias
  conteudo?: PortableTextBlock[];
}

// Tipo para notícia detalhada (herda de NoticiaCard)
export interface NoticiaDetalhada extends NoticiaCard {
  conteudo: PortableTextBlock[];
  autor?: string;
  tags?: string[];
}

// Tipo para eventos/corridas
export interface Evento {
  _id: string;
  _type: 'evento';
  nome: string;
  nomeDoEvento?: string; // Alias para compatibilidade
  data: string;
  hora?: string;
  local?: string;
  circuito?: string;
  cidade?: string;
  tipo: 'corrida' | 'treino' | 'classificacao';
  resultado?: string;
  posicao?: number;
  status: 'agendado' | 'em_andamento' | 'finalizado';
}

// Tipo para fotos de álbum
export interface FotoDoAlbum extends SanityImageObject {
  _key: string;
  alt?: string;
  legenda?: string;
}

// Tipo para álbuns de fotos
export interface AlbumDeFotos {
  _id: string;
  _type: 'albumDeFotos';
  titulo: string;
  slug: Slug;
  descricao?: string;
  imagemDeCapa?: SanityImageObject;
  images: FotoDoAlbum[];
  dataEvento?: string;
  emDestaque?: boolean;
}

// Tipo para patrocinadores
export interface Patrocinador {
  _id: string;
  _type: 'patrocinador';
  nome: string;
  logo?: SanityImageObject;
  site?: string;
  descricao?: string;
  corGradiente?: string;
  ordem?: number;
}

// Tipo para página sobre
export interface PaginaSobre {
  _id: string;
  _type: 'paginaSobre';
  titulo?: string;
  imagemPrincipal?: SanityImageObject;
  conteudo?: PortableTextBlock[];
  biografia?: PortableTextBlock[];
  conquistas?: Conquista[];
}

// Alias para compatibilidade
export type PaginaSobreData = PaginaSobre;

// Tipo para conquistas
export interface Conquista {
  _key: string;
  titulo: string;
  ano?: number;
  descricao?: string;
  categoria?: string;
}

// Tipo para configurações de contato
export interface ConfiguracoesContato {
  _id: string;
  _type: 'configuracoesContato';
  email?: string;
  telefone?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  endereco?: string;
}

// Tipos para componentes específicos
export interface ProximaCorridaData {
  evento?: Evento;
  nomeDoEvento?: string;
  circuito?: string;
  cidade?: string;
  dataFormatada?: string;
  diasRestantes?: number;
}

export interface CountdownUnitProps {
  value: number;
  label: string;
  delay: number;
}

export interface HomeData {
  ultimasNoticias: NoticiaCard[];
  proximaCorrida?: Evento;
  teaserAlbuns: AlbumDeFotos[];
  paginaSobre?: PaginaSobre;
}
