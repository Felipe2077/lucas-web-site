// src/pages/CalendarioPage.tsx
// 'use client'; // Não estritamente necessário para hooks no Vite

import { useEffect, useState } from 'react';
import { getClient } from '../lib/sanity.client'; // Ajuste o caminho
// import { groq } from 'next-sanity'; // Usaremos strings simples
import { Helmet } from 'react-helmet-async';

// Interfaces (podem vir de @/types/sanity ou definidas aqui)
interface Resultado {
  posicaoLargada?: number;
  posicaoFinal?: string;
  pontos?: number;
  observacoes?: string;
}

interface Evento {
  _id: string;
  nomeDoEvento: string;
  dataDoEvento: string;
  circuito?: string;
  status: 'agendado' | 'realizado' | 'cancelado' | 'adiado';
  resultado?: Resultado;
  linkParaMateria?: string;
}

const eventosQuery = `*[_type == "evento"]{
  _id,
  nomeDoEvento,
  dataDoEvento,
  circuito,
  status,
  resultado,
  linkParaMateria
} | order(dataDoEvento desc)`; // Mais recentes primeiro no geral

// Funções de formatação de data (como antes)
const formatarData = (dataISO: string) => {
  try {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch (e) {
    return 'Data inválida';
  }
};

const formatarHora = (dataISO: string) => {
  try {
    if (dataISO && dataISO.includes('T')) {
      const dateObj = new Date(dataISO);
      if (
        dateObj.getUTCHours() === 0 &&
        dateObj.getUTCMinutes() === 0 &&
        dateObj.getUTCSeconds() === 0
      ) {
        return '';
      }
      return dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      });
    }
    return '';
  } catch (e) {
    return '';
  }
};

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const nomeDoPiloto = 'Lucas Foresti'; // Substitua ou busque dinamicamente

  useEffect(() => {
    const client = getClient();
    const fetchEventos = async () => {
      setLoading(true);
      try {
        const data: Evento[] = await client.fetch(eventosQuery);
        setEventos(data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []); // Roda uma vez na montagem

  const hojeISO = new Date().toISOString(); // Data e hora atuais em ISO string para comparação precisa
  const hojeApenasData = hojeISO.split('T')[0];

  const eventosFuturos = eventos
    .filter((e) => {
      const dataEvento = new Date(e.dataDoEvento);
      // Compara o timestamp completo para eventos futuros
      return (
        (e.status === 'agendado' || e.status === 'adiado') &&
        dataEvento.toISOString() >= hojeISO
      );
    })
    .sort(
      (a, b) =>
        new Date(a.dataDoEvento).getTime() - new Date(b.dataDoEvento).getTime()
    );

  const eventosPassados = eventos.filter((e) => {
    const dataEvento = new Date(e.dataDoEvento);
    // Compara o timestamp completo para eventos passados
    return (
      e.status === 'realizado' ||
      e.status === 'cancelado' ||
      dataEvento.toISOString() < hojeISO
    );
  });
  // eventosPassados já estarão em ordem descendente pela query principal

  return (
    <>
      <Helmet>
        <title>{`Calendário e Resultados - ${nomeDoPiloto}`}</title>
        <meta
          name='description'
          content={`Acompanhe o calendário de corridas e os resultados do piloto ${nomeDoPiloto}.`}
        />
      </Helmet>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <h1 className='font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16'>
          Calendário e Resultados
        </h1>

        {/* Eventos Futuros (Calendário) */}
        <section className='mb-12 md:mb-16'>
          <h2 className='font-heading text-2xl md:text-3xl font-semibold mb-6 border-b-2 border-piloto-blue dark:border-piloto-blue-light pb-2 text-gray-800 dark:text-gray-100'>
            Próximas Corridas
          </h2>
          {loading && eventosFuturos.length === 0 ? (
            <p className='text-center animate-pulse'>
              Carregando próximas corridas...
            </p>
          ) : eventosFuturos.length > 0 ? (
            <div className='space-y-6'>
              {eventosFuturos.map((evento) => {
                const horaFormatada = formatarHora(evento.dataDoEvento);
                return (
                  <div
                    key={evento._id}
                    className='p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'
                  >
                    <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-2'>
                      <h3 className='text-xl font-semibold text-piloto-blue dark:text-piloto-blue-light mb-1 sm:mb-0'>
                        {evento.nomeDoEvento}
                      </h3>
                      <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {formatarData(evento.dataDoEvento)}
                        {horaFormatada && ` - ${horaFormatada}`}
                      </p>
                    </div>
                    {evento.circuito && (
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                        Local: {evento.circuito}
                      </p>
                    )}
                    <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
                      Status: {evento.status}
                    </p>
                    {evento.linkParaMateria && (
                      <a
                        href={evento.linkParaMateria}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-accent-orange hover:underline mt-2 inline-block'
                      >
                        Mais informações &rarr;
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            !loading && (
              <p className='text-gray-600 dark:text-gray-400'>
                Nenhuma corrida agendada no momento.
              </p>
            )
          )}
        </section>

        {/* Resultados Passados */}
        <section>
          <h2 className='font-heading text-2xl md:text-3xl font-semibold mb-6 border-b-2 border-gray-300 dark:border-gray-700 pb-2 text-gray-800 dark:text-gray-100'>
            Resultados Anteriores
          </h2>
          {loading && eventosPassados.length === 0 && eventos.length === 0 ? ( // Só mostra loading aqui se não houver futuros também e o fetch inicial estiver ocorrendo
            <p className='text-center animate-pulse'>
              Carregando resultados...
            </p>
          ) : eventosPassados.length > 0 ? (
            <div className='space-y-6'>
              {eventosPassados.map((evento) => (
                <div
                  key={evento._id}
                  className='p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'
                >
                  <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-2'>
                    <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-0'>
                      {evento.nomeDoEvento}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {formatarData(evento.dataDoEvento)}
                    </p>
                  </div>
                  {evento.circuito && (
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                      Local: {evento.circuito}
                    </p>
                  )}
                  {evento.status === 'realizado' && evento.resultado ? (
                    <div className='mt-2 text-sm space-y-1 text-gray-700 dark:text-gray-300'>
                      {evento.resultado.posicaoLargada !== null &&
                        evento.resultado.posicaoLargada !== undefined && (
                          <p>Largada: P{evento.resultado.posicaoLargada}</p>
                        )}
                      {evento.resultado.posicaoFinal && (
                        <p className='font-semibold'>
                          Final: P{evento.resultado.posicaoFinal}
                        </p>
                      )}
                      {evento.resultado.pontos !== undefined && (
                        <p>Pontos: {evento.resultado.pontos}</p>
                      )}
                      {evento.resultado.observacoes && (
                        <p className='italic text-gray-500 dark:text-gray-400'>
                          Obs: {evento.resultado.observacoes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
                      Status: {evento.status}
                    </p>
                  )}
                  {evento.linkParaMateria && (
                    <a
                      href={evento.linkParaMateria}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-accent-orange hover:underline mt-2 inline-block'
                    >
                      Ver matéria &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className='text-gray-600 dark:text-gray-400'>
                Nenhum resultado anterior disponível.
              </p>
            )
          )}
        </section>
      </div>
    </>
  );
}
