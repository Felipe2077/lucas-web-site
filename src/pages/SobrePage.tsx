// src/pages/SobrePage.tsx

import {
  PortableText,
  type PortableTextComponentProps,
} from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import imageUrlBuilder from '@sanity/image-url';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getClient } from '../lib/sanity.client';
import type {
  Conquista as ConquistaType,
  PaginaSobreData,
  SanityImageObject,
} from '../types/sanity';

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
    console.error('Erro no builder.image(source):', error, 'Source:', source);
    return null;
  }
}

// Query GROQ para buscar os dados da página "Sobre"
const paginaSobreQuery = `*[_type == "paginaSobre"][0]{
  _id,
  titulo,
  imagemPrincipal{alt, asset->},
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
  }, []);

  // Componentes customizados para PortableText
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
          <motion.figure
            className={`my-8 ${value.isInline ? 'inline-block' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src={imageUrl}
                alt={value.alt || pagina?.titulo || 'Imagem da biografia'}
                className={`w-full ${value.isInline ? 'max-w-xs' : ''}`}
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none' />
            </div>
            {value.legenda && (
              <figcaption className='text-sm text-center text-gray-500 dark:text-gray-400 mt-3 font-medium'>
                {value.legenda}
              </figcaption>
            )}
          </motion.figure>
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
              className='text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-300 font-medium'
            >
              {children}
            </a>
          );
        }
        return href ? (
          <Link
            to={href}
            className='text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-300 font-medium'
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
        <motion.h2
          className='font-heading text-3xl md:text-4xl font-bold mt-12 mb-6 text-white'
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
            {props.children}
          </span>
        </motion.h2>
      ),
      h3: (props: PortableTextComponentProps<PortableTextBlock>) => (
        <motion.h3
          className='font-heading text-2xl md:text-3xl font-semibold mt-10 mb-4 text-gray-100'
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {props.children}
        </motion.h3>
      ),
      blockquote: (props: PortableTextComponentProps<PortableTextBlock>) => (
        <motion.blockquote
          className='relative border-l-4 border-blue-400 bg-blue-500/10 backdrop-blur-sm pl-6 pr-6 py-4 italic my-8 rounded-r-xl text-gray-200 font-medium'
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className='absolute top-2 left-2 text-blue-400/30 text-4xl font-serif'>
            "
          </div>
          {props.children}
        </motion.blockquote>
      ),
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <ul className='list-none pl-0 my-6 space-y-3'>{children}</ul>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <ol className='list-none pl-0 my-6 space-y-3 counter-reset-[custom-counter]'>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <motion.li
          className='flex items-start gap-3 text-gray-300'
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className='w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0' />
          <span>{children}</span>
        </motion.li>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <motion.li
          className='flex items-start gap-3 text-gray-300 counter-increment-[custom-counter]'
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className='w-6 h-6 bg-blue-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 before:content-[counter(custom-counter)]' />
          <span>{children}</span>
        </motion.li>
      ),
    },
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <motion.div
            className='w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className='text-gray-400 animate-pulse'>
            Carregando informações...
          </p>
        </div>
      </div>
    );
  }

  if (!pagina) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <Helmet>
            <title>Sobre o Piloto - Informações não encontradas</title>
          </Helmet>
          <h1 className='text-3xl font-bold text-white mb-4'>Ops!</h1>
          <p className='text-gray-400 mb-8'>
            Informações da página Sobre não encontradas.
          </p>
          <Link
            to='/'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${pagina.titulo || 'Sobre o Piloto'} - Lucas Foresti`}</title>
        <meta
          name='description'
          content={`Saiba mais sobre a carreira e trajetória de ${
            pagina.titulo || 'Lucas Foresti'
          }.`}
        />
      </Helmet>

      <div className='min-h-screen bg-black text-white'>
        {/* Header compacto */}
        <section className='pt-32 pb-12 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden'>
          {/* Background Effects */}
          <div className='absolute inset-0'>
            <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]' />

            <motion.div
              className='absolute top-1/4 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl'
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className='absolute bottom-1/4 -right-40 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl'
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className='container mx-auto px-4 relative z-10'>
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
              >
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
                  Biografia Completa
                </span>
              </motion.div>

              <h1 className='font-heading text-5xl md:text-6xl font-black mb-4'>
                Sobre{' '}
                <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                  {pagina.titulo || 'Lucas Foresti'}
                </span>
              </h1>

              <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-8'>
                Conheça a história, trajetória e conquistas que moldaram a
                carreira de um piloto dedicado
              </p>

              {/* Breadcrumb */}
              <nav className='flex justify-center'>
                <ol className='flex items-center space-x-2 text-sm text-gray-400'>
                  <li>
                    <Link
                      to='/'
                      className='hover:text-blue-400 transition-colors'
                    >
                      Início
                    </Link>
                  </li>
                  <li>
                    <svg
                      className='w-4 h-4 mx-2'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </li>
                  <li className='text-blue-400'>Sobre</li>
                </ol>
              </nav>
            </motion.div>
          </div>
        </section>

        {/* Biography Section */}
        {pagina.biografia && (
          <section className='py-20 bg-gradient-to-b from-black to-gray-900'>
            <div className='container mx-auto px-4'>
              <motion.div
                className='max-w-4xl mx-auto'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className='prose prose-lg prose-invert max-w-none'>
                  <PortableText
                    value={pagina.biografia}
                    components={portableTextComponents}
                  />
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {pagina.conquistas && pagina.conquistas.length > 0 && (
          <section className='py-20 bg-gradient-to-b from-gray-900 to-black'>
            <div className='container mx-auto px-4'>
              <motion.div
                className='text-center mb-16'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className='inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-md rounded-full mb-6'
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse' />
                  <span className='text-orange-400 font-semibold uppercase tracking-wider text-sm'>
                    Marcos da Carreira
                  </span>
                </motion.div>

                <h2 className='font-heading text-4xl md:text-5xl font-bold mb-4'>
                  <span className='bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text'>
                    Conquistas
                  </span>
                </h2>
                <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
                  Marcos importantes de uma carreira dedicada ao automobilismo
                </p>
              </motion.div>

              <div className='max-w-4xl mx-auto'>
                <div className='space-y-6'>
                  {pagina.conquistas.map((conquista: ConquistaType, index) => (
                    <motion.div
                      key={conquista._key}
                      className='group relative'
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className='relative p-6 md:p-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/20'>
                        {/* Year badge */}
                        {conquista.ano && (
                          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-black text-lg rounded-full mb-4 shadow-lg'>
                            {conquista.ano}
                          </div>
                        )}

                        {/* Description */}
                        <p className='text-gray-100 text-lg leading-relaxed'>
                          {conquista.descricao}
                        </p>

                        {/* Decorative elements */}
                        <div className='absolute top-4 right-4 text-6xl text-orange-500/10 font-black'>
                          #{index + 1}
                        </div>

                        {/* Glow effect */}
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500 pointer-events-none' />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className='py-20 bg-black relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10' />

          <div className='container mx-auto px-4 relative z-10'>
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                Continue{' '}
                <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                  Explorando
                </span>
              </h3>
              <p className='text-xl text-gray-400 mb-8 max-w-2xl mx-auto'>
                Descubra mais sobre a jornada, resultados e bastidores da
                carreira
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  to='/galeria'
                  className='group relative inline-flex items-center gap-2 px-8 py-4 overflow-hidden rounded-full'
                >
                  <span className='relative z-10 text-white font-bold uppercase tracking-wider'>
                    Ver Galeria
                  </span>
                  <svg
                    className='relative z-10 w-5 h-5 text-white group-hover:translate-x-2 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full' />
                  <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full'
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>

                <Link
                  to='/calendario'
                  className='group inline-flex items-center gap-2 px-8 py-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full font-bold uppercase tracking-wider transition-all duration-300'
                >
                  <span>Próximas Corridas</span>
                  <svg
                    className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
