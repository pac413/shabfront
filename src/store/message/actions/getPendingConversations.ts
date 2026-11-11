import { type IPendingConversationsQuery, PendingConversationsDocument } from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { CONVERATIONS_LIMIT, type MessageAction } from '@/store/message/types'
import { type Conversation } from '@/types'

type Params = {
  reset?: boolean
}

type Response = {
  conversations: Conversation[]
  total: number
}

type Action = MessageAction<Params, Response>

export const getPendingConversations: Action = async ({ commit, state }, params) => {
  if (state.pendingConversationsLoading) {
    return {
      conversations: state.pendingConversations,
      total: state.pendingConversationsTotal,
    }
  }
  const reset = params && params.reset
  const offset = reset ? 0 : state.pendingConversations.length

  commit('SET_PENDING_CONVERSATIONS_LOADING', true)

  let response

  try {
    response = await queryApollo<IPendingConversationsQuery>({
      query: PendingConversationsDocument,
      fetchPolicy: 'network-only',
      variables: {
        offset,
        limit: CONVERATIONS_LIMIT,
      },
    })
  } finally {
    commit('SET_PENDING_CONVERSATIONS_LOADING', false)
  }

  const { conversations, total } = response.data.pendingConversations
  commit('SET_PENDING_CONVERSATIONS_TOTAL', total)
  if (reset) {
    commit('SET_PENDING_CONVERSATIONS', conversations)
  } else {
    commit('PUSH_PENDING_CONVERSATIONS', conversations)
  }
  return {
    conversations: (conversations || []) as unknown as Conversation[],
    total,
  }
}
