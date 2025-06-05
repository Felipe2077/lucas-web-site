// src/pages/PatrocinadoresPage.tsx
// 'use client'; // Não estritamente necessário para hooks no Vite, mas não prejudica.

import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useState } from 'react';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
// import { groq } from 'next-sanity'; // Usaremos strings simples
import { Helmet } from 'react-helmet-async';
import type { SanityImageObject } from '../types/sanity'; // Ajuste o caminho
// O componente Image do Next.js não é usado aqui, usaremos <img>
// import Image from 'next/image'; // Remova se não for usar para nada

// Interface para Patrocinador (pode vir de @/types/sanity)
interface Patrocinador {
  _id: string;
  nome: string;
  logo: SanityImageObject & { alt?: string }; // Certifique-se que SanityImageObject tem 'alt' e 'asset'
  link?: string;
  ordem?: number;
}

// Configura o builder de URL de imagem do Sanity
const clientInstance = getClient();
const builder = imageUrlBuilder(clientInstance);

function urlFor(
  source: SanityImageObject | null | undefined
): ReturnType<typeof builder.image> | null {
  if (!source || (!source.asset && !source._ref)) {
    return null;
  }
  try {
    return builder.image(source);
  } catch (error) {
    console.error(
      'Erro no builder.image(source) para Patrocinadores:',
      error,
      'Source:',
      source
    );
    return null;
  }
}

const patrocinadoresQuery = `*[_type == "patrocinador"]{
  _id,
  nome,
  logo{alt, asset->}, // Incluindo 'alt' da imagem e expandindo 'asset'
  link,
  ordem
} | order(ordem asc, nome asc)`; // Ordena por 'ordem' e depois por 'nome'

export default function PatrocinadoresPage() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [loading, setLoading] = useState(true);
  const nomeDoPiloto = 'Lucas Foresti'; // Substitua ou busque dinamicamente

  useEffect(() => {
    const client = getClient();
    const fetchPatrocinadores = async () => {
      setLoading(true);
      try {
        const data: Patrocinador[] = await client.fetch(patrocinadoresQuery);
        setPatrocinadores(data);
      } catch (error) {
        console.error('Erro ao buscar patrocinadores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatrocinadores();
  }, []); // Roda uma vez na montagem

  return (
    <>
      <Helmet>
        <title>{`Patrocinadores - ${nomeDoPiloto}`}</title>
        <meta
          name='description'
          content={`Conheça os patrocinadores e parceiros que apoiam o piloto ${nomeDoPiloto}.`}
        />
      </Helmet>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16'>
          Nossos Patrocinadores
        </h1>

        {loading ? (
          <p className='text-center animate-pulse'>
            Carregando patrocinadores...
          </p>
        ) : patrocinadores && patrocinadores.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 items-center'>
            {patrocinadores.map((patrocinador) => {
              const logoBuilderInstance = patrocinador.logo
                ? urlFor(patrocinador.logo)
                : null;
              const logoSrc = logoBuilderInstance
                ? logoBuilderInstance
                    .height(100)
                    .fit('max')
                    .auto('format')
                    .quality(85)
                    .url()
                : '/img/placeholder-logo.png'; // Crie um placeholder

              const sponsorContent = (
                <div className='aspect-video sm:aspect-[3/2] relative flex items-center justify-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-md hover:shadow-lg transition-shadow duration-300 h-32 md:h-36'>
                  {' '}
                  {/* Altura fixa para os cards */}
                  {patrocinador.logo?.asset && logoBuilderInstance ? (
                    <img // Usando <img> padrão
                      src={logoSrc}
                      alt={patrocinador.logo.alt || `Logo ${patrocinador.nome}`}
                      className='max-h-full max-w-full object-contain' // Garante que o logo caiba
                      loading='lazy'
                    />
                  ) : (
                    <span className='text-xs text-gray-400'>
                      Logo Indisponível
                    </span>
                  )}
                </div>
              );

              return (
                <div
                  key={patrocinador._id}
                  className='text-center flex flex-col items-center'
                >
                  {patrocinador.link ? (
                    <a
                      href={patrocinador.link}
                      target='_blank'
                      rel='noopener noreferrer sponsored'
                      aria-label={`Visite o site de ${patrocinador.nome}`}
                      className='block w-full'
                    >
                      {sponsorContent}
                    </a>
                  ) : (
                    <div className='w-full'>{sponsorContent}</div>
                  )}
                  <p className='mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 truncate w-full px-1 h-10 flex items-center justify-center'>
                    {' '}
                    {/* Altura fixa para o nome */}
                    {patrocinador.nome}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-center text-gray-600 dark:text-gray-400'>
            Em breve, informações sobre nossos valiosos parceiros.
          </p>
        )}
      </div>
    </>
  );
}
