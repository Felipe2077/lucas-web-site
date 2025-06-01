// studio/schemas/noticia.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'noticia',
  title: 'Notícia',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título da Notícia',
      type: 'string',
      validation: (Rule) => Rule.required().error('O título é obrigatório.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Amigável)',
      type: 'slug',
      options: {
        source: 'titulo', // Gera o slug a partir do campo 'titulo'
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('O slug é obrigatório.'),
    }),
    defineField({
      name: 'dataDePublicacao',
      title: 'Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(), // Define a data atual como valor inicial
      validation: (Rule) => Rule.required().error('A data de publicação é obrigatória.'),
    }),
    defineField({
      name: 'imagemDeCapa',
      title: 'Imagem de Capa',
      type: 'image',
      options: {
        hotspot: true, // Permite selecionar o ponto focal da imagem
      },
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo (Chamada Curta)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'conteudo',
      title: 'Conteúdo Completo',
      type: 'array', // Para Rich Text
      of: [
        {
          type: 'block', // Tipo padrão para parágrafos e cabeçalhos
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Título H2', value: 'h2'},
            {title: 'Título H3', value: 'h3'},
            {title: 'Título H4', value: 'h4'},
            {title: 'Citação', value: 'blockquote'},
          ],
          lists: [
            {title: 'Lista Numerada', value: 'number'},
            {title: 'Lista com Marcadores', value: 'bullet'},
          ],
          marks: {
            // Permite negrito, itálico, etc.
            decorators: [
              {title: 'Negrito', value: 'strong'},
              {title: 'Itálico', value: 'em'},
              {title: 'Sublinhado', value: 'underline'},
              {title: 'Riscado', value: 'strike-through'},
            ],
            // annotations: [ // Para links, por exemplo
            //   {
            //     name: 'link',
            //     type: 'object',
            //     title: 'Link',
            //     fields: [
            //       {
            //         name: 'href',
            //         type: 'url',
            //         title: 'URL'
            //       }
            //     ]
            //   }
            // ]
          },
        },
        {
          type: 'image', // Permite adicionar imagens dentro do conteúdo
          options: {hotspot: true},
        },
        // Você pode adicionar outros tipos aqui, como vídeos do YouTube, etc.
      ],
    }),
    defineField({
      name: 'categorias', // Alterado para plural para indicar múltiplas categorias
      title: 'Categorias',
      type: 'array',
      of: [{type: 'reference', to: {type: 'categoria'}}], // Referência ao schema 'categoria'
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'dataDePublicacao',
      media: 'imagemDeCapa',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      const dataFormatada = subtitle ? new Date(subtitle).toLocaleDateString('pt-BR') : ''
      return {
        title: title,
        subtitle: dataFormatada,
        media: media,
      }
    },
  },
})
