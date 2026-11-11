import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import {
  type ISubscribeToConversationsSubscription,
  SubscribeToConversationsDocument,
} from '@/composables/graphql/generated'
import { apolloClient } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'
import { type Conversation } from '@/types'
import { checkConversationAvailability } from '@/utils'

type Action = MessageAction<{}, ZenObservable.Subscription>

export const subscribeToConversations: Action = async ({ commit, rootState }) => {
  const observer = await apolloClient.subscribe<ISubscribeToConversationsSubscription>({
    query: SubscribeToConversationsDocument,
  })

  const subscriber = observer.subscribe({
    next(response: any) {
      const incomingConversation = cloneDeep(response.data.subscribeToConversations.conversation as Conversation)

      // Check if conversation is available
      const { activeProfile } = rootState.profile
      if (checkConversationAvailability(incomingConversation, activeProfile!.id)) {
        commit('APPEND_CONVERSATION', incomingConversation)
      } else {
        // remove the conversation from store
        commit('REMOVE_CONVERSATION', incomingConversation.id)
      }
    },
    error(err: any) {
      console.error(err)
    },
  })
  return subscriber
}
