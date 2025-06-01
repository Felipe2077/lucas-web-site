// postcss.config.mjs (tentativa mais simples)
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    // Considere adicionar autoprefixer explicitamente se necessário,
    // embora @tailwindcss/postcss (v4) possa já incluí-lo.
    // 'autoprefixer': {},
  },
};
