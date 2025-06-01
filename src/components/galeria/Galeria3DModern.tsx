import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Galeria3DModern = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Mock data - substituir com dados reais
  const albums = [
    {
      id: 1,
      title: 'Vitória em Interlagos',
      date: '15 Mar 2024',
      images: [
        'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80',
        'https://images.unsplash.com/photo-1552849397-7a2d7864a9b5?w=800&q=80',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
      ],
      color: 'from-blue-600 to-purple-600',
    },
    {
      id: 2,
      title: 'Treino em Goiânia',
      date: '02 Mar 2024',
      images: [
        'https://images.unsplash.com/photo-1539299266489-4c35e890e313?w=800&q=80',
        'https://images.unsplash.com/photo-1535732820275-52d8cdb54fcd?w=800&q=80',
        'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&q=80',
      ],
      color: 'from-orange-600 to-red-600',
    },
    {
      id: 3,
      title: 'Bastidores da Equipe',
      date: '28 Fev 2024',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
      ],
      color: 'from-green-600 to-teal-600',
    },
  ];

  return (
    <section className='py-20 bg-black overflow-hidden'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-5xl md:text-6xl font-black text-white mb-4'>
            <span className='bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text'>
              Momentos
            </span>
            <span className='text-white'>Épicos</span>
          </h2>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
            Cada curva, cada ultrapassagem, cada vitória. Viva a emoção da Stock
            Car através das nossas lentes.
          </p>
        </motion.div>

        {/* 3D Gallery Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000'>
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              className='relative group cursor-pointer'
              initial={{ opacity: 0, rotateY: -30 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              style={{
                transformStyle: 'preserve-3d',
                transform:
                  hoveredIndex === index
                    ? 'rotateY(5deg) rotateX(-5deg)'
                    : 'rotateY(0deg) rotateX(0deg)',
                transition: 'transform 0.5s ease',
              }}
            >
              {/* Album Container */}
              <div className='relative h-96 rounded-2xl overflow-hidden bg-gray-900'>
                {/* Stacked Images Effect */}
                {album.images.map((image, imgIndex) => (
                  <motion.div
                    key={imgIndex}
                    className='absolute inset-0'
                    style={{
                      zIndex: album.images.length - imgIndex,
                      transform: `translateZ(${imgIndex * 30}px) translateY(${
                        imgIndex * 10
                      }px) translateX(${imgIndex * 10}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{
                      y: hoveredIndex === index ? imgIndex * 15 : imgIndex * 10,
                      x: hoveredIndex === index ? imgIndex * 15 : imgIndex * 10,
                      rotateZ: hoveredIndex === index ? imgIndex * 2 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={image}
                      alt={`${album.title} - ${imgIndex + 1}`}
                      className='w-full h-full object-cover rounded-2xl'
                      style={{
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${album.color} opacity-20 rounded-2xl`}
                    />
                  </motion.div>
                ))}

                {/* Content Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl'>
                  <div className='absolute bottom-0 left-0 right-0 p-8'>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: hoveredIndex === index ? 0 : 20,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className='text-3xl font-bold text-white mb-2'>
                        {album.title}
                      </h3>
                      <p className='text-gray-300 mb-4'>{album.date}</p>
                      <button
                        onClick={() => setSelectedImage(album.images[0])}
                        className='inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300'
                      >
                        <span>Ver Álbum</span>
                        <svg
                          className='w-4 h-4'
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
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  className='absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full'
                  animate={{
                    scale: hoveredIndex === index ? 1.1 : 1,
                    rotate: hoveredIndex === index ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className='text-white font-semibold text-sm'>
                    {album.images.length} fotos
                  </span>
                </motion.div>
              </div>

              {/* 3D Shadow */}
              <div
                className='absolute -bottom-4 left-4 right-4 h-20 bg-gradient-to-b from-black/50 to-transparent rounded-full blur-2xl'
                style={{
                  transform: 'translateZ(-50px)',
                  opacity: hoveredIndex === index ? 0.8 : 0.4,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className='text-center mt-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <a
            href='/galeria'
            className='group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full'
          >
            <span className='relative z-10 text-white font-bold text-lg uppercase tracking-wider'>
              Ver Galeria Completa
            </span>
            <svg
              className='relative z-10 w-5 h-5 text-white group-hover:translate-x-2 transition-transform'
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

            {/* Animated Background */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full' />
            <motion.div
              className='absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full'
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.5 }}
            />
          </a>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt='Imagem em destaque'
              className='max-w-full max-h-full rounded-2xl shadow-2xl'
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <button
              className='absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors'
              onClick={() => setSelectedImage(null)}
            >
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeria3DModern;
