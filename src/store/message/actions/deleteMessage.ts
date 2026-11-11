import { DeleteMessageDocument, type IDeleteMessageMutation } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'
import { type Message } from '@/types'

type Action = MessageAction<Message, boolean>

export const deleteMessage: Action = async ({ commit }, message) => {
  const response = await mutateApollo<IDeleteMessageMutation>({
    mutation: DeleteMessageDocument,
    variables: { messageId: message.id },
  })
  const hasDeleted = !!response.data?.deleteMessage.deleted
  if (hasDeleted) {
    commit('REMOVE_MESSAGE', message)
  }
  return hasDeleted
}
