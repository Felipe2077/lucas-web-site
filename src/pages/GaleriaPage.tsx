// src/pages/GaleriaPage.tsx
'use client'; // Para useState e useEffect

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
// Removido import de groq de next-sanity, usando strings
import CardAlbum, { type AlbumParaCard } from '../components/galeria/CardAlbum'; // Ajuste o caminho

// Query GROQ para buscar todos os álbuns de fotos
const albunsQuery = `*[_type == "albumDeFotos"]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  imagemDeCapa{alt, asset->}, // Buscando alt e expandindo asset
  descricao
} | order(dataDoAlbum desc, _createdAt desc)`;

export default function GaleriaPage() {
  const [albuns, setAlbuns] = useState<AlbumParaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const nomeDoPiloto = 'Lucas Foresti'; // Substitua ou busque dinamicamente se necessário

  useEffect(() => {
    const client = getClient();
    const fetchAlbuns = async () => {
      setLoading(true);
      try {
        const data: AlbumParaCard[] = await client.fetch(albunsQuery);
        setAlbuns(data);
      } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbuns();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Galeria de Fotos - ${nomeDoPiloto}`}</title>
        <meta
          name='description'
          content={`Veja os melhores momentos e fotos do piloto ${nomeDoPiloto}.`}
        />
      </Helmet>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16'>
          Galeria de Fotos
        </h1>

        {loading ? (
          <p className='text-center animate-pulse'>Carregando álbuns...</p>
        ) : albuns && albuns.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
            {albuns.map((album) => (
              <CardAlbum key={album._id} album={album} />
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-600 dark:text-gray-400'>
            Nenhum álbum de fotos disponível no momento.
          </p>
        )}
      </div>
    </>
  );
}
