import { CreateMessageDocument, type ICreateMessageMutation } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'
import { type Message } from '@/types'

type Params = {
  conversationId: string
  text: string
  attachmentsIds?: string[]
}

type Action = MessageAction<Params, Message>

export const sendMessage: Action = async ({ commit }, params) => {
  const response = await mutateApollo<ICreateMessageMutation>({
    mutation: CreateMessageDocument,
    variables: { ...params, type: 'TEXT' },
  })
  const newMessage = response.data?.createMessage.message as unknown as Message
  commit('PUSH_MESSAGE', newMessage)
  return newMessage
}
