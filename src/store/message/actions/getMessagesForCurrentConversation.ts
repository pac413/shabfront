import { type IMessagesQuery, MessagesDocument } from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type MessageAction, MESSAGES_LIMIT } from '@/store/message/types'
import { type Message } from '@/types'

type Params = { reset?: boolean }

type Response = {
  messages: Message[]
  total: number
}

type Action = MessageAction<Params, Response>

export const getMessagesForCurrentConversation: Action = async ({ commit, state }, params) => {
  if (
    !state.currentConversation || // Check if the current conversation exists
    state.messagesLoading // Check if the messages are being loaded
  ) {
    return {
      messages: state.messages,
      total: state.messagesTotal,
    }
  }
  const reset = params && params.reset
  const offset = reset ? 0 : state.messages.length

  const conversationId = state.currentConversation.id
  commit('SET_MESSAGES_LOADING', true)

  let response
  try {
    response = await queryApollo<IMessagesQuery>({
      query: MessagesDocument,
      fetchPolicy: 'network-only',
      variables: {
        conversationId,
        limit: MESSAGES_LIMIT,
        offset,
      },
    })
  } finally {
    commit('SET_MESSAGES_LOADING', false)
  }

  const { messages, total } = response.data.messages
  commit('SET_MESSAGES_TOTAL', total)

  if (reset) {
    commit('SET_MESSAGES', messages)
  } else {
    commit('PUSH_MESSAGES', messages)
  }
  return { total, messages: (messages || []) as unknown as Message[] }
}
