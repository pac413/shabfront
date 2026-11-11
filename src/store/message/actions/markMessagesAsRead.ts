import { type IReadMessagesMutation, ReadMessagesDocument } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'
import { type Message } from '@/types'

type Action = MessageAction<void, Message[]>

export const markMessagesAsRead: Action = async ({ commit, state }) => {
  if (!state.currentConversation) {
    return []
  }
  const response = await mutateApollo<IReadMessagesMutation>({
    mutation: ReadMessagesDocument,
    variables: { conversationId: state.currentConversation.id },
  })
  const updatedMessages = response.data?.readMessages.messages
  commit('UPDATE_MESSAGE_STATUSES', updatedMessages)
  return (updatedMessages || []) as unknown as Message[]
}
