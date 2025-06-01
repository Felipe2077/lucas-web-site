import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className='relative h-screen min-h-[700px] overflow-hidden bg-black'>
      {/* Video Background with Overlay */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10' />

        {/* Animated Gradient Background */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 via-black to-orange-600/20 animate-gradient-shift' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent' />
        </div>

        {/* Racing Lines Animation */}
        <div className='absolute inset-0 overflow-hidden'>
          <motion.div
            className='absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30'
            animate={{
              x: ['-100%', '100%'],
              y: ['20vh', '25vh', '20vh'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className='absolute w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30'
            animate={{
              x: ['100%', '-100%'],
              y: ['80vh', '75vh', '80vh'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
              delay: 2,
            }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-blue-400 rounded-full opacity-40'
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className='relative z-20 h-full flex items-center justify-center'>
        <motion.div className='text-center px-4' style={{ opacity }}>
          {/* Number Animation */}
          <motion.div
            className='mb-8'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <motion.div
              className='text-[120px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 leading-none select-none'
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                textShadow:
                  '0 0 80px rgba(59, 130, 246, 0.5), 0 0 120px rgba(59, 130, 246, 0.3)',
              }}
            >
              12
            </motion.div>
          </motion.div>

          {/* Name with Glitch Effect */}
          <motion.h1
            className='relative'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className='block text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter'>
              <span className='relative inline-block'>
                <span className='relative z-10 text-white'>Lucas</span>
                <motion.span
                  className='absolute inset-0 text-blue-400 opacity-70'
                  animate={{
                    x: [0, 2, 0, -2, 0],
                    y: [0, -2, 0, 2, 0],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                >
                  Lucas
                </motion.span>
              </span>{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text'>
                  Foresti
                </span>
                <motion.span
                  className='absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text opacity-50 blur-sm'
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  Foresti
                </motion.span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle with Typewriter Effect */}
          <motion.p
            className='mt-6 text-xl md:text-2xl text-gray-300 font-light'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className='text-blue-400 font-semibold'>STOCK CAR</span> PRO
            SERIES DRIVER
          </motion.p>

          {/* CTAs */}
          <motion.div
            className='mt-12 flex flex-col sm:flex-row gap-4 justify-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href='/noticias'
              className='group relative px-8 py-4 overflow-hidden rounded-full font-bold text-white uppercase tracking-wider'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='relative z-10'>Últimas Notícias</span>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full' />
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full'
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <motion.a
              href='/galeria'
              className='group relative px-8 py-4 overflow-hidden rounded-full font-bold uppercase tracking-wider border-2 border-orange-500 text-orange-500'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='relative z-10 group-hover:text-white transition-colors'>
                Ver Galeria
              </span>
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full'
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity }}
      >
        <div className='w-6 h-10 border-2 border-white rounded-full flex justify-center'>
          <motion.div
            className='w-1 h-3 bg-white rounded-full mt-2'
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Speed Lines Effect */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-32 z-10'
        style={{ y: y1 }}
      >
        <div className='h-full bg-gradient-to-t from-black to-transparent' />
      </motion.div>
    </section>
  );
};

export default HeroSection;
