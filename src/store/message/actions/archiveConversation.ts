import { ArchiveConversationDocument, type IArchiveConversationMutation } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'

type Params = string

type Action = MessageAction<Params, void>

export const archiveConversation: Action = async ({ commit }, conversationId) => {
  const response = await mutateApollo<IArchiveConversationMutation>({
    mutation: ArchiveConversationDocument,
    variables: { conversationId },
  })
  const archivedId = response.data?.archiveConversation.archived
  if (archivedId && archivedId === conversationId) {
    commit('REMOVE_CONVERSATION', conversationId)
  }
}
