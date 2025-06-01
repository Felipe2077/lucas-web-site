// src/components/home/HomeGaleriaSection.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClient } from '../../lib/sanity.client'; // Ajuste o caminho
import Galeria3DModernCard, {
  type AlbumDataCard,
} from '../galeria/Galeria3DModernCard'; // Importa o card e seu tipo

// Query para os álbuns do teaser (pode ser a mesma da HomePage)
const teaserAlbunsQuery = `*[_type == "albumDeFotos" && defined(imagemDeCapa.asset) && defined(slug.current)]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  imagemDeCapa{alt, asset->{_id, url, metadata{dimensions}}},
  "fotos": fotos[0...2]{_key, alt, asset->{_id, url, metadata{dimensions}}} // Pega primeiras 3 fotos para o stack
} | order(dataDoAlbum desc, _createdAt desc) [0...3]`; // Pega 3 álbuns

export default function HomeGaleriaSection() {
  const [teaserAlbuns, setTeaserAlbuns] = useState<AlbumDataCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getClient();
    const fetchTeaserData = async () => {
      setLoading(true);
      try {
        const data = await client.fetch(teaserAlbunsQuery);
        setTeaserAlbuns(data || []);
      } catch (error) {
        console.error('Erro ao buscar teaser de álbuns:', error);
        setTeaserAlbuns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeaserData();
  }, []);

  // Variantes para animação da seção e do CTA
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className='py-16 md:py-24 bg-black overflow-hidden text-white'>
      {' '}
      {/* Fundo preto para esta seção */}
      <div className='container mx-auto px-4'>
        {/* Header da Seção */}
        <motion.div
          className='text-center mb-12 md:mb-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className='text-4xl sm:text-5xl md:text-6xl font-black mb-4'>
            <span className='bg-gradient-to-r from-piloto-azul-light via-piloto-azul to-purple-500 text-transparent bg-clip-text'>
              Momentos
            </span>{' '}
            <span className='text-white'>Épicos</span>
          </h2>
          <p className='text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto'>
            Cada curva, cada ultrapassagem, cada vitória. Viva a emoção da Stock
            Car através das nossas lentes.
          </p>
        </motion.div>

        {/* Grid de Álbuns do Teaser */}
        {loading && <p className='text-center'>Carregando galeria...</p>}
        {!loading && teaserAlbuns.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 perspective-1000px'>
            {teaserAlbuns.map((album, index) => (
              <Galeria3DModernCard
                key={album._id}
                album={album}
                index={index}
              />
            ))}
          </div>
        )}
        {!loading && teaserAlbuns.length === 0 && (
          <p className='text-center text-neutral-400'>
            Nenhum álbum em destaque no momento.
          </p>
        )}

        {/* CTA para Galeria Completa */}
        <motion.div
          className='text-center mt-16 md:mt-20'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ delay: 0.3 }}
        >
          <Link // Mudado de <a> para <Link>
            to='/galeria'
            className='group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 overflow-hidden rounded-full bg-gradient-to-r from-piloto-azul to-purple-600 hover:from-purple-600 hover:to-piloto-azul transition-all duration-300 shadow-lg hover:shadow-piloto-azul/40 transform hover:scale-105'
          >
            <span className='relative z-10 text-white font-heading font-semibold text-sm sm:text-base uppercase tracking-wider'>
              Ver Galeria Completa
            </span>
            <svg // Ícone de seta
              className='relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-white transform transition-transform duration-300 group-hover:translate-x-1'
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
  );
}
