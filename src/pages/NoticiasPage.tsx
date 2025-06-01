// src/pages/NoticiasPage.tsx
'use client'; // Embora seja Vite, se você copiou componentes do Next com isso, pode manter ou remover se não usar features específicas de Server/Client Components do Next.js. Para hooks do React, não é necessário no Vite.
// Vamos remover para um projeto Vite + React puro.

import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // useLocation em vez de usePathname
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
// import { groq } from 'next-sanity'; // Removido, usando strings simples para GROQ
import { Helmet } from 'react-helmet-async';
import CardNoticia from '../components/noticias/CardNoticia'; // Ajuste o caminho
import PaginationControls from '../components/noticias/PaginationControls'; // Ajuste o caminho
import type { Categoria, NoticiaCard } from '../types/sanity'; // Ajuste o caminho

const ITEMS_PER_PAGE = 5;

const categoriasQuery = `*[_type == "categoria"]{_id, nome, slug} | order(nome asc)`;

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<NoticiaCard[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [totalNoticias, setTotalNoticias] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string | null>(
    null
  );
  const nomeDoPiloto = 'Lucas Foresti';
  let pageTitle = `Notícias - ${nomeDoPiloto}`;
  let pageDescription = `Fique por dentro das últimas notícias e novidades sobre ${nomeDoPiloto} na Stock Car.`;

  const location = useLocation(); // Usando useLocation
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathname = location.pathname; // Obtendo o pathname de location

  const fetchData = useCallback(
    async (pageToFetch: number, categorySlugToFilter: string | null) => {
      setLoading(true);
      const client = getClient();
      const offset = (pageToFetch - 1) * ITEMS_PER_PAGE;

      // CORREÇÃO AQUI: Garanta que filterCondition não tenha chaves extras
      let filterCondition = `_type == "noticia"`;
      const queryParams: {
        limit: number;
        offset: number;
        categoriaSlug?: string;
      } = {
        limit: ITEMS_PER_PAGE,
        offset,
      };

      if (categorySlugToFilter) {
        filterCondition += ` && $categoriaSlug in categorias[]->slug.current`;
        queryParams.categoriaSlug = categorySlugToFilter;
      }

      // CORREÇÃO AQUI: Garanta que a interpolação e os colchetes/chaves estão corretos
      const noticiasQueryGroq = `*[${filterCondition}] {
      _id, titulo, slug, dataDePublicacao, imagemDeCapa{alt, asset->}, resumo
    } | order(dataDePublicacao desc) [$offset...$offset + $limit]`;

      const totalNoticiasQueryGroq = `count(*[${filterCondition}])`;

      try {
        const [fetchedNoticias, fetchedTotalNoticias, fetchedCategorias]: [
          NoticiaCard[],
          number,
          Categoria[]
        ] = await Promise.all([
          client.fetch(noticiasQueryGroq, queryParams),
          client.fetch(
            totalNoticiasQueryGroq,
            queryParams.categoriaSlug
              ? { categoriaSlug: queryParams.categoriaSlug }
              : {}
          ),
          categorias.length === 0
            ? client.fetch(categoriasQuery)
            : Promise.resolve(categorias),
        ]);

        setNoticias(fetchedNoticias);
        setTotalNoticias(fetchedTotalNoticias);
        if (categorias.length === 0 && fetchedCategorias) {
          setCategorias(fetchedCategorias);
        }
        setCurrentPage(pageToFetch);
      } catch (error) {
        console.error('Erro ao buscar dados de notícias:', error); // O erro que você viu deve aparecer aqui
      } finally {
        setLoading(false);
      }
    },
    [categorias]
  ); // 'categorias' como dependência para a lógica de fetch único

  useEffect(() => {
    const categoriaSlugFromUrl = searchParams.get('categoria');
    const paginaQueryFromUrl = searchParams.get('pagina');
    const pageNum = parseInt(paginaQueryFromUrl || '1', 10);

    setCurrentCategorySlug(categoriaSlugFromUrl);
    fetchData(pageNum, categoriaSlugFromUrl);
  }, [searchParams, fetchData]);

  const totalPaginas = Math.ceil(totalNoticias / ITEMS_PER_PAGE);
  const categoriaAtualObj = currentCategorySlug
    ? categorias.find((cat) => cat.slug.current === currentCategorySlug)
    : null;

  const handleCategoryFilter = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('categoria', slug);
    } else {
      params.delete('categoria');
    }
    params.delete('pagina'); // Reseta para página 1 ao mudar categoria
    navigate(`${pathname}?${params.toString()}`);
  };

  if (loading && noticias.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16 text-center animate-pulse'>
        Carregando notícias...
      </div>
    );
  }
  if (categoriaAtualObj) {
    pageTitle = `${categoriaAtualObj.nome} - Notícias - ${nomeDoPiloto}`;
    pageDescription = `Notícias da categoria ${categoriaAtualObj.nome} sobre ${nomeDoPiloto}.`;
  } else if (searchParams.get('pagina')) {
    pageTitle = `Página ${currentPage} de Notícias - ${nomeDoPiloto}`;
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        {/* Adicione outras meta tags se necessário */}
      </Helmet>

      <div className='container mx-auto px-4 py-8 md:py-12'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6'>
          Notícias
        </h1>
        <div className='flex flex-wrap justify-center gap-2 md:gap-4 mb-10 md:mb-16'>
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
              !currentCategorySlug
                ? 'bg-piloto-blue text-white border-piloto-blue'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryFilter(cat.slug.current)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                currentCategorySlug === cat.slug.current
                  ? 'bg-piloto-blue text-white border-piloto-blue'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>
        {loading && noticias.length > 0 && (
          <p className='text-center'>Atualizando notícias...</p>
        )}{' '}
        {/* Loading para re-fetch */}
        {!loading && categoriaAtualObj && (
          <h2 className='font-heading text-2xl md:text-3xl text-center mb-10'>
            Mostrando notícias da categoria: {categoriaAtualObj.nome}
          </h2>
        )}
        {!loading && noticias && noticias.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12'>
              {noticias.map((noticia) => (
                <CardNoticia key={noticia._id} noticia={noticia} />
              ))}
            </div>
            <PaginationControls
              paginaAtual={currentPage}
              totalPaginas={totalPaginas}
            />
          </>
        ) : (
          !loading && (
            <p className='text-center text-gray-500 dark:text-gray-300 py-10'>
              Nenhuma notícia encontrada{' '}
              {categoriaAtualObj
                ? `para a categoria "${categoriaAtualObj.nome}"`
                : ''}
              .
            </p>
          )
        )}
      </div>
    </>
  );
}
