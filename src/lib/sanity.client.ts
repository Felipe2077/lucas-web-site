// src/lib/sanity.client.ts - Versão corrigida para CORS
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageObject } from '../types/sanity';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '5w3msavv';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

// Debug para produção
console.log('🔧 Sanity Environment Variables:', {
  projectId,
  dataset,
  apiVersion,
  env: import.meta.env.MODE,
});

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ❌ MUDAR PARA FALSE - Resolve CORS em localhost
  token: undefined, // Não usar token para leitura pública
  ignoreBrowserTokenWarning: true,
  perspective: 'published',
  stega: false,
  // Configurações adicionais para resolver CORS:
  requestTagPrefix: 'sanity',
  allowReconfigure: true,
});

export const getClient = () => client;

// Configurar o builder de URLs de imagem
const builder = imageUrlBuilder(client);

// Função para gerar URLs de imagens
export function urlFor(source: SanityImageObject | null | undefined) {
  if (!source) return null;

  try {
    if (source.asset?._ref) {
      return builder.image(source.asset._ref);
    } else if (source._ref) {
      return builder.image(source._ref);
    }
    return builder.image(source);
  } catch (error) {
    console.warn('⚠️ Erro ao gerar URL da imagem:', error);
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
    console.warn('⚠️ Erro ao gerar URL da imagem:', error);
    return '';
  }
}

// Função de teste de conexão com melhor tratamento de erro
export async function testSanityConnection() {
  try {
    console.log('🔍 Testando conexão com Sanity...');
    const result = await client.fetch('*[_type == "categoria"][0]');
    console.log('✅ Sanity connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error);

    // Testar com fetch direto para diagnosticar melhor
    try {
      const directUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type == "categoria"][0]`;
      console.log('🔍 Testando URL direta:', directUrl);

      const response = await fetch(directUrl);
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct fetch successful:', data);
      } else {
        console.error('❌ Direct fetch failed:', response.statusText);
      }
    } catch (directError) {
      console.error('❌ Direct fetch error:', directError);
    }

    return false;
  }
}
