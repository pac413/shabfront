import {
  CreateBroadcastConversationDocument,
  type ICreateBroadcastConversationMutation,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'

type Params = {
  participantHandles: string[]
  title: string
}

type Action = MessageAction<Params, void>

export const createBroadcastConversation: Action = async ({ commit }, params) => {
  const response = await mutateApollo<ICreateBroadcastConversationMutation>({
    mutation: CreateBroadcastConversationDocument,
    variables: {
      input: {
        participantHandles: params.participantHandles,
        title: params.title,
      },
    },
  })
  const newConversation = response.data?.createBroadcastConversation
  commit('APPEND_CONVERSATION', newConversation)
}
