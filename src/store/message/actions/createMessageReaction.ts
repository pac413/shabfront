import {
  CreateMessageReactionDocument,
  type ICreateMessageReactionFailure,
  type ICreateMessageReactionMutation,
  type IMessageReactionFragmentFragment
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'

type Params = {
  conversationId: string
  messageId: string
  reaction: string
  activeProfileId: string
}

type Action = MessageAction<
  Params,
  IMessageReactionFragmentFragment | ICreateMessageReactionFailure | undefined
>

export const createMessageReaction: Action = async (
  { commit },
  { activeProfileId, ...params }
) => {
  const response = await mutateApollo<ICreateMessageReactionMutation>({
    mutation: CreateMessageReactionDocument,
    variables: { input: params }
  })
  const reaction = response.data?.createMessageReaction
  commit('UPDATE_MESSAGE_REACTION', {
    messageId: params.messageId,
    reaction,
    activeProfileId
  })

  return reaction
}
