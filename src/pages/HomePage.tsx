// src/pages/HomePage.tsx

import imageUrlBuilder from '@sanity/image-url';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'; // Removido useCallback se não for usado diretamente aqui
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CardNoticia from '../components/noticias/CardNoticia'; // Ajuste o caminho se necessário
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho se necessário
import type {
  NoticiaCard,
  SanityImageObject,
  SanitySlug, // Adicionado SanitySlug que é usado em AlbumTeaser
} from '../types/sanity'; // Ajuste o caminho se necessário

// --- Interfaces ---
interface ProximaCorrida {
  _id: string;
  nomeDoEvento: string;
  dataDoEvento: string;
  circuito?: string;
}

interface AlbumTeaser {
  _id: string;
  titulo: string;
  slug: SanitySlug; // Garanta que SanitySlug está definido em seus tipos
  imagemDeCapa?: SanityImageObject & { alt?: string };
}

// Interface HomePageData unificada
interface HomePageData {
  ultimasNoticias?: NoticiaCard[];
  proximaCorrida?: ProximaCorrida | null;
  teaserAlbuns?: AlbumTeaser[];
}

const hojeISO = new Date().toISOString().split('T')[0];

// Queries GROQ
const ultimasNoticiasQuery = `*[_type == "noticia"]{
  _id, titulo, slug, dataDePublicacao, imagemDeCapa{alt, asset->}, resumo
} | order(dataDePublicacao desc) [0...3]`;

const proximaCorridaQuery = `*[_type == "evento" && (status == "agendado" || status == "adiado") && dataDoEvento >= $hojeISO] | order(dataDoEvento asc) [0]{
  _id, nomeDoEvento, dataDoEvento, circuito
}`;

