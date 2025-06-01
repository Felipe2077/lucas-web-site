// src/pages/SobrePage.tsx

import {
  PortableText,
  type PortableTextComponentProps,
} from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import imageUrlBuilder from '@sanity/image-url';
import type { ReactNode } from 'react'; // Para portableTextComponents
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
import type {
  Conquista as ConquistaType,
  PaginaSobreData,
  SanityImageObject,
} from '../types/sanity'; // Ajuste o caminho e os nomes dos tipos
import type { Link } from 'react-router-dom';
// Não precisamos mais de Image de 'next/image' aqui, usaremos <img>

// Configura o builder de URL de imagem do Sanity
const clientInstance = getClient(); // Obter instância uma vez
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
    console.error('Erro no builder.image(source):', error, 'Source:', source);
    return null;
  }
}

// Query GROQ para buscar os dados da página "Sobre"
const paginaSobreQuery = `*[_type == "paginaSobre"][0]{
  _id,
  titulo,
  imagemPrincipal{alt, asset->}, // Buscando alt e expandindo asset
  biografia[]{
    ...,
    _type == "image" => { 
      alt,
      asset-> 
    },
    markDefs[]{ ..., _type == "link" => { "href": @.href, "blank": @.blank } }
  },
  conquistas[]{_key, ano, descricao}
}`;

export default function SobrePage() {
  const [pagina, setPagina] = useState<PaginaSobreData | null | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getClient();
    const fetchPaginaSobre = async () => {
      setLoading(true);
      try {
        const data: PaginaSobreData | null = await client.fetch(
          paginaSobreQuery
        );
        setPagina(data);
      } catch (error) {
        console.error('Erro ao buscar dados da página Sobre:', error);
        setPagina(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPaginaSobre();
  }, []); // Roda uma vez na montagem

  // Componentes customizados para PortableText (reutilize/adapte da sua definição centralizada se tiver)
  const portableTextComponents = {
    types: {
      image: ({
        value,
      }: {
        value: SanityImageObject & { alt?: string; isInline?: boolean };
      }) => {
        const imageUrl = urlFor(value)?.fit('max').auto('format').url();
        if (!imageUrl) return null;
        return (
          <figure className={`my-6 ${value.isInline ? 'inline-block' : ''}`}>
            <img
              src={imageUrl}
              alt={value.alt || pagina?.titulo || 'Imagem da biografia'}
              className={`rounded-md w-full ${
                value.isInline ? 'max-w-xs' : 'shadow-lg'
              }`}
              loading='lazy'
            />
            {value.legenda && (
              <figcaption className='text-sm text-center text-gray-600 dark:text-gray-400 mt-2'>
                {value.legenda}
              </figcaption>
            )}
          </figure>
        );
      },
    },
    marks: {
      link: ({
        children,
        value,
      }: {
        children: ReactNode;
        value?: { href?: string; blank?: boolean };
      }) => {
        const href = value?.href;
        const isExternal =
          value?.blank ||
          (href && !href.startsWith('/') && !href.startsWith('#'));
        if (
          isExternal ||
          (href && (href.startsWith('http://') || href.startsWith('https://')))
        ) {
          return (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-piloto-blue hover:underline dark:text-piloto-blue-light'
            >
              {children}
            </a>
          );
        }
        return href ? (
          <Link
            to={href}
            className='text-piloto-blue hover:underline dark:text-piloto-blue-light'
          >
            {children}
          </Link>
        ) : (
          <>{children}</>
        );
      },
    },
    block: {
      h2: (props: PortableTextComponentProps<PortableTextBlock>) => (
        <h2 className='font-heading text-2xl md:text-3xl font-semibold mt-8 mb-4'>
          {props.children}
        </h2>
      ),
      h3: (props: PortableTextComponentProps<PortableTextBlock>) => (
        <h3 className='font-heading text-xl md:text-2xl font-semibold mt-6 mb-3'>
          {props.children}
        </h3>
      ),
      blockquote: (props: PortableTextComponentProps<PortableTextBlock>) => (
        <blockquote className='border-l-4 border-piloto-blue-light dark:border-piloto-blue pl-4 italic my-6 py-2 text-gray-700 dark:text-gray-300'>
          {props.children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <ul className='list-disc pl-5 my-4 space-y-1 dark:text-gray-300'>
          {children}
        </ul>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <ol className='list-decimal pl-5 my-4 space-y-1 dark:text-gray-300'>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <li className='pb-1'>{children}</li>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <li className='pb-1'>{children}</li>
      ),
    },
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-16 text-center animate-pulse'>
        Carregando informações...
      </div>
    );
  }

  if (!pagina) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Helmet>
          <title>Sobre o Piloto - Informações não encontradas</title>
        </Helmet>
        Informações da página Sobre não encontradas.
      </div>
    );
  }

  const imageUrlPrincipal = pagina.imagemPrincipal
    ? urlFor(pagina.imagemPrincipal)
        ?.width(1200)
        .auto('format')
        .quality(80)
        .url()
    : null;

  return (
    <>
      <Helmet>
        <title>{`${pagina.titulo || 'Sobre o Piloto'} - Lucas Foresti`}</title>
        {/* Adicione uma meta descrição aqui, talvez de um campo do Sanity */}
        <meta
          name='description'
          content={`Saiba mais sobre a carreira e trajetória de ${
            pagina.titulo || 'Lucas Foresti'
          }.`}
        />
      </Helmet>
      <div className='container mx-auto px-4 py-8 md:py-12 animate-fade-in'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10'>
          {pagina.titulo || 'Sobre o Piloto'}
        </h1>

        {imageUrlPrincipal && (
          <div className='mb-10 relative w-full mx-auto max-w-2xl md:max-w-3xl aspect-[4/3] rounded-lg overflow-hidden shadow-xl'>
            <img // Usando <img> padrão
              src={imageUrlPrincipal}
              alt={
                pagina.imagemPrincipal?.alt ||
                pagina.titulo ||
                'Imagem do Piloto'
              }
              className='w-full h-full object-cover'
              loading='lazy'
            />
          </div>
        )}

        {pagina.biografia && (
          <div
            className='prose prose-lg dark:prose-invert max-w-3xl mx-auto mb-12 
                          prose-headings:font-heading prose-a:text-piloto-blue hover:prose-a:underline
                          dark:prose-a:text-piloto-blue-light'
          >
            <PortableText
              value={pagina.biografia}
              components={portableTextComponents}
            />
          </div>
        )}

        {pagina.conquistas && pagina.conquistas.length > 0 && (
          <section className='max-w-3xl mx-auto'>
            <h2 className='font-heading text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left'>
              Principais Conquistas
            </h2>
            <ul className='space-y-4'>
              {pagina.conquistas.map(
                (
                  conquista: ConquistaType // Explicitando o tipo aqui
                ) => (
                  <li
                    key={conquista._key}
                    className='p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm'
                  >
                    {conquista.ano && (
                      <p className='font-semibold text-piloto-blue dark:text-piloto-blue-light'>
                        {conquista.ano}
                      </p>
                    )}
                    <p className='text-gray-700 dark:text-gray-300'>
                      {conquista.descricao}
                    </p>
                  </li>
                )
              )}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
