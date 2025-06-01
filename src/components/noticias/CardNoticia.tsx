// src/components/noticias/CardNoticia.tsx
// 'use client'; // Removido por enquanto, pois não estamos usando Framer Motion nesta versão

import imageUrlBuilder from '@sanity/image-url';
import { Link } from 'react-router-dom';
import { getClient } from '../../lib/sanity.client'; // Ajuste o caminho se necessário
import type {
  NoticiaCard as NoticiaCardType,
  SanityImageObject,
} from '../../types/sanity'; // Ajuste o caminho

const client = getClient();
const builder = imageUrlBuilder(client);

function urlFor(
  source: SanityImageObject | null | undefined
): ReturnType<typeof builder.image> | null {
  if (!source || (!source.asset && !source._ref)) {
    // console.warn("Fonte de imagem inválida para urlFor no CardNoticia:", source);
    return null;
  }
  try {
    return builder.image(source);
  } catch (error) {
    console.error(
      'Erro no builder.image(source) no CardNoticia:',
      error,
      'Source:',
      source
    );
    return null;
  }
}

interface CardNoticiaProps {
  noticia: NoticiaCardType;
}

const CardNoticia: React.FC<CardNoticiaProps> = ({ noticia }) => {
  const { titulo, slug, dataDePublicacao, imagemDeCapa, resumo } = noticia;

  const dataFormatada = new Date(dataDePublicacao).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const imageBuilderInstance = imagemDeCapa ? urlFor(imagemDeCapa) : null;
  const imageUrl = imageBuilderInstance
    ? imageBuilderInstance
        .width(600)
        .height(400)
        .auto('format')
        .quality(75)
        .url()
    : undefined; // Ou um placeholder como '/img/placeholder-noticia.png';

  return (
    <article className='bg-neutral-700 rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full border border-transparent hover:border-piloto-azul-light/30'>
      {imageUrl ? (
        <div className='w-full h-48 md:h-52 relative overflow-hidden'>
          {' '}
          {/* Altura da imagem */}
          <Link
            to={`/noticias/${slug?.current}`}
            className='block w-full h-full'
          >
            <img
              src={imageUrl}
              alt={imagemDeCapa?.alt || `Capa para ${titulo}`}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
              loading='lazy'
            />
          </Link>
        </div>
      ) : (
        <div className='w-full h-48 md:h-52 bg-neutral-800 flex items-center justify-center text-neutral-400'>
          Sem Imagem
        </div>
      )}
      <div className='p-5 flex flex-col flex-grow'>
        <div>
          <p className='text-xs text-piloto-azul-light font-semibold mb-1 uppercase tracking-wider'>
            {dataFormatada}
          </p>
          <h2 className='font-heading text-lg lg:text-xl font-bold mb-3 text-neutral-100'>
            {' '}
            {/* Título com fonte heading */}
            <Link
              to={`/noticias/${slug?.current}`}
              className='hover:text-piloto-azul-light transition-colors'
            >
              {titulo}
            </Link>
          </h2>
          {resumo && (
            // Para limitar o texto do resumo, você pode usar CSS para overflow ou JS.
            // A classe line-clamp-3 do Tailwind é ideal mas precisa do plugin ou Tailwind v3.3+.
            // Solução simples com altura e overflow:
            <p className='text-neutral-300  text-sm leading-relaxed mb-4 h-[4.5em] overflow-hidden relative'>
              {resumo}
              {/* Fade out para texto cortado (opcional, mais complexo) */}
              {/* <span className="absolute bottom-0 right-0 w-full h-6 bg-gradient-to-t from-neutral-700 to-transparent"></span> */}
            </p>
          )}
        </div>
        <div className='mt-auto pt-3'>
          <Link
            to={`/noticias/${slug?.current}`}
            className='inline-flex items-center text-accent-orange hover:text-orange-400 font-semibold text-sm transition-colors group'
          >
            Leia mais
            <svg
              className='ml-1.5 w-4 h-4 transform group-hover:translate-x-1 transition-transform'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M17 8l4 4m0 0l-4 4m4-4H3'
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CardNoticia;
