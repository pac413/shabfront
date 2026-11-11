import { ConversationDocument, type IConversationQuery } from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'

type Params = string

type Action = MessageAction<Params, void>

export const getConversation: Action = async ({ commit }, conversationId) => {
  const response = await queryApollo<IConversationQuery>({
    query: ConversationDocument,
    fetchPolicy: 'network-only',
    variables: { id: conversationId },
  })
  commit('APPEND_CONVERSATION', response.data.conversation)
}
