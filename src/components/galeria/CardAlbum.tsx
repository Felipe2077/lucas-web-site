// src/components/galeria/CardAlbum.tsx
// 'use client'; // Adicione se for usar Framer Motion ou outros hooks aqui no futuro

import imageUrlBuilder from '@sanity/image-url';
import { Link } from 'react-router-dom';
import { getClient } from '../../lib/sanity.client'; // Ajuste o caminho se 'lib' estiver em src/
import type { SanityImageObject, SanitySlug } from '../../types/sanity'; // Ajuste o caminho

// Tipo para os dados do álbum que o card espera
export interface AlbumParaCard {
  // Exportar se GaleriaPage.tsx for importar
  _id: string;
  titulo: string;
  slug: SanitySlug;
  imagemDeCapa?: SanityImageObject & { alt?: string }; // Adicionado alt opcional
  dataDoAlbum?: string;
  descricao?: string; // Adicionado para consistência com a query
}

interface CardAlbumProps {
  album: AlbumParaCard;
}

const client = getClient();
const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageObject) {
  if (!source?.asset) return undefined;
  return builder.image(source);
}

const CardAlbum: React.FC<CardAlbumProps> = ({ album }) => {
  const { titulo, slug, imagemDeCapa, dataDoAlbum } = album;

  const dataFormatada = dataDoAlbum
    ? new Date(dataDoAlbum + 'T00:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  const imageUrl = imagemDeCapa
    ? urlFor(imagemDeCapa)
        ?.width(450)
        .height(300)
        .auto('format')
        .quality(75)
        .url()
    : undefined;

  return (
    <Link
      to={`/galeria/${slug?.current}`}
      className='block group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-piloto-blue focus:ring-opacity-50'
    >
      <div className='relative aspect-w-4 aspect-h-3 w-full overflow-hidden'>
        {/* Usando aspect ratio do Tailwind */}
        {imageUrl ? (
          <img // Usando <img> padrão
            src={imageUrl}
            alt={imagemDeCapa?.alt || `Capa do álbum ${titulo}`}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
            <span className='text-gray-500 text-sm'>Sem capa</span>
          </div>
        )}
      </div>
      <div className='p-4 md:p-5'>
        <h3 className='font-heading text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-piloto-blue dark:group-hover:text-piloto-blue-light transition-colors truncate'>
          {titulo}
        </h3>
        {dataFormatada && (
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            {dataFormatada}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CardAlbum;
