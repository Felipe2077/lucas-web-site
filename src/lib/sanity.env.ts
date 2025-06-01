// src/lib/sanity.env.ts (CORRIGIDO PARA VITE)

// Para apiVersion, podemos manter um fallback se a variável de ambiente não estiver definida
export const apiVersion =
  import.meta.env.VITE_SANITY_API_VERSION || '2024-05-31';

export const dataset = assertValue(
  import.meta.env.VITE_SANITY_DATASET || 'production',
  'Variável de ambiente ausente ou inválida: VITE_SANITY_DATASET (verifique seu arquivo .env)'
);

export const projectId = assertValue(
  import.meta.env.VITE_SANITY_PROJECT_ID || '5w3msavv',
  'Variável de ambiente ausente ou inválida: VITE_SANITY_PROJECT_ID (verifique seu arquivo .env)'
);

// Para useCdn, Vite fornece import.meta.env.PROD (booleano) ou import.meta.env.DEV (booleano)
export const useCdn = import.meta.env.PROD; // true em produção, false em desenvolvimento

// LOG ADICIONADO AQUI:
console.log(
  `[sanity.env.ts] VITE_SANITY_PROJECT_ID: "${
    import.meta.env.VITE_SANITY_PROJECT_ID
  }"`
);
console.log(`[sanity.env.ts] projectId final a ser exportado: "${projectId}"`);

// Helper para garantir que as variáveis de ambiente existam (pode ser mantido)
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || (typeof v === 'string' && v.trim() === '')) {
    // Lança erro se o valor (após tentar env var e fallback) for undefined ou string vazia
    // Isso é mais rigoroso, especialmente para projectId e dataset.
    // Se você quer permitir que o fallback seja usado sem erro mesmo se a env var estiver ausente,
    // você pode ajustar a lógica aqui ou remover o assertValue para apiVersion se o fallback for sempre aceitável.
    // Para projectId e dataset, é bom ter o assertValue.
    throw new Error(errorMessage);
  }
  return v;
}
