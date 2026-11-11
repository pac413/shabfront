import { ApproveConversationDocument, type IApproveConversationMutation } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'
import { type Conversation } from '@/types'

type Params = string

type Action = MessageAction<Params, Conversation | null>

export const approveConversation: Action = async ({ commit }, conversationId) => {
  const response = await mutateApollo<IApproveConversationMutation>({
    mutation: ApproveConversationDocument,
    variables: { conversationId: conversationId },
  })
  const newConversation = response.data?.approveConversation
  if (!newConversation) {
    return null
  }
  commit('APPEND_CONVERSATION', newConversation)
  commit('REMOVE_MESSAGE_REQUEST', conversationId)
  return newConversation as unknown as Conversation
}
