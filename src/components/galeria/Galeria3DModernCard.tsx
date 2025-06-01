// src/components/galeria/Galeria3DModernCard.tsx
'use client';

import imageUrlBuilder from '@sanity/image-url';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getClient } from '../../lib/sanity.client'; // Ajuste o caminho
import type { SanityImageObject, SanitySlug } from '../../types/sanity'; // Ajuste o caminho

export interface AlbumDataCard {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  dataDoAlbum?: string;
  imagemDeCapa?: SanityImageObject & { alt?: string };
  fotos?: Array<
    SanityImageObject & { alt?: string; legenda?: string; _key: string }
  >;
  // corGradiente?: string;
}

interface Galeria3DModernCardProps {
  album: AlbumDataCard;
  index: number;
}

const client = getClient();
const builder = imageUrlBuilder(client);

function urlFor(
  source: SanityImageObject | null | undefined
): ReturnType<typeof builder.image> | null {
  if (!source || (!source.asset && !source._ref)) return null;
  try {
    return builder.image(source);
  } catch (error) {
    console.error('Erro no builder.image:', error, 'Source:', source);
    return null;
  }
}

const Galeria3DModernCard: React.FC<Galeria3DModernCardProps> = ({
  album,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!album) return null;

  const { titulo, slug, dataDoAlbum, imagemDeCapa, fotos } = album;

  const stackImagesInput =
    fotos && fotos.length > 0 ? fotos : imagemDeCapa ? [imagemDeCapa] : [];
  const stackImages = stackImagesInput.slice(0, 3);

  const dataFormatada = dataDoAlbum
    ? new Date(dataDoAlbum + 'T00:00:00Z').toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  const gradienteCorImagem = 'from-piloto-azul-dark/30 to-neutral-800/10'; // Gradiente sutil para as imagens no stack

  return (
    <motion.div
      className='group relative flex flex-col h-full' // Adicionado h-full e flex-col
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        // O transform agora é aplicado no container interno para permitir conteúdo abaixo
      }}
    >
      {/* Container para efeito 3D e conteúdo do card */}
      <div
        className='relative rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700/80 shadow-xl group-hover:shadow-piloto-azul/25 flex flex-col flex-grow'
        style={{
          transform: isHovered
            ? 'rotateY(3deg) rotateX(-3deg) scale(1.03)'
            : 'rotateY(0deg) rotateX(0deg) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transformStyle: 'preserve-3d', // Para o shadow 3D
        }}
      >
        {/* Stacked Images Effect & Content Overlay Wrapper */}
        <Link
          to={`/galeria/${slug?.current || '#'}`}
          className='block relative h-64 sm:h-72 overflow-hidden'
        >
          {' '}
          {/* Altura para a área da imagem */}
          {stackImages.length > 0 ? (
            stackImages.map((imageObj, imgIndex) => {
              const imgBuilder = urlFor(imageObj);
              const imgSrc = imgBuilder
                ? imgBuilder
                    .width(500)
                    .height(350)
                    .auto('format')
                    .quality(70)
                    .url()
                : '/img/placeholder-galeria.png';
              return (
                <motion.div
                  key={imageObj._key || imgIndex}
                  className='absolute inset-0'
                  style={{
                    zIndex: stackImages.length - imgIndex,
                    transform: `translateZ(${
                      (stackImages.length - 1 - imgIndex) * -15
                    }px) 
                                translateY(${imgIndex * 6}px) 
                                translateX(${imgIndex * 6}px)
                                rotateZ(${imgIndex * -1}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    y: isHovered ? imgIndex * 9 : imgIndex * 6,
                    x: isHovered ? imgIndex * 9 : imgIndex * 6,
                    rotateZ: isHovered ? imgIndex * 0.5 : imgIndex * -1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <img
                    src={imgSrc}
                    alt={imageObj.alt || `${titulo} - Imagem ${imgIndex + 1}`}
                    className='w-full h-full object-cover rounded-xl shadow-2xl' // rounded-xl para imagens internas
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradienteCorImagem} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`}
                  />
                </motion.div>
              );
            })
          ) : (
            <div className='w-full h-full flex items-center justify-center text-neutral-500 bg-neutral-900 rounded-t-2xl'>
              Capa indisponível
            </div>
          )}
          {/* Content Overlay (apenas o botão "Ver Álbum" no hover) */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-2xl flex flex-col justify-end items-center pb-6'>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.25, delay: isHovered ? 0.15 : 0 }}
            >
              <span // Mantido como span, o Link envolve toda a área da imagem
                className='inline-flex items-center gap-2 px-5 py-2.5 bg-piloto-azul/90 backdrop-blur-md text-white text-xs sm:text-sm font-semibold rounded-lg border border-piloto-azul-light/40 hover:bg-piloto-azul transition-all duration-300 shadow-md hover:shadow-lg'
              >
                <span>Ver Álbum</span>
                <svg
                  className='w-3.5 h-3.5 sm:w-4 sm:h-4'
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
              </span>
            </motion.div>
          </div>
          {/* Floating Badge (Número de fotos) */}
          {fotos && fotos.length > 0 && (
            <motion.div
              className='absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg'
              animate={{
                scale: isHovered ? 1.05 : 1,
                rotate: isHovered ? 2 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <span className='text-white font-semibold text-xs'>
                {fotos.length} foto{fotos.length === 1 ? '' : 's'}
              </span>
            </motion.div>
          )}
        </Link>{' '}
        {/* Fim do Link que envolve a área da imagem */}
        {/* Informações do Álbum (Sempre Visíveis Abaixo da Imagem) */}
        <div className='p-5 text-left flex-grow flex flex-col justify-between'>
          {' '}
          {/* Adicionado flex-grow e flex-col */}
          <div>
            <h3 className='font-heading text-lg md:text-xl font-bold text-neutral-100 mb-1 group-hover:text-piloto-azul-light transition-colors duration-300 line-clamp-2'>
              {titulo}
            </h3>
            {dataFormatada && (
              <p className='text-neutral-400 text-xs mb-3'>{dataFormatada}</p>
            )}
          </div>
          {/* O botão "Ver Álbum" agora está no overlay da imagem,
                mas você poderia adicionar um link de texto aqui também se quisesse */}
        </div>
      </div>

      {/* 3D Shadow */}
      <div
        className='absolute -bottom-2 left-2 right-2 h-8 sm:h-10 bg-black/40 rounded-full blur-lg transition-opacity duration-300 pointer-events-none'
        style={{
          transform: 'translateZ(-30px) scale(0.95)',
          opacity: isHovered ? 0.6 : 0.25,
        }}
      />
    </motion.div>
  );
};

export default Galeria3DModernCard;
