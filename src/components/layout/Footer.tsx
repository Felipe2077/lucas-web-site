// src/components/layout/Footer.tsx

// Definição do tipo para os links sociais, se quiser tipar explicitamente
interface SocialLink {
  name: string;
  href: string;
  icon: JSX.Element; // Agora o ícone será um elemento JSX (SVG)
}

// --- ÍCONES SVG COMO COMPONENTES REUTILIZÁVEIS (ou coloque em arquivos separados) ---
const InstagramIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='feather feather-instagram'
  >
    <rect x='2' y='2' width='20' height='20' rx='5' ry='5'></rect>
    <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path>
    <line x1='17.5' y1='6.5' x2='17.51' y2='6.5'></line>
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='feather feather-facebook'
  >
    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
  </svg>
);

const TwitterIcon = () => (
  // Ícone para X (antigo Twitter)
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor' /* Alterado para fill */
  >
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);
// --- FIM DOS ÍCONES SVG ---

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    // Tipado com a interface
    {
      name: 'Instagram',
      href: 'https://instagram.com/lucasforesti', // << SUBSTITUA PELO LINK REAL
      icon: <InstagramIcon />,
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/lucasforesti', // << SUBSTITUA PELO LINK REAL
      icon: <FacebookIcon />,
    },
    {
      name: 'X (Twitter)',
      href: 'https://twitter.com/lucasforesti', // << SUBSTITUA PELO LINK REAL
      icon: <TwitterIcon />,
    },
    // Adicione mais redes se necessário
  ];

  return (
    // Usando neutral-900 para um tom um pouco mais escuro que o header (neutral-800) ou pode ser o mesmo
    <footer className='bg-neutral-900 text-neutral-300 py-8 md:py-10 border-t border-neutral-700'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='text-sm mb-4 md:mb-0'>
            <p>
              &copy; {currentYear} Lucas Foresti. Todos os direitos reservados.
            </p>
            {/* Opcional: <p className="mt-1">Design por SeuNome/Empresa</p> */}
          </div>

          <div className='flex space-x-5'>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer sponsored' // sponsored para links de patrocinadores, noopener noreferrer para segurança
                className='text-neutral-300 hover:text-piloto-azul-light transition-colors duration-200'
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
