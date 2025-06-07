import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Força o modo escuro sempre ativo
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Mantendo suas cores originais do piloto
        piloto: {
          blue: {
            DEFAULT: '#0D6EFD', // Azul principal vibrante
            light: '#6BBEFF', // Tom claro para hover/detalhes
            dark: '#0A3D62', // Tom escuro para fundos (ex: Header)
          },
        },
        accent: {
          orange: '#FF6F00',
          yellow: '#FFD600',
        },
        neutral: {
          // Paleta de neutros para tema escuro
          '900': '#121212', // Fundo principal escuro
          '800': '#1A1D24', // Superfície um pouco mais clara
          '700': '#242933', // Outra superfície ou borda
          '200': '#A0AEC0', // Texto secundário em fundo escuro
          '100': '#F0F0F0', // Texto principal em fundo escuro
        },
        // Override cores para garantir tema escuro
        background: '#0a0a0a',
        foreground: '#ededed',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'Rajdhani',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [typography, aspectRatio],
};

export default config;
