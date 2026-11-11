import { type IUserIsTypingMutation, UserIsTypingDocument } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageErrorAction } from '@/store/message/types'
import { type MediaType } from '@/types'

type Params = MediaType | null

type Action = MessageErrorAction<Params, boolean>

export const sendUserIsTyping: Action = async ({ state }, mediaTypeIsTyping = null) => {
  const { currentConversation } = state
  if (!currentConversation) {
    throw new Error('Cannot send message without current conversation')
  }

  try {
    await mutateApollo<IUserIsTypingMutation>({
      mutation: UserIsTypingDocument,
      variables: {
        conversationId: currentConversation.id,
        mediaType: mediaTypeIsTyping,
      },
    })
  } catch (error: any) {
    return { error }
  }
  return { data: true }
}
