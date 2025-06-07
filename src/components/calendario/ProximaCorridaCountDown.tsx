// src/components/calendario/ProximaCorridaCountDown.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  CountdownUnitProps,
  ProximaCorridaData,
} from '../../types/sanity';

interface ProximaCorridaCountdownProps {
  proximaCorrida?: ProximaCorridaData;
}

const ProximaCorridaCountdown = ({
  proximaCorrida,
}: ProximaCorridaCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  // Mock data se não vier props (para desenvolvimento)
  const eventData = proximaCorrida || {
    evento: {
      _id: 'mock',
      _type: 'evento',
      nome: 'GP São Paulo - Stock Car',
      data: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias no futuro
      circuito: 'Autódromo de Interlagos',
      cidade: 'São Paulo, SP',
      tipo: 'corrida' as const,
      status: 'agendado' as const,
    },
    nomeDoEvento: 'GP São Paulo - Stock Car',
    circuito: 'Autódromo de Interlagos',
    cidade: 'São Paulo, SP',
  };

  useEffect(() => {
    // Verificar se há dados do evento
    const targetDate = eventData.evento?.data || eventData.nomeDoEvento;
    if (!targetDate) return;

    const eventTime = new Date(
      eventData.evento?.data || Date.now() + 7 * 24 * 60 * 60 * 1000
    ).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventData.evento?.data]);

  const CountdownUnit = ({ value, label, delay }: CountdownUnitProps) => (
    <motion.div
      className='relative'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      {/* 3D Card Effect */}
      <div className='relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 group perspective-1000'>
        <motion.div
          className='absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl backdrop-blur-xl border border-white/10'
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{
            rotateY: 10,
            rotateX: -10,
            scale: 1.05,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Glowing effect */}
          <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500' />

          {/* Number */}
          <div className='relative h-full flex flex-col items-center justify-center'>
            <motion.span
              key={value}
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300'
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.5)',
              }}
            >
              {String(value).padStart(2, '0')}
            </motion.span>
            <span className='text-xs sm:text-sm md:text-base text-gray-400 uppercase tracking-wider mt-1 md:mt-2'>
              {label}
            </span>
          </div>

          {/* Reflection */}
          <div className='absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl' />
        </motion.div>

        {/* Shadow */}
        <div className='absolute -bottom-2 sm:-bottom-4 left-2 right-2 h-4 sm:h-8 bg-black/30 rounded-full blur-xl' />
      </div>
    </motion.div>
  );

  // Se não há evento e nem dados mock, não renderizar
  if (!eventData?.evento && !eventData?.nomeDoEvento) {
    return null;
  }

  return (
    <section className='relative py-16 md:py-24 overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900'>
        {/* Racing track pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-1/2 left-0 right-0 h-1 bg-white transform -translate-y-1/2' />
          <div className='absolute top-1/2 left-0 right-0 h-8 border-t-2 border-b-2 border-white border-dashed transform -translate-y-1/2' />
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          className='absolute top-20 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl'
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
          className='absolute bottom-20 -right-40 w-80 h-80 bg-orange-500 rounded-full opacity-20 blur-3xl'
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

      <div className='relative z-10 container mx-auto px-4'>
        {/* Header */}
        <motion.div
          className='text-center mb-12 md:mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-md rounded-full mb-6'
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse' />
            <span className='text-orange-400 font-semibold uppercase tracking-wider text-sm'>
              Próxima Corrida
            </span>
          </motion.div>

          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4'>
            {eventData.evento?.nome || eventData.nomeDoEvento}
          </h2>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gray-400'>
            <div className='flex items-center gap-2'>
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
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              <span className='text-base md:text-lg'>
                {eventData.evento?.circuito || eventData.circuito}
              </span>
            </div>
            {(eventData.evento?.cidade || eventData.cidade) && (
              <>
                <span className='hidden sm:block text-gray-600'>•</span>
                <span className='text-base md:text-lg'>
                  {eventData.evento?.cidade || eventData.cidade}
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Countdown */}
        <div className='flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16'>
          <CountdownUnit value={timeLeft.dias} label='Dias' delay={0} />
          <CountdownUnit value={timeLeft.horas} label='Horas' delay={0.1} />
          <CountdownUnit value={timeLeft.minutos} label='Minutos' delay={0.2} />
          <CountdownUnit
            value={timeLeft.segundos}
            label='Segundos'
            delay={0.3}
          />
        </div>

        {/* Circuit Preview */}
        <motion.div
          className='max-w-4xl mx-auto'
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className='relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-1'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-50 blur-2xl' />

            <div className='relative bg-black rounded-3xl p-6 md:p-8 lg:p-12'>
              {/* Circuit Map Placeholder */}
              <div className='aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden'>
                {/* Animated circuit lines */}
                <svg
                  className='absolute inset-0 w-full h-full'
                  viewBox='0 0 800 400'
                >
                  <motion.path
                    d='M100,200 Q200,100 300,150 T500,150 Q600,200 700,200'
                    stroke='url(#gradient)'
                    strokeWidth='3'
                    fill='none'
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <defs>
                    <linearGradient
                      id='gradient'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='0%'
                    >
                      <stop offset='0%' stopColor='#3B82F6' />
                      <stop offset='50%' stopColor='#8B5CF6' />
                      <stop offset='100%' stopColor='#F97316' />
                    </linearGradient>
                  </defs>
                </svg>

                <div className='text-center z-10'>
                  <p className='text-gray-500 text-lg mb-2'>Mapa do Circuito</p>
                  <p className='text-gray-600 text-sm'>Em breve</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 justify-center'>
                <motion.button
                  className='group relative px-6 md:px-8 py-3 md:py-4 overflow-hidden rounded-full'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className='relative z-10 font-bold text-white uppercase tracking-wider text-sm md:text-base'>
                    Adicionar ao Calendário
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full' />
                  <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full'
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to='/calendario'
                    className='group relative inline-block px-6 md:px-8 py-3 md:py-4 rounded-full border-2 border-gray-600 hover:border-orange-500 transition-colors'
                  >
                    <span className='font-bold text-gray-300 group-hover:text-orange-400 uppercase tracking-wider transition-colors text-sm md:text-base'>
                      Ver Calendário Completo
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProximaCorridaCountdown;
