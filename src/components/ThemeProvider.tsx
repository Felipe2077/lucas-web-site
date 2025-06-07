// src/components/ThemeProvider.tsx
import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Força o tema escuro no documento
    document.documentElement.classList.add('dark');

    // Remove qualquer classe de tema claro que possa existir
    document.documentElement.classList.remove('light');

    // Define atributo data-theme para garantir compatibilidade
    document.documentElement.setAttribute('data-theme', 'dark');

    // Override das CSS custom properties para forçar tema escuro
    document.documentElement.style.setProperty('--background', '#0a0a0a');
    document.documentElement.style.setProperty('--foreground', '#ededed');

    // Previne que o usuário mude o tema através de preferências do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Sempre mantenha escuro, independente da preferência do sistema
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return <>{children}</>;
}
