import {
  CreateConversationDocument,
  type IConversationFragmentFragment,
  type ICreateConversationMutation,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'

type Params = string[]

type Action = MessageAction<Params, IConversationFragmentFragment | undefined>

export const createConversation: Action = async ({ commit }, participantIds) => {
  const response = await mutateApollo<ICreateConversationMutation>({
    mutation: CreateConversationDocument,
    variables: { participants: participantIds },
  })
  const newConversation = response.data?.createConversation
  commit('APPEND_CONVERSATION', newConversation)

  return newConversation
}
