// src/components/layout/Header.tsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/noticias', label: 'Notícias' },
    { href: '/galeria', label: 'Galeria' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/patrocinadores', label: 'Patrocinadores' },
    { href: '/calendario', label: 'Calendário' },
    { href: '/contato', label: 'Contato' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Estilos para NavLink (links de navegação)
  // Usando as classes geradas pelo Tailwind a partir das variáveis CSS no @theme
  const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out font-sans ${
      isActive
        ? 'bg-piloto-azul text-white' // Link ativo usa a cor piloto-azul (DEFAULT)
        : 'text-neutral-100 hover:text-white hover:bg-piloto-azul-dark/60' // Texto claro, hover com azul escuro levemente transparente
    }`;

  const getMobileLinkClassName = ({
    isActive,
  }: {
    isActive: boolean;
  }): string =>
    `block px-3 py-3 rounded-md text-base font-medium transition-colors duration-150 ease-in-out font-sans ${
      isActive
        ? 'bg-piloto-azul text-white'
        : 'text-neutral-100 hover:bg-piloto-azul-dark hover:text-white'
    }`;

  return (
    // Usando neutral-800 para o fundo do header e neutral-100 para o texto padrão do header
    <header className='bg-neutral-900 text-neutral-100 shadow-lg sticky top-0 z-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              to='/'
              className='flex items-center group'
              onClick={closeMobileMenu}
            >
              <img
                src='/images/logo-lucas-foresti.png' // Certifique-se que este caminho está correto
                alt='Logo Lucas Foresti'
                className='h-10 md:h-12 w-auto transition-opacity duration-300 group-hover:opacity-80'
              />
              {/* Opcional: Nome do piloto ao lado do logo, usando a fonte de título */}
              {/* <span className="ml-3 font-heading text-xl font-bold text-white group-hover:text-piloto-azul-light transition-colors">
                LUCAS FORESTI
              </span> */}
            </Link>
          </div>

          {/* Navegação Desktop */}
          <nav className='hidden md:flex items-center space-x-1 lg:space-x-2'>
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={getLinkClassName}
                end={link.href === '/'} // 'end' para o link Home ser exato
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Botão de Menu Mobile */}
          <div className='md:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-piloto-azul' // Ring com piloto-azul
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className='sr-only'>Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <svg
                  className='block h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 6h16M4 12h16m-7 6h7'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Conteúdo */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-neutral-800 shadow-xl transition-all duration-300 ease-out transform ${
          isMobileMenuOpen
            ? 'max-h-[calc(100vh-4rem)] opacity-100 translate-y-0' // Garante que o menu não seja maior que a tela
            : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
        }`}
        id='mobile-menu'
      >
        <div className='px-2 pt-2 pb-4 space-y-1 sm:px-3'>
          {navLinks.map((link) => (
            <NavLink
              key={`mobile-${link.label}`}
              to={link.href}
              className={getMobileLinkClassName}
              onClick={toggleMobileMenu} // Fecha o menu ao clicar
              end={link.href === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
