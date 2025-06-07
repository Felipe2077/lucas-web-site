// src/components/layout/Header.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HeaderGlassmorphism = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Detecta a página atual baseada no pathname
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏁' },
    { href: '/noticias', label: 'Notícias', icon: '📰' },
    { href: '/galeria', label: 'Galeria', icon: '📸' },
    { href: '/sobre', label: 'Sobre', icon: '👤' },
    { href: '/patrocinadores', label: 'Parceiros', icon: '🤝' },
    { href: '/calendario', label: 'Calendário', icon: '📅' },
    { href: '/contato', label: 'Contato', icon: '📧' },
  ];

  // Função para verificar se o link está ativo
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container mx-auto px-4'>
          <div
            className={`relative rounded-2xl transition-all duration-500 ${
              isScrolled
                ? 'bg-black/40 backdrop-blur-2xl border border-white/10'
                : 'bg-transparent'
            }`}
          >
            {/* Glow effect */}
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500' />

            <div className='relative px-6 py-4'>
              <div className='flex items-center justify-between'>
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to='/' className='flex items-center gap-3 group'>
                    <div className='relative'>
                      <motion.div
                        className='text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600'
                        animate={{
                          backgroundPosition: ['0%', '100%', '0%'],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          backgroundSize: '200% 100%',
                          textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                        }}
                      >
                        <img src='/logo.png' alt='Logo' className='w-[92px]' />
                      </motion.div>
                      <div className='absolute -inset-2 bg-blue-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity' />
                    </div>
                  </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className='hidden lg:flex items-center gap-2'>
                  {navLinks.map((link, index) => {
                    const isActive = isActiveLink(link.href);

                    return (
                      <motion.div
                        key={link.href}
                        className='relative'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.href}
                          className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group flex items-center gap-2 ${
                            isActive
                              ? 'text-white bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          {/* Hover effect - só aparece se NÃO estiver ativo */}
                          {!isActive && (
                            <div className='absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                          )}

                          <span
                            className={`text-sm transition-opacity duration-300 relative z-10 ${
                              isActive
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {link.icon}
                          </span>
                          <span className='relative z-10'>{link.label}</span>

                          {/* Underline effect */}
                          <motion.div
                            className='absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full'
                            initial={{ width: 0, x: '-50%' }}
                            animate={{
                              width: isActive ? '80%' : 0,
                            }}
                            whileHover={{ width: '80%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Menu Button */}
                <button
                  className='lg:hidden relative w-10 h-10 flex items-center justify-center'
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className='absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg' />
                  <motion.div className='relative w-6 h-5 flex flex-col justify-between'>
                    <motion.span
                      className='w-full h-0.5 bg-white rounded-full'
                      animate={{
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 10 : 0,
                      }}
                    />
                    <motion.span
                      className='w-full h-0.5 bg-white rounded-full'
                      animate={{
                        opacity: isMobileMenuOpen ? 0 : 1,
                      }}
                    />
                    <motion.span
                      className='w-full h-0.5 bg-white rounded-full'
                      animate={{
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -10 : 0,
                      }}
                    />
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className='fixed inset-0 z-40 lg:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className='absolute inset-0 bg-black/80 backdrop-blur-xl'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className='absolute top-20 left-4 right-4 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 p-6'
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ type: 'spring' }}
            >
              <nav className='flex flex-col gap-2'>
                {navLinks.map((link, index) => {
                  const isActive = isActiveLink(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className={`relative px-4 py-3 rounded-xl font-medium group overflow-hidden block ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30'
                            : 'text-gray-300 hover:text-white'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {/* Hover effect para links não ativos */}
                        {!isActive && (
                          <motion.div
                            className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-orange-500/20'
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        <span className='relative z-10 flex items-center gap-3'>
                          <span className='text-lg'>{link.icon}</span>
                          {link.label}
                          {isActive && (
                            <motion.div
                              className='ml-auto w-2 h-2 bg-blue-400 rounded-full'
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <motion.div
                className='mt-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to='/contato'
                  className='w-full relative px-6 py-3 overflow-hidden rounded-xl group block text-center'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className='relative z-10 font-bold text-white uppercase tracking-wider'>
                    Entre em Contato
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl' />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add padding to body to account for fixed header */}
      <div className='h-24' />
    </>
  );
};

export default HeaderGlassmorphism;
