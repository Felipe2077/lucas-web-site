// src/components/noticias/PaginationControls.tsx
'use client';

import { Link, useLocation, useSearchParams } from 'react-router-dom';

interface PaginationControlsProps {
  paginaAtual: number;
  totalPaginas: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  paginaAtual,
  totalPaginas,
}) => {
  const pathname = useLocation();
  const searchParams = useSearchParams();

  const criarUrlPagina = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pagina', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPaginas <= 1) {
    return null;
  }

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, paginaAtual - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPaginas, startPage + maxPagesToShow - 1);

  if (
    endPage - startPage + 1 < maxPagesToShow &&
    totalPaginas > maxPagesToShow
  ) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav
      aria-label='Paginação de notícias'
      className='mt-12 flex justify-center items-center space-x-1 sm:space-x-2'
    >
      {/* Botão Anterior */}
      <Link
        to={criarUrlPagina(paginaAtual - 1)}
        className={`px-3 py-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
          paginaAtual === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-disabled={paginaAtual === 1}
        onClick={(e) => {
          if (paginaAtual === 1) e.preventDefault();
        }}
      >
        Anterior
      </Link>

      {/* Números de Página */}
      {startPage > 1 && (
        <>
          <Link
            to={criarUrlPagina(1)}
            className='hidden sm:inline-flex items-center justify-center px-3 py-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            1
          </Link>
          {startPage > 2 && (
            <span className='hidden sm:inline-flex items-center px-2 py-2 sm:px-4 text-xs sm:text-sm'>
              ...
            </span>
          )}
        </>
      )}

      {pageNumbers.map((page) => (
        <Link
          key={page}
          to={criarUrlPagina(page)}
          className={`px-3 py-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
            page === paginaAtual
              ? 'bg-piloto-blue text-white border-piloto-blue z-10'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          aria-current={page === paginaAtual ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPaginas && (
        <>
          {endPage < totalPaginas - 1 && (
            <span className='hidden sm:inline-flex items-center px-2 py-2 sm:px-4 text-xs sm:text-sm'>
              ...
            </span>
          )}
          <Link
            to={criarUrlPagina(totalPaginas)}
            className='hidden sm:inline-flex items-center justify-center px-3 py-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            {totalPaginas}
          </Link>
        </>
      )}

      {/* Botão Próxima */}
      <Link
        to={criarUrlPagina(paginaAtual + 1)}
        className={`px-3 py-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
          paginaAtual === totalPaginas
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-disabled={paginaAtual === totalPaginas}
        onClick={(e) => {
          if (paginaAtual === totalPaginas) e.preventDefault();
        }}
      >
        Próxima
      </Link>
    </nav>
  );
};

export default PaginationControls;
