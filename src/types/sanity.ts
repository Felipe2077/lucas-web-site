// src/types/sanity.ts
import type { PortableTextBlock } from '@portabletext/types';

// Interface base para o campo 'slug' do Sanity
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// Interface base para uma referência de asset de imagem do Sanity
export interface SanityAssetReference {
  _ref: string;
  _type: 'reference';
}

// Interface para um objeto de imagem do Sanity, incluindo o asset e metadados opcionais
export interface SanityImageObject {
  _type: 'image';
  asset: SanityAssetReference;
  alt?: string; // Se você tiver um campo 'alt' no seu schema de imagem no Sanity
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// --- Tipos Específicos para Seus Documentos Sanity ---

export interface Categoria {
  _id: string;
  nome: string;
  slug: SanitySlug;
  descricao?: string;
}

// Notícia para listagens e cards (pode ser mais concisa)
export interface NoticiaCard {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  dataDePublicacao: string;
  imagemDeCapa?: SanityImageObject;
  resumo?: string;
  // Se quiser exibir categorias simplificadas no card:
  // categorias?: Array<{ nome?: string }>;
}

// Notícia detalhada (para a página individual)
export interface NoticiaDetalhada {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  dataDePublicacao: string;
  imagemDeCapa?: SanityImageObject;
  conteudo: PortableTextBlock[]; // Conteúdo Rich Text
  categorias?: Array<{
    // Informações mais detalhadas da categoria se necessário
    _id: string;
    nome: string;
    slug: SanitySlug;
  }>;
  resumo?: string;
}

// Para a Página Sobre
export interface Conquista {
  _key: string; // Sanity usa _key para itens em um array de objetos
  ano?: string;
  descricao?: string;
}

export interface PaginaSobreData {
  _id: string; // ID do documento singleton
  titulo?: string;
  imagemPrincipal?: SanityImageObject;
  biografia?: PortableTextBlock[];
  conquistas?: Conquista[];
}