const teaserAlbunsQuery = `*[_type == "albumDeFotos" && defined(imagemDeCapa.asset) && defined(slug.current)]{
  _id,
  titulo,
  slug,
  imagemDeCapa{alt, asset->}
} | order(dataDoAlbum desc, _createdAt desc) [0...6]`; // Pega os 3 álbuns mais recentes

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
      'Erro no builder.image(source) na HomePage:',
      error,
      'Source:',
      source
    );
    return null;
  }
}

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const nomeDoPiloto = 'Lucas Foresti';

  useEffect(() => {
    const client = getClient(); // Pode usar a clientInstance definida acima também
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ultimasNoticias, proximaCorrida, teaserAlbunsData] =
          await Promise.all([
            client.fetch(ultimasNoticiasQuery),
            client.fetch(proximaCorridaQuery, { hojeISO }),
            client.fetch(teaserAlbunsQuery), // Fetch dos álbuns para o teaser
          ]);
        setHomeData({
          ultimasNoticias,
          proximaCorrida,
          teaserAlbuns: teaserAlbunsData,
        });
      } catch (error) {
        console.error('Erro ao buscar dados para a Home Page:', error);
        setHomeData({
          ultimasNoticias: [],
          proximaCorrida: null,
          teaserAlbuns: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Roda uma vez na montagem

  const heroContainerVariants = {
    /* ... (como antes) ... */
  };
  const heroItemVariants = {
    /* ... (como antes) ... */
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen animate-pulse text-neutral-300'>
        Carregando...
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        Falha ao carregar conteúdo da home.
      </div>
    );
  }

  const { ultimasNoticias, proximaCorrida, teaserAlbuns } = homeData;

  return (
    <>
      <Helmet>
        <title>{`${nomeDoPiloto} - Piloto Stock Car | Website Oficial`}</title>
        <meta
          name='description'
          content={`Acompanhe a carreira, notícias, calendário e galeria de fotos de ${nomeDoPiloto}, piloto da Stock Car Pro Series.`}
        />
        {/* <meta property="og:image" content="/images/og-image-home.jpg" /> */}
      </Helmet>

      {/* O div animate-fade-in foi removido do exemplo anterior, mas pode ser adicionado se desejar um fade geral */}
      {/* NOVA SEÇÃO HERO (como no seu código, parece boa) */}
      <motion.section
        className='relative text-white h-[80vh] min-h-[500px] max-h-[700px] flex flex-col items-center justify-center text-center overflow-hidden'
        style={{
          backgroundImage: "url('/images/hero-background-placeholder.jpg')", // << SUBSTITUA PELO CAMINHO DA SUA IMAGEM HERO
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
        variants={heroContainerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='absolute inset-0 bg-black opacity-60 z-0'></div>
        <motion.div
          className='relative z-10 p-4 md:p-8 flex flex-col items-center'
          variants={heroContainerVariants} // Pode ser itemVariants ou um novo container se os filhos animam individualmente
        >
          <motion.h1
            className='font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-3 md:mb-4 uppercase tracking-tight'
            variants={heroItemVariants}
          >
            {nomeDoPiloto}
          </motion.h1>
          <motion.p
            className='font-sans text-lg md:text-xl lg:text-2xl mb-8 max-w-xl lg:max-w-2xl mx-auto'
            variants={heroItemVariants}
          >
            Piloto Stock Car Pro Series. Acompanhe minha trajetória e últimas
            notícias.
          </motion.p>
          <motion.div variants={heroItemVariants}>
            <Link
              to='/noticias'
              className='inline-block bg-accent-orange hover:bg-orange-600 active:bg-orange-700 text-white font-heading font-semibold py-3 px-8 md:py-4 md:px-10 rounded-md text-md md:text-lg uppercase tracking-wider transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Últimas Notícias
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className='absolute bottom-8 z-10'
          variants={heroItemVariants}
        >
          <svg
            className='w-8 h-8 text-white opacity-70 animate-bounce'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path d='M19 9l-7 7-7-7'></path>
          </svg>
        </motion.div>
      </motion.section>
      {/* FIM DA NOVA SEÇÃO HERO */}

      {/* Seção de Últimas Notícias (seu código parece bom) */}
      {ultimasNoticias && ultimasNoticias.length > 0 && (
        <section className='py-16 md:py-24 bg-neutral-800'>
          <div className='container mx-auto px-4'>
            {/* ... título e descrição da seção ... */}
            <h2 className='font-heading text-4xl md:text-5xl font-bold mb-4 text-center text-neutral-100'>
              Fique por <span className='text-piloto-azul'>Dentro</span>
            </h2>
            <p className='text-center text-neutral-300 mb-12 md:mb-16 max-w-xl mx-auto'>
              As últimas novidades, resultados e bastidores do universo de Lucas
              Foresti na Stock Car.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {ultimasNoticias.map((noticia) => (
                <CardNoticia key={noticia._id} noticia={noticia} />
              ))}
            </div>
            <div className='mt-16 text-center'>
              {/* ... botão "Ver todas as notícias" ... */}
            </div>
          </div>
        </section>
      )}

      {/* Seção Próxima Corrida (seu código parece bom) */}
      {/* Seção Próxima Corrida */}
      {proximaCorrida && (
        <section className='py-16 md:py-24 bg-neutral-900 text-neutral-100'>
          <div className='container mx-auto px-4'>
            <h2 className='font-heading text-4xl md:text-5xl font-bold mb-4 text-center'>
              Próxima <span className='text-piloto-azul'>Etapa</span>
            </h2>
            <p className='text-center text-neutral-300 mb-12 md:mb-16 max-w-xl mx-auto'>
              Não perca a próxima corrida de Lucas Foresti! Veja os detalhes
              abaixo.
            </p>

            <div className='bg-neutral-800/80 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl max-w-lg mx-auto border border-neutral-700 hover:border-piloto-azul-light/30 transition-all duration-300'>
              {/* Opcional: Ícone */}
              <div className='flex justify-center mb-4'>
                <svg
                  className='w-10 h-10 text-piloto-azul-light'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008ZM9.75 18h.008v.008H9.75v-.008ZM7.5 18h.008v.008H7.5v-.008ZM14.25 15h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm2.25-3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z'
                  />
                </svg>
              </div>

              <h3 className='font-heading text-2xl md:text-3xl font-bold text-piloto-azul text-center mb-3'>
                {proximaCorrida.nomeDoEvento}
              </h3>
              <p className='text-lg text-neutral-100 text-center mb-1'>
                {new Date(proximaCorrida.dataDoEvento).toLocaleDateString(
                  'pt-BR',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'UTC',
                  }
                )}
              </p>
              {proximaCorrida.circuito && (
                <p className='text-md text-neutral-300 text-center'>
                  {proximaCorrida.circuito}
                </p>
              )}
              {/* Opcional: Botão para mais detalhes se houver uma página de evento */}
              {/* <div className="mt-6 text-center">
                  <Link to={`/calendario#${proximaCorrida._id}`} className="text-accent-orange hover:underline font-semibold">
                    Ver Detalhes &rarr;
                  </Link>
                </div> */}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO CHAMADA PARA GALERIA ATUALIZADA */}
      <section className='py-16 bg-neutral-800 relative text-center text-neutral-100 overflow-hidden'>
        <div className='container mx-auto px-4 relative z-10'>
          <motion.h2
            className='font-heading text-4xl md:text-5xl font-bold mb-4'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore os <span className='text-piloto-azul-light'>Momentos</span>
          </motion.h2>
          <motion.p
            className='text-lg md:text-xl text-neutral-300 mb-10 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A adrenalina da pista, os bastidores da equipe e a paixão pela
            velocidade capturada em cada clique.
          </motion.p>

          {/* Teaser de Álbuns */}
          {teaserAlbuns && teaserAlbuns.length > 0 && (
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 max-w-4xl mx-auto' // max-w para centralizar o grid
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }} // amount menor para disparar antes
              transition={{ duration: 0.5, delay: 0.3, staggerChildren: 0.15 }}
            >
              {teaserAlbuns.map((album) => {
                const albumImageBuilder = album.imagemDeCapa
                  ? urlFor(album.imagemDeCapa)
                  : null;
                const albumImageUrl = albumImageBuilder
                  ? albumImageBuilder
                      .width(400)
                      .height(300)
                      .fit('crop')
                      .auto('format')
                      .quality(70)
                      .url()
                  : '/img/placeholder-galeria.png'; // Crie este placeholder em public/img/

                return (
                  <motion.div
                    key={album._id}
                    variants={heroItemVariants} // Reutilizando variante para entrada individual
                    className='overflow-hidden rounded-lg shadow-lg'
                  >
                    <Link
                      to={`/galeria/${album.slug.current}`}
                      className='block group relative'
                    >
                      <div className='aspect-w-4 aspect-h-3 bg-neutral-700'>
                        {' '}
                        {/* Se não usar plugin aspect-ratio, defina altura e use object-cover */}
                        <img
                          src={albumImageUrl}
                          alt={album.imagemDeCapa?.alt || album.titulo}
                          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                          loading='lazy'
                        />
                      </div>
                      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div className='absolute bottom-0 left-0 p-3 md:p-4 w-full'>
                        <h4 className='font-heading text-sm sm:text-md font-semibold text-white truncate transition-colors duration-300 group-hover:text-piloto-azul-light'>
                          {album.titulo}
                        </h4>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: teaserAlbuns && teaserAlbuns.length > 0 ? 0.5 : 0.3,
            }}
          >
            <Link
              to='/galeria'
              className='inline-block bg-accent-orange hover:bg-orange-600 active:bg-orange-700 text-white font-heading font-semibold py-3 px-10 md:py-4 md:px-12 rounded-md text-md md:text-lg uppercase tracking-wider transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Ver Galeria Completa
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
