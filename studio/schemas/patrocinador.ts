// studio/schemas/patrocinador.ts
import {RocketIcon} from '@sanity/icons' // Ícone opcional
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'patrocinador',
  title: 'Patrocinador',
  type: 'document',
  icon: RocketIcon, // Opcional
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Patrocinador',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo do Patrocinador',
      type: 'image',
      options: {
        hotspot: false, // Geralmente logos não precisam de hotspot
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link do Site (Opcional)',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição (Opcional)',
      type: 'number',
      description:
        'Use para definir uma ordem customizada (ex: 1, 2, 3...). Menores números aparecem primeiro.',
    }),
    // Opcional: Nível de Patrocínio
    // defineField({
    //   name: 'nivel',
    //   title: 'Nível de Patrocínio',
    //   type: 'string',
    //   options: {
    //     list: [
    //       {title: 'Principal', value: 'principal'},
    //       {title: 'Ouro', value: 'ouro'},
    //       {title: 'Prata', value: 'prata'},
    //       {title: 'Apoio', value: 'apoio'},
    //     ],
    //     layout: 'radio', // ou 'dropdown'
    //   }
    // })
  ],
  orderings: [
    // Define ordenações padrão no Studio
    {
      title: 'Ordem de Exibição, Ascendente',
      name: 'ordemAsc',
      by: [{field: 'ordem', direction: 'asc'}],
    },
    {
      title: 'Nome, Ascendente',
      name: 'nomeAsc',
      by: [{field: 'nome', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'nome',
      media: 'logo',
    },
  },
})
