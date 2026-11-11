import { type IRejectConversationMutation, RejectConversationDocument } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'

type Params = string

type Action = MessageAction<Params, void>

export const rejectConversation: Action = async ({ commit }, conversationId) => {
  await mutateApollo<IRejectConversationMutation>({
    mutation: RejectConversationDocument,
    variables: { conversationId: conversationId },
  })
  commit('REMOVE_CONVERSATION', conversationId)
  commit('REMOVE_MESSAGE_REQUEST', conversationId)
}
