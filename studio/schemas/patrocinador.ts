// studio/schemas/patrocinador.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'patrocinador',
  title: 'Patrocinador',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      description: 'Ex: Automotivo, Tecnologia, Financeiro, etc.',
      options: {
        list: [
          {title: 'Automotivo', value: 'automotivo'},
          {title: 'Tecnologia', value: 'tecnologia'},
          {title: 'Financeiro', value: 'financeiro'},
          {title: 'Saúde', value: 'saude'},
          {title: 'Moda', value: 'moda'},
          {title: 'Benefícios & Pagamentos', value: 'beneficios-pagamentos'},
          {title: 'Gestão Automotiva', value: 'gestao-automotiva'},
          {title: 'Veículos Premium', value: 'veiculos-premium'},
          {title: 'Moda Sustentável', value: 'moda-sustentavel'},
          {title: 'Farmacêutica', value: 'farmaceutica'},
          {title: 'Instituição Financeira', value: 'instituicao-financeira'},
          {title: 'Energia', value: 'energia'},
          {title: 'Outro', value: 'outro'},
        ],
      },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          description: 'Importante para acessibilidade e SEO.',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagemDeFundo',
      title: 'Imagem de Fundo',
      type: 'image',
      description: 'Imagem que aparecerá no fundo do card do patrocinador',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          description: 'Importante para acessibilidade e SEO.',
        },
      ],
    }),
    defineField({
      name: 'descricaoCurta',
      title: 'Descrição Curta',
      type: 'text',
      description: 'Descrição que aparece no card (máximo 150 caracteres)',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'descricaoCompleta',
      title: 'Descrição Completa',
      type: 'text',
      description: 'Descrição detalhada que aparece no modal',
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: 'link',
      title: 'Link do Site',
      type: 'url',
      description: 'URL do site oficial do patrocinador',
    }),
    defineField({
      name: 'corGradiente',
      title: 'Cor do Gradiente',
      type: 'string',
      description: 'Classes Tailwind para o gradiente (ex: from-blue-600 to-blue-800)',
      options: {
        list: [
          {title: 'Azul', value: 'from-blue-600 to-blue-800'},
          {title: 'Laranja para Vermelho', value: 'from-orange-600 to-red-600'},
          {title: 'Roxo para Rosa', value: 'from-purple-600 to-pink-600'},
          {title: 'Verde para Teal', value: 'from-green-600 to-teal-600'},
          {title: 'Amarelo para Laranja', value: 'from-yellow-600 to-orange-600'},
          {title: 'Índigo para Roxo', value: 'from-indigo-600 to-purple-600'},
          {title: 'Vermelho para Rosa', value: 'from-red-600 to-pink-600'},
          {title: 'Cinza', value: 'from-gray-700 to-gray-900'},
        ],
      },
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem em que o patrocinador aparece na página (menor número = primeiro)',
    }),
    defineField({
      name: 'ativo',
      title: 'Ativo',
      type: 'boolean',
      description: 'Se o patrocinador deve aparecer no site',
      initialValue: true,
    }),
    defineField({
      name: 'dataInicio',
      title: 'Data de Início da Parceria',
      type: 'date',
    }),
    defineField({
      name: 'dataFim',
      title: 'Data de Fim da Parceria',
      type: 'date',
      description: 'Deixe em branco se a parceria ainda está ativa',
    }),
  ],
  preview: {
    select: {
      title: 'nome',
      subtitle: 'categoria',
      media: 'logo',
    },
  },
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'ordemAsc',
      by: [
        {field: 'ordem', direction: 'asc'},
        {field: 'nome', direction: 'asc'},
      ],
    },
    {
      title: 'Nome A-Z',
      name: 'nomeAsc',
      by: [{field: 'nome', direction: 'asc'}],
    },
    {
      title: 'Data de Criação',
      name: 'criadoEm',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
