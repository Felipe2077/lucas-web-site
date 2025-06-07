// src/pages/HomePage.tsx

import HomeGaleriaSection from '@/components/galeria/HomeGaleriaSection';
import imageUrlBuilder from '@sanity/image-url';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CardNoticia from '../components/noticias/CardNoticia';
import { getClient } from '../lib/sanity.client';
import type {
  NoticiaCard,
  PaginaSobreData,
  SanityImageObject,
  SanitySlug,
} from '../types/sanity';

// --- Interfaces ---
interface ProximaCorrida {
  _id: string;
  nomeDoEvento: string;
  dataDoEvento: string;
  circuito?: string;
  cidade: string;
}

interface AlbumTeaser {
  _id: string;
  titulo: string;
  slug: SanitySlug;
  imagemDeCapa?: SanityImageObject & { alt?: string };
}

interface HomePageData {
  ultimasNoticias?: NoticiaCard[];
  proximaCorrida?: ProximaCorrida | null;
  teaserAlbuns?: AlbumTeaser[];
  paginaSobre?: PaginaSobreData | null;
}

const hojeISO = new Date().toISOString().split('T')[0];

// Queries GROQ
const ultimasNoticiasQuery = `*[_type == "noticia"]{
  _id, titulo, slug, dataDePublicacao, imagemDeCapa{alt, asset->}, resumo
} | order(dataDePublicacao desc) [0...3]`;

const proximaCorridaQuery = `*[_type == "evento" && (status == "agendado" || status == "adiado") && dataDoEvento >= $hojeISO] | order(dataDoEvento asc) [0]{
  _id, nomeDoEvento, dataDoEvento, circuito, cidade
}`;

const teaserAlbunsQuery = `*[_type == "albumDeFotos" && defined(imagemDeCapa.asset) && defined(slug.current)]{
  _id,
  titulo,
  slug,
  imagemDeCapa{alt, asset->}
} | order(dataDoAlbum desc, _createdAt desc) [0...6]`;

// Nova query para dados da página sobre
const paginaSobreQuery = `*[_type == "paginaSobre"][0]{
  _id,
  titulo,
  imagemPrincipal{alt, asset->}
}`;

