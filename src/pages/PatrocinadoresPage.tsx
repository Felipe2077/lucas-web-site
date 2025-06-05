// src/pages/PatrocinadoresPage.tsx
'use client';

import imageUrlBuilder from '@sanity/image-url';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getClient } from '../lib/sanity.client';
import type { SanityImageObject } from '../types/sanity';

// Interface para Patrocinador expandida
interface Patrocinador {
  _id: string;
  nome: string;
  categoria?: string;
  logo: SanityImageObject & { alt?: string };
  imagemDeFundo?: SanityImageObject & { alt?: string };
  descricaoCurta?: string;
  descricaoCompleta?: string;
  link?: string;
  ordem?: number;
  corGradiente?: string;
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

const patrocinadoresQuery = `*[_type == "patrocinador" && ativo == true]{
  _id,
  nome,
  categoria,
  logo{alt, asset->},
  imagemDeFundo{alt, asset->},
  descricaoCurta,
  descricaoCompleta,
  link,
  ordem,
  corGradiente
} | order(ordem asc, nome asc)`;

export default function PatrocinadoresPage() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Patrocinador | null>(
    null
  );
  const nomeDoPiloto = 'Lucas Foresti';

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
  }, []);

  // Fallback colors para gradientes
  const getGradientColor = (patrocinador: Patrocinador, index: number) => {
    if (patrocinador.corGradiente) {
      return patrocinador.corGradiente;
    }

    const defaultGradients = [
      'from-blue-600 to-blue-800',
      'from-orange-600 to-red-600',
      'from-purple-600 to-pink-600',
      'from-green-600 to-teal-600',
      'from-yellow-600 to-orange-600',
      'from-indigo-600 to-purple-600',
      'from-red-600 to-pink-600',
    ];

    return defaultGradients[index % defaultGradients.length];
  };

  return (
    <>
      <Helmet>
        <title>{`Patrocinadores - ${nomeDoPiloto}`}</title>
        <meta
          name='description'
          content={`Conheça os patrocinadores e parceiros que apoiam o piloto ${nomeDoPiloto} na Stock Car.`}
        />
      </Helmet>

      <section className='py-20 bg-black overflow-hidden'>
        <div className='container mx-auto px-4'>
          {/* Header */}
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
              <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
                Nossos Parceiros
              </span>
            </motion.div>

            <h1 className='text-5xl md:text-6xl font-black text-white mb-4'>
              <span className='bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text'>
                Patrocinadores
              </span>
            </h1>
            <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
              Empresas que acreditam na nossa jornada e fazem parte da nossa
              história na Stock Car
            </p>
          </motion.div>

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='h-80 bg-gray-800 rounded-2xl animate-pulse'
                />
              ))}
            </div>
          ) : patrocinadores && patrocinadores.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {patrocinadores.map((patrocinador, index) => {
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
                  : 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&q=80';

                const backgroundBuilderInstance = patrocinador.imagemDeFundo
                  ? urlFor(patrocinador.imagemDeFundo)
                  : null;
                const backgroundSrc = backgroundBuilderInstance
                  ? backgroundBuilderInstance
                      .width(800)
                      .height(600)
                      .auto('format')
                      .quality(80)
                      .url()
                  : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';

                const gradientColor = getGradientColor(patrocinador, index);

                return (
                  <motion.div
                    key={patrocinador._id}
                    className='group relative'
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onHoverStart={() => setHoveredCard(patrocinador._id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Card Container */}
                    <div
                      className='relative h-80 rounded-2xl overflow-hidden cursor-pointer'
                      style={{
                        transform:
                          hoveredCard === patrocinador._id
                            ? 'rotateY(5deg) rotateX(-5deg) scale(1.02)'
                            : 'rotateY(0deg) rotateX(0deg) scale(1)',
                        transition:
                          'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                      onClick={() => setSelectedPartner(patrocinador)}
                    >
                      {/* Background Image */}
                      <div className='absolute inset-0'>
                        <img
                          src={backgroundSrc}
                          alt={
                            patrocinador.imagemDeFundo?.alt ||
                            `${patrocinador.nome} background`
                          }
                          className='w-full h-full object-cover'
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-80`}
                        />
                        <div className='absolute inset-0 bg-black/40' />
                      </div>

                      {/* Logo Section */}
                      <div className='absolute top-6 left-6 right-6'>
                        <div className='w-16 h-16 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg'>
                          <img
                            src={logoSrc}
                            alt={
                              patrocinador.logo.alt ||
                              `Logo ${patrocinador.nome}`
                            }
                            className='w-full h-full object-contain'
                            loading='lazy'
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className='absolute bottom-0 left-0 right-0 p-6'>
                        <motion.div
                          animate={{
                            y: hoveredCard === patrocinador._id ? -10 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {patrocinador.categoria && (
                            <span className='inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-3'>
                              {patrocinador.categoria}
                            </span>
                          )}
                          <h3 className='text-2xl font-bold text-white mb-2'>
                            {patrocinador.nome}
                          </h3>
                          {patrocinador.descricaoCurta && (
                            <p className='text-gray-200 text-sm leading-relaxed line-clamp-3'>
                              {patrocinador.descricaoCurta}
                            </p>
                          )}
                        </motion.div>

                        {/* Hover CTA */}
                        <motion.div
                          className='mt-4'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: hoveredCard === patrocinador._id ? 1 : 0,
                            y: hoveredCard === patrocinador._id ? 0 : 20,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <button className='inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm font-semibold'>
                            <span>Saiba Mais</span>
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
                                d='M17 8l4 4m0 0l-4 4m4-4H3'
                              />
                            </svg>
                          </button>
                        </motion.div>
                      </div>

                      {/* Glow Effect */}
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-br ${gradientColor} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 pointer-events-none`}
                      />
                    </div>

                    {/* 3D Shadow */}
                    <div
                      className='absolute -bottom-2 left-2 right-2 h-8 bg-black/40 rounded-full blur-xl transition-opacity duration-300'
                      style={{
                        opacity: hoveredCard === patrocinador._id ? 0.6 : 0.3,
                        transform: 'translateZ(-20px)',
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className='text-center text-gray-400 py-20'>
              <h3 className='text-2xl font-semibold mb-4'>Em breve</h3>
              <p>
                Informações sobre nossos valiosos parceiros serão adicionadas em
                breve.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            className='text-center mt-20'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className='text-3xl font-bold text-white mb-4'>
              Seja Nosso Parceiro
            </h3>
            <p className='text-gray-400 mb-8 max-w-2xl mx-auto'>
              Junte-se a essas grandes empresas e apoie nossa jornada na Stock
              Car. Vamos acelerar juntos rumo ao sucesso!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to='/contato'
                className='group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full'
              >
                <span className='relative z-10 text-white font-bold text-lg uppercase tracking-wider'>
                  Quero Ser Parceiro
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
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
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
            </motion.div>
          </motion.div>
        </div>

        {/* Modal for Partner Details */}
        {selectedPartner && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPartner(null)}
          >
            <div className='absolute inset-0 bg-black/80 backdrop-blur-xl' />

            <motion.div
              className='relative max-w-2xl w-full bg-gray-900 rounded-2xl overflow-hidden'
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className='relative h-48'>
                {selectedPartner.imagemDeFundo ? (
                  <img
                    src={
                      urlFor(selectedPartner.imagemDeFundo)
                        ?.width(800)
                        .height(300)
                        .auto('format')
                        .quality(80)
                        .url() || ''
                    }
                    alt={
                      selectedPartner.imagemDeFundo.alt || selectedPartner.nome
                    }
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-gray-700 to-gray-900' />
                )}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${getGradientColor(
                    selectedPartner,
                    0
                  )} opacity-80`}
                />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedPartner(null)}
                  className='absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors'
                >
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>

                {/* Logo */}
                <div className='absolute -bottom-8 left-6'>
                  <div className='w-16 h-16 bg-white rounded-xl p-3 shadow-lg'>
                    <img
                      src={
                        urlFor(selectedPartner.logo)
                          ?.height(100)
                          .fit('max')
                          .auto('format')
                          .quality(85)
                          .url() || ''
                      }
                      alt={
                        selectedPartner.logo.alt ||
                        `${selectedPartner.nome} logo`
                      }
                      className='w-full h-full object-contain'
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='p-6 pt-12'>
                {selectedPartner.categoria && (
                  <span className='inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-3'>
                    {selectedPartner.categoria}
                  </span>
                )}
                <h3 className='text-3xl font-bold text-white mb-4'>
                  {selectedPartner.nome}
                </h3>
                <p className='text-gray-300 leading-relaxed mb-6'>
                  {selectedPartner.descricaoCompleta ||
                    selectedPartner.descricaoCurta ||
                    'Descrição não disponível.'}
                </p>

                <div className='flex gap-4'>
                  {selectedPartner.link && (
                    <a
                      href={selectedPartner.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center'
                    >
                      Visitar Site
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className='px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors'
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>
    </>
  );
}
