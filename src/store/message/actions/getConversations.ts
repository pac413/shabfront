import { ConversationsDocument, type IConversationsQuery } from '@/composables/graphql/generated'
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

export const getConversations: Action = async ({ commit, state }, params) => {
  const reset = params && params.reset
  const offset = reset ? 0 : state.originalConversations.length
  const searchString = state.conversationsSearch.trim()

  commit('SET_CONVERSATIONS_LOADING', true)

  let response

  try {
    response = await queryApollo<IConversationsQuery>({
      query: ConversationsDocument,
      fetchPolicy: 'network-only',
      variables: {
        offset,
        limit: CONVERATIONS_LIMIT,
        search: searchString,
      },
    })
  } finally {
    commit('SET_CONVERSATIONS_LOADING', false)
  }

  // If you get the response for non-matching search-string
  // resist with the current conversations
  if (searchString !== state.conversationsSearch) {
    return {
      conversations: state.originalConversations,
      total: state.conversationsTotal,
    }
  }
  const { conversations, total } = response.data.conversations
  commit('SET_CONVERSATIONS_TOTAL', total)
  if (reset) {
    commit('SET_CONVERSATIONS', [...conversations])
  } else {
    commit('PUSH_CONVERSATIONS', [...conversations])
  }
  return {
    conversations: (conversations || []) as unknown as Conversation[],
    total,
  }
}
