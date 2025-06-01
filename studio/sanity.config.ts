import {UsersIcon} from '@sanity/icons'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {StructureResolver, structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import configuracoesContato from './schemas/configuracoesContato'
import {default as paginaSobre, default as paginaSobreSchemaDefinition} from './schemas/paginaSobre'

// Defina o structure builder
export const customStructure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo Principal')
    .items([
      // Item Singleton para a Página Sobre
      S.listItem()
        .title(paginaSobreSchemaDefinition.title || 'Página Sobre')
        .icon(UsersIcon) // Usa o ícone definido no schema
        .child(
          S.document()
            .schemaType(paginaSobre.name)
            .documentId(paginaSobre.name) // ID fixo para o documento singleton
            .title(paginaSobreSchemaDefinition.title || 'Editar Página Sobre'),
        ),
      S.divider(), // Divisor antes de itens de configuração
      S.listItem()
        .title(configuracoesContato.title || 'Configurações de Contato')
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType(configuracoesContato.name)
            .documentId(configuracoesContato.name) // ID fixo para o documento singleton
            .title(configuracoesContato.title || 'Editar Configurações de Contato'),
        ),
      S.divider(),
      // Outros tipos de documento listáveis (como Notícias e Categorias)
      S.documentTypeListItem('noticia').title('Notícias'),
      S.documentTypeListItem('categoria').title('Categorias'),
      S.documentTypeListItem('patrocinador').title('Patrocinadores'),
      S.documentTypeListItem('evento').title('Calendário/Resultados'),
      S.documentTypeListItem('albumDeFotos').title('Álbuns de Fotos'),

      // Adicione outros tipos de documento aqui
    ])

export default defineConfig({
  name: 'default',
  title: 'Lucas Stockcar Website CMS',

  projectId: '5w3msavv',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
