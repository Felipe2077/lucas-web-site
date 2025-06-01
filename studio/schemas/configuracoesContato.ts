// studio/schemas/configuracoesContato.ts
import {EnvelopeIcon} from '@sanity/icons' // Ícone opcional
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'configuracoesContato',
  title: 'Configurações de Contato',
  type: 'document',
  icon: EnvelopeIcon,
  // Para fazer deste um Documento Singleton (só pode haver um)
  // Limitaremos a criação de apenas um no structure builder
  fields: [
    defineField({
      name: 'emailPrincipal',
      title: 'E-mail Principal de Contato',
      type: 'email',
    }),
    defineField({
      name: 'telefonePrincipal',
      title: 'Telefone Principal de Contato (Opcional)',
      type: 'string',
    }),
    defineField({
      name: 'nomeContatoImprensa',
      title: 'Nome do Contato de Imprensa (Opcional)',
      type: 'string',
    }),
    defineField({
      name: 'emailImprensa',
      title: 'E-mail de Contato para Imprensa (Opcional)',
      type: 'email',
    }),
    // Adicione outros campos se necessário, como endereço físico, etc.
  ],
  preview: {
    prepare() {
      return {
        title: 'Configurações de Contato',
      }
    },
  },
})
