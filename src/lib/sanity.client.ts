// src/lib/sanity.client.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageObject } from '../types/sanity';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '5w3msavv';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` se você quer garantir dados frescos
});

export const getClient = () => client;

// Configurar o builder de URLs de imagem
const builder = imageUrlBuilder(client);

// Função para gerar URLs de imagens - retorna null para ser type-safe
export function urlFor(source: SanityImageObject | null | undefined) {
  if (!source) return null;

  try {
    // Verificar se tem asset._ref ou apenas _ref
    if (source.asset?._ref) {
      return builder.image(source.asset._ref);
    } else if (source._ref) {
      return builder.image(source._ref);
    }

    // Fallback para o objeto completo
    return builder.image(source);
  } catch (error) {
    console.warn('Erro ao gerar URL da imagem:', error);
    return null;
  }
}

// Função helper para verificar se uma imagem é válida
export function isValidImage(
  source: SanityImageObject | null | undefined
): boolean {
  if (!source) return false;
  return !!(source.asset?._ref || source._ref);
}

// Função helper para obter URL de imagem com fallback seguro
export function getImageUrl(
  source: SanityImageObject | null | undefined,
  width?: number,
  height?: number
): string {
  const imageBuilder = urlFor(source);
  if (!imageBuilder) return '';

  try {
    let builder = imageBuilder.auto('format');
    if (width) builder = builder.width(width);
    if (height) builder = builder.height(height);
    return builder.url() || '';
  } catch (error) {
    console.warn('Erro ao gerar URL da imagem:', error);
    return '';
  }
}
