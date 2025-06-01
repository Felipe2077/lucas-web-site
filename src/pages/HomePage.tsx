// src/pages/HomePage.tsx

import ProximaCorridaCountdown from '@/components/calendario/ProximaCorridaCountDown';
import HomeGaleriaSection from '@/components/galeria/HomeGaleriaSection';
import HeroSection from '@/components/home/HeroSection';
import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useState } from 'react'; // Removido useCallback se não for usado diretamente aqui
import { Helmet } from 'react-helmet-async';
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
  cidade: string;
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
  _id, nomeDoEvento, dataDoEvento, circuito, cidade
}`;

const teaserAlbunsQuery = `*[_type == "albumDeFotos" && defined(imagemDeCapa.asset) && defined(slug.current)]{
  _id,
  titulo,
  slug,
  imagemDeCapa{alt, asset->}
} | order(dataDoAlbum desc, _createdAt desc) [0...6]`; // Pega os 3 álbuns mais recentes

const albunsCompletosQuery = `*[_type == "albumDeFotos" && defined(slug.current)]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  imagemDeCapa{alt, asset->}, // Imagem de capa principal
  "fotos": fotos[]{_key, alt, asset->{_id, url, metadata{dimensions}}}, // Array de fotos para o stack
  // Adicione aqui um campo para corGradiente se você o criou no Sanity
  // corGradiente 
} | order(dataDoAlbum desc, _createdAt desc)`;

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
  const [albuns, setAlbuns] = useState<AlbumData[]>([]); // Usa o novo tipo AlbumData
  useEffect(() => {
    const client = getClient();
    const fetchAlbuns = async () => {
      setLoading(true);
      try {
        const data: AlbumData[] = await client.fetch(albunsCompletosQuery);
        setAlbuns(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchAlbuns();
  }, []);
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Atraso entre a animação dos filhos
        delayChildren: 0.2, // Atraso antes de começar a animar os filhos
      },
    },
  };
  const heroItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
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
      <HeroSection />
      {/* FIM DA NOVA SEÇÃO HERO */}

      {/* Seção de Últimas Notícias (seu código parece bom) */}
      {ultimasNoticias && ultimasNoticias.length > 0 && (
        <section className='py-16 md:py-24 bg-neutral-950'>
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

      {/* Seção Próxima Corrida */}
      <ProximaCorridaCountdown proximaCorrida={proximaCorrida} />

      {/* SEÇÃO CHAMADA PARA GALERIA ATUALIZADA */}
      <HomeGaleriaSection />
    </>
  );
}
