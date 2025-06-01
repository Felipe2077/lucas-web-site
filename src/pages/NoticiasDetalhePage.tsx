// src/pages/NoticiasDetalhePage.tsx

import {
  PortableText,
  type PortableTextComponentProps,
} from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import imageUrlBuilder from '@sanity/image-url';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'; // Para meta tags
import { Link, useParams } from 'react-router-dom';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho se necessário
import type { NoticiaDetalhada, SanityImageObject } from '../types/sanity'; // Ajuste o caminho

// Configura o builder de URL de imagem do Sanity
const clientInstance = getClient(); // Obter instância uma vez
const builder = imageUrlBuilder(clientInstance);

function urlFor(source: SanityImageObject) {
  if (!source?.asset) return ''; // Retorna string vazia se não houver asset
  return builder.image(source);
}

// Query GROQ para buscar uma notícia específica pelo seu slug
const noticiaQuery = `*[_type == "noticia" && slug.current == $slug][0]{
  _id,
  titulo,
  slug,
  dataDePublicacao,
  imagemDeCapa{alt, asset->}, // Buscando alt e expandindo asset
  resumo, // Para meta description
  conteudo[]{
    ...,
    _type == "image" => {
      alt,
      asset->
    },
    markDefs[]{
      ...,
      _type == "link" => {
        "href": @.href,
        "blank": @.blank // Para abrir links externos em nova aba
      }
    }
  },
  // categorias[]->{_id, nome, slug} // Descomente se quiser exibir categorias
}`;

export default function NoticiasDetalhePage() {
  const { slug } = useParams<{ slug: string }>(); // Pega o slug da URL
  const [noticia, setNoticia] = useState<NoticiaDetalhada | null | undefined>(
    undefined
  ); // undefined para estado inicial de não carregado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const client = getClient(); // Pode ser a instância do módulo também
    const fetchNoticia = async () => {
      setLoading(true);
      try {
        const data: NoticiaDetalhada | null = await client.fetch(noticiaQuery, {
          slug,
        });
        setNoticia(data);
      } catch (error) {
        console.error('Erro ao buscar detalhe da notícia:', error);
        setNoticia(null); // Define como nulo em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [slug]); // Re-executa se o slug mudar

  // Componentes customizados para PortableText
  const portableTextComponents = {
    types: {
      image: ({
        value,
      }: {
        value: SanityImageObject & { alt?: string; isInline?: boolean };
      }) => {
        if (!value?.asset?._ref) {
          return null;
        }
        const imageUrl = urlFor(value).fit('max').auto('format').url();
        if (!imageUrl) return null;
        return (
          <figure className={`my-6 ${value.isInline ? 'inline-block' : ''}`}>
            <img // Usando <img> padrão
              src={imageUrl}
              alt={value.alt || noticia?.titulo || 'Imagem do conteúdo'}
              className={`rounded-md w-full ${
                value.isInline ? 'max-w-xs' : 'shadow-lg'
              }`} // Ajuste de estilo
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
      // Seus estilos de bloco (h2, h3, blockquote) como antes
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
        Carregando notícia...
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Helmet>
          <title>Notícia não encontrada</title>
        </Helmet>
        <h1 className='font-heading text-3xl font-bold mb-4'>
          Notícia não encontrada.
        </h1>
        <Link to='/noticias' className='text-piloto-blue hover:underline'>
          &larr; Voltar para todas as notícias
        </Link>
      </div>
    );
  }

  const dataFormatada = new Date(noticia.dataDePublicacao).toLocaleDateString(
    'pt-BR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }
  );
  const imageUrlCapa = noticia.imagemDeCapa
    ? urlFor(noticia.imagemDeCapa).width(1200).auto('format').quality(80).url()
    : null;

  return (
    <>
      <Helmet>
        <title>{`${noticia.titulo} - Notícias`}</title>
        {noticia.resumo && <meta name='description' content={noticia.resumo} />}
        {/* Adicione outras meta tags aqui, como og:image com imageUrlCapa */}
      </Helmet>
      <article className='container mx-auto px-4 py-8 md:py-12 max-w-3xl'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3'>
          {noticia.titulo}
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mb-6'>
          Publicado em {dataFormatada}
        </p>

        {imageUrlCapa && (
          <div className='mb-8 relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg'>
            <img // Usando <img> padrão
              src={imageUrlCapa}
              alt={
                noticia.imagemDeCapa?.alt ||
                `Imagem de capa para ${noticia.titulo}`
              }
              className='w-full h-full object-cover'
              loading='lazy'
            />
          </div>
        )}

        {noticia.conteudo && (
          // Aplicando classes de prosa do Tailwind para estilizar o conteúdo do PortableText
          <div
            className='prose prose-lg dark:prose-invert max-w-none 
                          prose-headings:font-heading prose-h2:text-2xl prose-h3:text-xl 
                          prose-a:text-piloto-blue hover:prose-a:underline
                          dark:prose-a:text-piloto-blue-light'
          >
            <PortableText
              value={noticia.conteudo}
              components={portableTextComponents}
            />
          </div>
        )}

        <div className='mt-12 text-center'>
          <Link
            to='/noticias'
            className='text-piloto-blue hover:underline font-semibold'
          >
            &larr; Voltar para todas as notícias
          </Link>
        </div>
      </article>
    </>
  );
}
