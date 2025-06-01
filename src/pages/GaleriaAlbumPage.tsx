// src/pages/GaleriaAlbumPage.tsx

import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
import type { SanityImageObject, SanitySlug } from '../types/sanity'; // Ajuste o caminho

import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

// --- Interfaces ---
interface SanityImageMetadata {
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}
// Certifique-se que SanityImageObject em seus tipos globais tem 'asset' e opcionalmente 'alt', 'hotspot', 'crop'
// E que FotoDoAlbum extende isso corretamente
interface FotoDoAlbum extends SanityImageObject {
  // SanityImageObject deve ter _type: 'image' e asset: SanityAssetReference
  legenda?: string;
  alt?: string; // Certifique-se que este campo é buscado pela query se existir no schema da foto
  _key: string;
  asset: SanityImageObject['asset'] & {
    // asset é a referência expandida
    url?: string;
    metadata?: SanityImageMetadata;
  };
}
export interface AlbumDetalhado {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  dataDoAlbum?: string;
  descricao?: string;
  fotos?: FotoDoAlbum[];
}

const clientInstance = getClient();
const builder = imageUrlBuilder(clientInstance);

// Função urlFor revisada para ser mais robusta e retornar null se a fonte for inválida
function urlFor(
  source: SanityImageObject | FotoDoAlbum | null | undefined
): ReturnType<typeof builder.image> | null {
  // A 'source' aqui deve ser o objeto de imagem completo do Sanity (que contém 'asset')
  // ou um 'asset' já expandido que tenha '_ref' ou '_id'.
  // Para 'FotoDoAlbum', 'source' é o objeto de imagem inteiro.
  if (!source || (!source.asset && !source._ref)) {
    // Se não há source, ou não tem asset (para obj de imagem) nem _ref (para asset direto)
    // console.warn("Fonte de imagem inválida para urlFor:", source);
    return null;
  }
  try {
    // O builder.image() é inteligente e pode lidar com:
    // 1. Objeto de imagem com um campo 'asset' (ex: { _type: 'image', asset: { _ref: '...' } }) -> usa source.asset._ref
    // 2. Objeto de asset diretamente (ex: { _ref: '...' } ou { _id: 'image-...' }) -> usa source._ref ou source._id
    // 3. String de ID do asset.
    // No nosso caso, 'foto' (do tipo FotoDoAlbum) é um objeto de imagem completo.
    return builder.image(source);
  } catch (error) {
    console.error('Erro no builder.image(source):', error, 'Source:', source);
    return null;
  }
}

const albumDetalhadoQuery = `*[_type == "albumDeFotos" && slug.current == $slug][0]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  descricao,
  "fotos": fotos[]{
    _key,
    legenda,
    alt, // Campo alt que você definiu no schema da foto dentro do álbum
    asset->{ // Expande o asset para buscar seus detalhes
      _id, // O _id do asset é o que o builder pode usar se _ref não estiver no objeto de imagem principal
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
    // Adicione outros campos da imagem aqui se os definiu (hotspot, crop)
    // Ex: hotspot, crop
  }
}`;

