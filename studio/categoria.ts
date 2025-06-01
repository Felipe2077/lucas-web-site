// studio/schemas/categoria.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'categoria',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome da Categoria',
      type: 'string',
      validation: (Rule) => Rule.required().error('O nome da categoria é obrigatório.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Amigável)',
      type: 'slug',
      options: {
        source: 'nome', // Gera o slug a partir do campo 'nome'
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('O slug é obrigatório.'),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição (Opcional)',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'nome',
    },
  },
})
