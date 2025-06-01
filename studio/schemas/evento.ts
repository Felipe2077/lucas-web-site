// studio/schemas/evento.ts
import {CalendarIcon} from '@sanity/icons' // Ícone opcional
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'evento',
  title: 'Evento (Corrida)',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'nomeDoEvento',
      title: 'Nome do Evento/Etapa',
      type: 'string',
      description: 'Ex: Etapa de Interlagos, Corrida do Milhão',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cidade',
      title: 'Cidade (Opcional)',
      type: 'string',
      description: 'Ex: São Paulo, Goiânia',
    }),
    defineField({
      name: 'dataDoEvento',
      title: 'Data do Evento',
      type: 'datetime', // Usar datetime para incluir horário se necessário, ou 'date' para apenas data
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'circuito',
      title: 'Circuito/Local',
      type: 'string',
      description: 'Ex: Autódromo de Interlagos, São Paulo',
    }),
    defineField({
      name: 'status',
      title: 'Status do Evento',
      type: 'string',
      options: {
        list: [
          {title: 'Agendado', value: 'agendado'},
          {title: 'Realizado', value: 'realizado'},
          {title: 'Cancelado', value: 'cancelado'},
          {title: 'Adiado', value: 'adiado'},
        ],
        layout: 'radio', // ou 'dropdown'
      },
      initialValue: 'agendado',
      validation: (Rule) => Rule.required(),
    }),
    // Campos de resultado, visíveis condicionalmente se o status for 'realizado'
    defineField({
      name: 'resultado',
      title: 'Resultado da Corrida',
      type: 'object',
      fields: [
        defineField({
          name: 'posicaoLargada',
          title: 'Posição de Largada (Opcional)',
          type: 'number',
        }),
        defineField({
          name: 'posicaoFinal',
          title: 'Posição Final',
          type: 'string', // Usar string para permitir "DNF", "DSQ", etc. ou números
        }),
        defineField({
          name: 'pontos',
          title: 'Pontos Conquistados (Opcional)',
          type: 'number',
        }),
        defineField({
          name: 'observacoes',
          title: 'Observações sobre a Corrida (Opcional)',
          type: 'text',
          rows: 3,
        }),
      ],
      hidden: ({document}) => document?.status !== 'realizado', // Esconde se não for 'realizado'
    }),
    defineField({
      name: 'linkParaMateria',
      title: 'Link para Matéria/Notícia Relacionada (Opcional)',
      type: 'url',
      description: 'Link para uma notícia no próprio site ou externa sobre este evento.',
    }),
    // Poderia ter um campo de "Tipo de Corrida" (ex: Principal, Classificatória) se necessário
  ],
  orderings: [
    {
      title: 'Data do Evento, Mais Recente Primeiro',
      name: 'dataDesc',
      by: [{field: 'dataDoEvento', direction: 'desc'}],
    },
    {
      title: 'Data do Evento, Mais Antigo Primeiro',
      name: 'dataAsc',
      by: [{field: 'dataDoEvento', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'nomeDoEvento',
      subtitle: 'dataDoEvento',
      status: 'status',
      posicao: 'resultado.posicaoFinal',
    },
    prepare({title, subtitle, status, posicao}) {
      const dataFormatada = subtitle ? new Date(subtitle).toLocaleDateString('pt-BR') : ''
      let displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : ''
      if (status === 'realizado' && posicao) {
        displayStatus += ` - P${posicao}`
      }
      return {
        title: title,
        subtitle: `${dataFormatada} - ${displayStatus}`,
      }
    },
  },
})
