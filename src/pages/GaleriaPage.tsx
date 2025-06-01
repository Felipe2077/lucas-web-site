// src/pages/GaleriaPage.tsx
// 'use client'; // Não é estritamente necessário para hooks no Vite

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
// import { groq } from 'next-sanity'; // Usaremos strings simples

// Importa o novo card 3D e seu tipo de prop para o álbum
import Galeria3DModernCard, {
  type AlbumDataCard,
} from '../components/galeria/Galeria3DModernCard'; // Ajuste o caminho

// Query GROQ ATUALIZADA para buscar todos os álbuns de fotos
// com a imagem de capa E algumas fotos internas para o efeito de stack no card
const albunsQuery = `*[_type == "albumDeFotos" && defined(slug.current)]{
  _id,
  titulo,
  slug,
  dataDoAlbum,
  imagemDeCapa{alt, asset->{_id, url, metadata{dimensions}}}, // Imagem de capa principal
  "fotos": fotos[0...2]{ // Pega as primeiras 3 fotos (índices 0, 1, 2) para o stack
    _key, 
    alt, 
    asset->{_id, url, metadata{dimensions}}
  },
  descricao // Pode ser útil para metadados ou um futuro tooltip/detalhe
} | order(dataDoAlbum desc, _createdAt desc)`; // Ordena por data do álbum ou data de criação

export default function GaleriaPage() {
  const [albuns, setAlbuns] = useState<AlbumDataCard[]>([]); // Usa o novo tipo AlbumDataCard
  const [loading, setLoading] = useState(true);
  const nomeDoPiloto = 'Lucas Foresti'; // Substitua ou busque dinamicamente se necessário

  useEffect(() => {
    const client = getClient();
    const fetchAlbuns = async () => {
      setLoading(true);
      try {
        const data: AlbumDataCard[] = await client.fetch(albunsQuery);
        setAlbuns(data || []); // Garante que albuns seja sempre um array
      } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
        setAlbuns([]); // Define como array vazio em caso de erro
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
          content={`Veja os álbuns de fotos e os melhores momentos do piloto ${nomeDoPiloto}.`}
        />
      </Helmet>
      {/* Ajustado o fundo da página para um tom escuro consistente */}
      <div className='min-h-screen bg-neutral-900 text-neutral-100 py-8 md:py-12'>
        <div className='container mx-auto px-4'>
          <h1 className='font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-16 text-white'>
            Galeria de <span className='text-piloto-azul-light'>Fotos</span>
          </h1>

          {loading ? (
            <p className='text-center text-lg animate-pulse'>
              Carregando álbuns...
            </p>
          ) : albuns && albuns.length > 0 ? (
            // Adicionando classe de perspectiva ao grid para o efeito 3D dos cards
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 xl:gap-14 [perspective:1000px]'>
              {albuns.map((album, index) => (
                <Galeria3DModernCard
                  key={album._id}
                  album={album}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className='text-center text-neutral-400 text-lg'>
              Nenhum álbum de fotos disponível no momento. Volte em breve!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
