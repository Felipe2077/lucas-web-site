// src/lib/sanity.client.ts
import { apiVersion, dataset, projectId, useCdn } from '@/lib/sanity.env'; // Este já deve usar import.meta.env
import { createClient, type SanityClient } from '@sanity/client';

export function getClient(): SanityClient {
  // console.log('[sanity.client.ts] getClient chamada. Usando config:', { projectId, dataset, apiVersion, useCdn }); // Log de depuração

  const client = createClient({
    projectId, // Vem de sanity.env.ts (que usa import.meta.env)
    dataset, // Vem de sanity.env.ts
    apiVersion, // Vem de sanity.env.ts
    useCdn, // Vem de sanity.env.ts (import.meta.env.PROD)
    perspective: 'published', // Busca apenas conteúdo publicado por padrão
    // Removida a lógica de 'token' e 'previewToken' que poderia usar process.env
  });
  return client;
}

// Certifique-se de que não há mais nenhuma linha neste arquivo tentando acessar process.env
// especialmente definições de 'token' no escopo do módulo.