export default function GaleriaAlbumPage() {
  const { slug } = useParams<{ slug: string }>();
  const [album, setAlbum] = useState<AlbumDetalhado | null | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setAlbum(null);
      return;
    }
    const client = getClient();
    const fetchAlbumData = async () => {
      setLoading(true);
      try {
        const data: AlbumDetalhado | null = await client.fetch(
          albumDetalhadoQuery,
          { slug }
        );
        setAlbum(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do álbum:', error);
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumData();
  }, [slug]);

  useEffect(() => {
    if (album?.titulo) {
      document.title = `${album.titulo} - Galeria de Fotos`;
    } else if (!loading && !album) {
      document.title = 'Álbum não encontrado - Galeria';
    }
  }, [album, loading]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-16 text-center animate-pulse'>
        Carregando álbum...
      </div>
    );
  }

  if (!album) {
    // ... (código de fallback como antes) ...
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Helmet>
          <title>Álbum não encontrado - Galeria</title>
        </Helmet>
        <h1 className='font-heading text-3xl font-bold mb-4'>
          Álbum não encontrado
        </h1>
        <Link to='/galeria' className='text-piloto-blue hover:underline'>
          &larr; Voltar para a galeria
        </Link>
      </div>
    );
  }

  const dataFormatada = album.dataDoAlbum
    ? new Date(album.dataDoAlbum + 'T00:00:00').toLocaleDateString('pt-BR', {
        /* ... */
      })
    : null;

  const slides =
    album.fotos
      ?.map((foto) => {
        // 'foto' aqui é o objeto FotoDoAlbum
        const imageBuilderInstance = urlFor(foto); // << PASSE 'foto' INTEIRO
        if (!imageBuilderInstance) {
          return {
            src: '/img/placeholder-image.png',
            alt: 'Imagem indisponível',
            title: foto.legenda || 'Erro',
          };
        }
        return {
          src: imageBuilderInstance.auto('format').quality(90).url(),
          alt: foto.alt || foto.legenda || album.titulo,
          title: foto.legenda,
          width: foto.asset?.metadata?.dimensions?.width,
          height: foto.asset?.metadata?.dimensions?.height,
        };
      })
      .filter((slide) => slide.src !== '/img/placeholder-image.png') || [];

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{`${album.titulo} - Galeria de Fotos`}</title>
        {album.descricao && (
          <meta name='description' content={album.descricao} />
        )}
      </Helmet>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <header className='mb-8 md:mb-12 text-center'>
          {/* ... título, data, descrição do álbum ... */}
          <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-2'>
            {album.titulo}
          </h1>
          {dataFormatada && (
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {dataFormatada}
            </p>
          )}
          {album.descricao && (
            <p className='mt-2 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
              {album.descricao}
            </p>
          )}
        </header>

        {album.fotos && album.fotos.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4'>
            {album.fotos.map((foto, index) => {
              const imageBuilderInstanceGrid = urlFor(foto); // << PASSE 'foto' INTEIRO
              const thumbnailUrl = imageBuilderInstanceGrid
                ? imageBuilderInstanceGrid
                    .width(300)
                    .height(300)
                    .fit('crop')
                    .auto('format')
                    .quality(70)
                    .url()
                : '/img/placeholder-image.png'; // Você precisará criar esta imagem placeholder

              return (
                <div
                  key={foto._key}
                  className='group relative aspect-square rounded-md overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow'
                  onClick={() => handleImageClick(index)}
                >
                  {/* Verifica se temos uma URL válida para a miniatura */}
                  {thumbnailUrl !== '/img/placeholder-image.png' ? (
                    <img
                      src={thumbnailUrl}
                      alt={
                        foto.alt ||
                        foto.legenda ||
                        `Foto do álbum ${album.titulo}`
                      }
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
                      loading='lazy'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                      <span className='text-gray-500 text-xs'>
                        Imagem Indisponível
                      </span>
                    </div>
                  )}
                  {foto.legenda && (
                    <div className='absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 text-white text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center truncate'>
                      {foto.legenda}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-center text-gray-500 dark:text-gray-300'>
            Nenhuma foto neste álbum.
          </p>
        )}

        {slides.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={slides}
            index={lightboxIndex}
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            zoom={{
              maxZoomPixelRatio: 3,
              zoomInMultiplier: 1.5,
              doubleTapDelay: 300,
            }}
            thumbnails={{
              vignette: false,
              showToggle: true,
              position: 'bottom',
            }}
          />
        )}

        <div className='mt-12 text-center'>
          <Link
            to='/galeria'
            className='text-piloto-blue hover:underline font-semibold'
          >
            &larr; Voltar para todos os álbuns
          </Link>
        </div>
      </div>
    </>
  );
}
