// src/pages/ContatoPage.tsx
// 'use client'; // Não estritamente necessário para hooks no Vite

import { useEffect, useState } from 'react';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
// import { groq } from 'next-sanity'; // Usaremos strings simples
import {
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'; // Ícones
import { Helmet } from 'react-helmet-async';

// Interface para os dados de Contato (pode vir de @/types/sanity)
interface ConfiguracoesContatoData {
  _id: string; // Mesmo que seja singleton, ele tem um _id
  emailPrincipal?: string;
  telefonePrincipal?: string;
  nomeContatoImprensa?: string;
  emailImprensa?: string;
}

const contatoQuery = `*[_type == "configuracoesContato"][0]{
  _id,
  emailPrincipal,
  telefonePrincipal,
  nomeContatoImprensa,
  emailImprensa
}`;

export default function ContatoPage() {
  const [contatoInfo, setContatoInfo] = useState<
    ConfiguracoesContatoData | null | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const nomeDoPiloto = 'Lucas Foresti'; // Substitua ou busque dinamicamente

  useEffect(() => {
    const client = getClient();
    const fetchContatoInfo = async () => {
      setLoading(true);
      try {
        const data: ConfiguracoesContatoData | null = await client.fetch(
          contatoQuery
        );
        setContatoInfo(data);
      } catch (error) {
        console.error('Erro ao buscar informações de contato:', error);
        setContatoInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContatoInfo();
  }, []); // Roda uma vez na montagem

  return (
    <>
      <Helmet>
        <title>{`Contato - ${nomeDoPiloto}`}</title>
        <meta
          name='description'
          content={`Entre em contato com a equipe do piloto ${nomeDoPiloto}.`}
        />
      </Helmet>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16'>
          Entre em Contato
        </h1>

        {loading ? (
          <p className='text-center animate-pulse'>
            Carregando informações de contato...
          </p>
        ) : contatoInfo ? (
          <div className='max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl space-y-6'>
            {contatoInfo.emailPrincipal && (
              <div className='flex items-start space-x-3'>
                <EnvelopeIcon className='h-6 w-6 text-piloto-blue dark:text-piloto-blue-light mt-1 flex-shrink-0' />
                <div>
                  <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                    E-mail Principal
                  </h2>
                  <a
                    href={`mailto:${contatoInfo.emailPrincipal}`}
                    className='text-piloto-blue hover:underline dark:text-piloto-blue-light break-all'
                  >
                    {contatoInfo.emailPrincipal}
                  </a>
                </div>
              </div>
            )}

            {contatoInfo.telefonePrincipal && (
              <div className='flex items-start space-x-3'>
                <PhoneIcon className='h-6 w-6 text-piloto-blue dark:text-piloto-blue-light mt-1 flex-shrink-0' />
                <div>
                  <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                    Telefone
                  </h2>
                  <a
                    href={`tel:${contatoInfo.telefonePrincipal.replace(
                      /\s+/g,
                      ''
                    )}`}
                    className='text-gray-700 dark:text-gray-300 hover:text-piloto-blue dark:hover:text-piloto-blue-light'
                  >
                    {contatoInfo.telefonePrincipal}
                  </a>
                </div>
              </div>
            )}

            {(contatoInfo.nomeContatoImprensa || contatoInfo.emailImprensa) && (
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-heading font-semibold text-gray-800 dark:text-gray-100 mb-3'>
                  Imprensa
                </h2>
                {contatoInfo.nomeContatoImprensa && (
                  <div className='flex items-start space-x-3 mb-3'>
                    <UserCircleIcon className='h-6 w-6 text-piloto-blue dark:text-piloto-blue-light mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                        Contato
                      </h3>
                      <p className='text-gray-700 dark:text-gray-300'>
                        {contatoInfo.nomeContatoImprensa}
                      </p>
                    </div>
                  </div>
                )}
                {contatoInfo.emailImprensa && (
                  <div className='flex items-start space-x-3'>
                    <EnvelopeIcon className='h-6 w-6 text-piloto-blue dark:text-piloto-blue-light mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                        E-mail Imprensa
                      </h3>
                      <a
                        href={`mailto:${contatoInfo.emailImprensa}`}
                        className='text-piloto-blue hover:underline dark:text-piloto-blue-light break-all'
                      >
                        {contatoInfo.emailImprensa}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className='text-center text-gray-600 dark:text-gray-400'>
            Informações de contato não disponíveis no momento.
          </p>
        )}
      </div>
    </>
  );
}
