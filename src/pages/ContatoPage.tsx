// src/pages/ContatoPage.tsx

import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ContatoPage = () => {
  const nomeDoPiloto = 'Lucas Foresti';

  // Redes sociais - mesmas do Footer
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/pilotolucasforesti',
      icon: '📷',
      gradient: 'from-pink-500 to-orange-500',
      description: 'Siga meu dia a dia nas pistas e bastidores',
      handle: '@pilotolucasforesti',
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/c/PilotoLucasForesti',
      icon: '🎥',
      gradient: 'from-red-500 to-red-600',
      description: 'Vlogs, corridas e conteúdo exclusivo',
      handle: 'Lucas Foresti',
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/pilotolucasforesti/?locale=pt_BR',

      icon: 'ⓕ',
      gradient: 'from-blue-400 to-blue-800',
      description: 'Momentos rápidos e divertidos',
      handle: '@pilotolucasforesti',
    },
    {
      name: 'X / Twitter',
      href: 'https://x.com/lucasforesti',
      icon: '🐦',
      gradient: 'from-blue-400 to-blue-600',
      description: 'Atualizações em tempo real das corridas',
      handle: '@lucasforesti',
    },
  ];

  const businessContact = {
    email: 'marketing@lucasforesti.com.br',
    subject: 'Contato Profissional - Lucas Foresti',
  };

  return (
    <>
      <Helmet>
        <title>{`Contato - ${nomeDoPiloto}`}</title>
        <meta
          name='description'
          content={`Entre em contato com ${nomeDoPiloto}. Siga nas redes sociais para acompanhar a carreira na Stock Car.`}
        />
      </Helmet>

      <div className='min-h-screen bg-black text-white'>
        {/* Hero Section */}
        <section className='relative py-20 md:py-32 overflow-hidden'>
          {/* Background Effects */}
          <div className='absolute inset-0'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 via-black to-orange-600/10' />

            {/* Animated Orbs */}
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
          </div>

          <div className='container mx-auto px-4 relative z-10'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full mb-6'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                <span className='text-blue-400 font-semibold uppercase tracking-wider text-sm'>
                  Vamos Conversar
                </span>
              </motion.div>

              <h1 className='text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6'>
                <span className='bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text'>
                  Contato
                </span>
              </h1>

              <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                Siga minha jornada na Stock Car e fique por dentro de tudo que
                acontece nas pistas e nos bastidores. Vamos acelerar juntos! 🏁
              </p>
            </motion.div>

            {/* Redes Sociais Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group relative'
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className='relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 group-hover:border-gray-600 transition-all duration-300 overflow-hidden'>
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Content */}
                    <div className='relative z-10 text-center self-center items-center justify-center'>
                      <div className='text-4xl mb-4 group-hover:scale-110 items-center justify-center transition-transform duration-300 self-center'>
                        {social.icon}
                      </div>

                      <h3 className='text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors'>
                        {social.name}
                      </h3>

                      <p className='text-gray-400 text-sm mb-4 leading-relaxed'>
                        {social.description}
                      </p>

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${social.gradient} text-white font-semibold text-sm`}
                      >
                        <span>Seguir</span>
                        <svg
                          className='w-4 h-4 group-hover:translate-x-1 transition-transform'
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
                      </div>

                      <p className='text-gray-500 text-xs mt-3'>
                        {social.handle}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Contato Profissional */}
            <motion.div
              className='max-w-2xl mx-auto text-center'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className='bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800'>
                <h2 className='text-2xl font-bold text-white mb-4'>
                  Contato Profissional
                </h2>
                <p className='text-gray-400 mb-6'>
                  Para parcerias, patrocínios ou assuntos comerciais, entre em
                  contato através do e-mail oficial.
                </p>

                <motion.a
                  href={`mailto:${
                    businessContact.email
                  }?subject=${encodeURIComponent(businessContact.subject)}`}
                  className='group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  <span>Enviar E-mail</span>
                  <svg
                    className='w-4 h-4 group-hover:translate-x-1 transition-transform'
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
                </motion.a>

                <p className='text-gray-500 text-sm mt-4'>
                  {businessContact.email}
                </p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className='text-center mt-16'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className='text-2xl font-bold text-white mb-6'>
                Acompanhe minha jornada
              </h3>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to='/calendario'
                    className='inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full font-semibold transition-all duration-300'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z'
                      />
                    </svg>
                    <span>Próximas Corridas</span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to='/noticias'
                    className='inline-flex items-center gap-2 px-8 py-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full font-semibold transition-all duration-300'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                      />
                    </svg>
                    <span>Últimas Notícias</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContatoPage;
