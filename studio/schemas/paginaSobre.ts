// studio/schemas/paginaSobre.ts
import {UsersIcon} from '@sanity/icons' // Ícone opcional para o Studio
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'paginaSobre',
  title: 'Página Sobre o Piloto',
  type: 'document',
  icon: UsersIcon, // Ícone opcional
  // Configuração para fazer deste um Documento Singleton (só pode haver um)
  // Não é estritamente um singleton pela config abaixo, mas limitaremos a criação de apenas um no structure builder
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título da Página',
      type: 'string',
      initialValue: 'Sobre [Nome do Piloto]', // Defina um valor inicial
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagemPrincipal',
      title: 'Imagem Principal do Piloto',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'biografia',
      title: 'Biografia / Conteúdo Principal',
      type: 'array', // Portable Text para conteúdo rico
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Título H2', value: 'h2'},
            {title: 'Título H3', value: 'h3'},
          ],
          lists: [
            {title: 'Lista Numerada', value: 'number'},
            {title: 'Lista com Marcadores', value: 'bullet'},
          ],
          marks: {
            decorators: [
              {title: 'Negrito', value: 'strong'},
              {title: 'Itálico', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
        },
        {
          type: 'image', // Permitir imagens dentro da biografia
          options: {hotspot: true},
        },
      ],
    }),
    // Opcional: Seção de Conquistas
    defineField({
      name: 'conquistas',
      title: 'Principais Conquistas (Opcional)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'ano', title: 'Ano', type: 'string'},
            {name: 'descricao', title: 'Descrição da Conquista', type: 'string'},
          ],
          preview: {
            select: {
              title: 'descricao',
              subtitle: 'ano',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'imagemPrincipal',
    },
  },
})
