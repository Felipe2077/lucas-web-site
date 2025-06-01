// studio/schemas/albumDeFotos.ts
import {ImagesIcon} from '@sanity/icons' // Ícone opcional
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'albumDeFotos',
  title: 'Álbum de Fotos',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título do Álbum',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Amigável)',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dataDoAlbum',
      title: 'Data do Álbum/Evento (Opcional)',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
    defineField({
      name: 'imagemDeCapa',
      title: 'Imagem de Capa do Álbum',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição do Álbum (Opcional)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos do Álbum',
      type: 'array',
      of: [
        defineField({
          name: 'fotoComLegenda', // Um nome para este tipo de objeto dentro do array
          title: 'Foto com Legenda',
          type: 'image', // Usamos o tipo 'image' diretamente
          options: {
            hotspot: true, // Permite ajuste de foco para cada imagem
          },
          fields: [
            // Adicionamos campos customizados ao tipo 'image' aqui
            defineField({
              name: 'legenda',
              title: 'Legenda (Opcional)',
              type: 'string',
            }),
            // Você poderia adicionar um campo 'alt' aqui também se quisesse que fosse diferente do 'alt' padrão da imagem
            // defineField({
            //   name: 'alt',
            //   title: 'Texto Alternativo (Opcional)',
            //   type: 'string',
            //   options: {
            //     isHighlighted: true,
            //   },
            // }),
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1).error('O álbum deve ter pelo menos uma foto.'),
    }),
  ],
  orderings: [
    {
      title: 'Data do Álbum, Mais Recente Primeiro',
      name: 'dataDesc',
      by: [{field: 'dataDoAlbum', direction: 'desc'}],
    },
    {
      title: 'Título, Ascendente',
      name: 'tituloAsc',
      by: [{field: 'titulo', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'dataDoAlbum',
      media: 'imagemDeCapa',
    },
    prepare({title, subtitle, media}) {
      const dataFormatada = subtitle
        ? new Date(subtitle).toLocaleDateString('pt-BR', {timeZone: 'UTC'})
        : '' // Adicionado timeZone: 'UTC' para evitar off-by-one
      return {
        title: title,
        subtitle: dataFormatada,
        media: media,
      }
    },
  },
})