// Query unificada para otimizar requests
const homePageDataQuery = `{
  "ultimasNoticias": *[_type == "noticia"] | order(dataDePublicacao desc) [0...3] {
    _id, titulo, slug, dataDePublicacao, imagemDeCapa{alt, asset->}, resumo
  },
  "proximaCorrida": *[_type == "evento" && (status == "agendado" || status == "adiado") && dataDoEvento >= $hojeISO] | order(dataDoEvento asc) [0] {
    _id, nomeDoEvento, dataDoEvento, circuito, cidade
  },
  "teaserAlbuns": *[_type == "albumDeFotos" && defined(imagemDeCapa.asset) && defined(slug.current)] | order(dataDoAlbum desc, _createdAt desc) [0...6] {
    _id, titulo, slug, imagemDeCapa{alt, asset->}
  },
  "paginaSobre": *[_type == "paginaSobre"][0] {
    _id, titulo, imagemPrincipal{alt, asset->}
  }
}`;

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const nomeDoPiloto = 'Lucas Foresti';

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const client = getClient();
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await client.fetch(homePageDataQuery, { hojeISO });
        setHomeData(data);
      } catch (error) {
        console.error('Erro ao buscar dados para a Home Page:', error);
        setHomeData({
          ultimasNoticias: [],
          proximaCorrida: null,
          teaserAlbuns: [],
          paginaSobre: null,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-black'>
        <div className='text-center'>
          <motion.div
            className='w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className='text-gray-400 animate-pulse'>Carregando...</p>
        </div>
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

  const { ultimasNoticias, proximaCorrida, teaserAlbuns, paginaSobre } =
    homeData;

  const imageUrlPrincipal = paginaSobre?.imagemPrincipal
    ? urlFor(paginaSobre.imagemPrincipal)
        ?.width(1200)
        .auto('format')
        .quality(80)
        .url()
    : null;

  return (
    <>
      <Helmet>
        <title>{`${nomeDoPiloto} - Piloto Stock Car | Website Oficial`}</title>
        <meta
          name='description'
          content={`Acompanhe a carreira, notícias, calendário e galeria de fotos de ${nomeDoPiloto}, piloto da Stock Car Pro Series.`}
        />
      </Helmet>

      <div className='bg-black text-white'>
        {/* Hero Section Integrada */}
        <section
          ref={heroRef}
          className='relative min-h-screen flex items-center overflow-hidden'
        >
          {/* Background Effects */}
          <div className='absolute inset-0'>
            {/* Animated gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-orange-900/20' />

            {/* Animated orbs */}
            <motion.div
              className='absolute top-1/4 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl'
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
              className='absolute bottom-1/4 -right-40 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl'
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

            {/* Grid pattern */}
            <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]' />
          </div>

          <div className='container mx-auto px-4 relative z-10'>
            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ opacity }}
              >
                <motion.div
                  className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
                >
                  <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                  <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
                    Piloto Stock Car
                  </span>
                </motion.div>

                <h1 className='font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-6'>
                  <span className='block text-white'>
                    {paginaSobre?.titulo?.split(' ')[0] || 'Lucas'}
                  </span>
                  <span className='block bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                    {paginaSobre?.titulo?.split(' ').slice(1).join(' ') ||
                      'Foresti'}
                  </span>
                  <motion.span
                    className='block text-transparent text-6xl md:text-7xl lg:text-8xl font-black'
                    style={{
                      WebkitTextStroke: '2px rgba(59, 130, 246, 0.3)',
                      transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    }}
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 40px rgba(59, 130, 246, 0.6)',
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    #12
                  </motion.span>
                </h1>

                <p className='text-xl text-gray-300 leading-relaxed mb-8 max-w-xl'>
                  Velocidade, paixão e determinação. Acompanhe a jornada de um
                  dos talentos da Stock Car brasileira em busca da excelência
                  nas pistas.
                </p>

                <motion.div
                  className='flex flex-col sm:flex-row gap-4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to='/noticias'
                      className='group relative inline-flex items-center gap-2 px-8 py-4 overflow-hidden rounded-full'
                    >
                      <span className='relative z-10 text-white font-bold uppercase tracking-wider'>
                        Últimas Notícias
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

                  <Link
                    to='/sobre'
                    className='group inline-flex items-center gap-2 px-8 py-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full font-bold uppercase tracking-wider transition-all duration-300'
                  >
                    <span>Conheça a História</span>
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
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image */}
              {imageUrlPrincipal && (
                <motion.div
                  className='relative'
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{
                    transform: `translate(${mousePosition.x * 0.5}px, ${
                      mousePosition.y * 0.5
                    }px)`,
                  }}
                >
                  <div className='relative'>
                    {/* Glow effect */}
                    <div className='absolute -inset-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl opacity-20 blur-2xl' />

                    {/* Main image */}
                    <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                      <img
                        src={imageUrlPrincipal}
                        alt={
                          paginaSobre?.imagemPrincipal?.alt ||
                          paginaSobre?.titulo ||
                          'Lucas Foresti'
                        }
                        className='w-full h-auto aspect-[4/5] object-cover'
                        loading='eager'
                      />

                      {/* Overlay gradient */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />

                      {/* Racing elements overlay */}
                      <div className='absolute top-6 right-6'>
                        <motion.div
                          className='text-8xl font-black text-white/10 leading-none'
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          12
                        </motion.div>
                      </div>

                      {/* Stock Car badge */}
                      <div className='absolute bottom-6 left-6'>
                        <div className='px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20'>
                          <span className='text-white font-semibold text-sm uppercase tracking-wider'>
                            Stock Car Pro Series
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                      className='absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 backdrop-blur-md rounded-full flex items-center justify-center'
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <svg
                        className='w-12 h-12 text-blue-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
                      </svg>
                    </motion.div>

                    {/* Speed lines */}
                    <motion.div
                      className='absolute -left-4 top-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent to-blue-400'
                      animate={{ x: [0, 30, 0], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.div
                      className='absolute -left-4 top-1/2 mt-4 w-16 h-0.5 bg-gradient-to-r from-transparent to-orange-400'
                      animate={{ x: [0, 25, 0], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ opacity }}
          >
            <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
              <motion.div
                className='w-1 h-3 bg-blue-400 rounded-full mt-2'
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Seção de Últimas Notícias */}
        {ultimasNoticias && ultimasNoticias.length > 0 && (
          <section className='py-16 md:py-24 bg-gradient-to-b from-black to-neutral-950'>
            <div className='container mx-auto px-4'>
              <motion.div
                className='text-center mb-12 md:mb-16'
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
                    Últimas Atualizações
                  </span>
                </motion.div>

                <h2 className='font-heading text-4xl md:text-5xl font-bold mb-4 text-neutral-100'>
                  Fique por <span className='text-blue-400'>Dentro</span>
                </h2>
                <p className='text-neutral-300 mb-12 md:mb-16 max-w-xl mx-auto text-lg'>
                  As últimas novidades, resultados e bastidores do universo de
                  Lucas Foresti na Stock Car.
                </p>
              </motion.div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {ultimasNoticias.map((noticia, index) => (
                  <motion.div
                    key={noticia._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <CardNoticia noticia={noticia} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                className='mt-16 text-center'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  to='/noticias'
                  className='group inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full font-semibold transition-all duration-300'
                >
                  <span>Ver Todas as Notícias</span>
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
                      d='M17 8l4 4m0 0l-4 4m4-4H3'
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Seção Próxima Corrida */}
        {/* <ProximaCorridaCountdown proximaCorrida={proximaCorrida} /> */}

        {/* Seção Galeria */}
        <HomeGaleriaSection />
      </div>
    </>
  );
}
