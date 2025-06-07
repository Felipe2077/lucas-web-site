// src/lib/imageUtils.ts - Criar este arquivo
import type { SanityImageObject } from '../types/sanity';

/**
 * Verifica se uma imagem do Sanity é válida
 */
export function isValidSanityImage(
  source: SanityImageObject | null | undefined
): boolean {
  if (!source) return false;

  // Verificar asset._ref (formato novo)
  if (
    source.asset &&
    typeof source.asset === 'object' &&
    '_ref' in source.asset
  ) {
    return !!source.asset._ref;
  }

  // Verificar _ref direto (formato antigo)
  if ('_ref' in source && source._ref) {
    return true;
  }

  return false;
}

/**
 * Obtém a referência da imagem para usar com urlFor
 */
export function getImageRef(source: SanityImageObject): string | null {
  if (!source) return null;

  // asset._ref tem prioridade
  if (
    source.asset &&
    typeof source.asset === 'object' &&
    '_ref' in source.asset
  ) {
    return source.asset._ref;
  }

  // Fallback para _ref direto
  if ('_ref' in source && source._ref) {
    return source._ref;
  }

  return null;
}

// Use esta função em todos os lugares onde você verifica imagens:
// Em vez de: if (!source || (!source.asset && !source._ref))
// Use: if (!isValidSanityImage(source))
