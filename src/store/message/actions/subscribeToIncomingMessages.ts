import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { type ISubscribeToMessagesSubscription, SubscribeToMessagesDocument } from '@/composables/graphql/generated'
import { apolloClient } from '@/plugins/vue-apollo'
import { type MessageAction, type UnreadMessageBreakpoint } from '@/store/message/types'
import { type Message } from '@/types'

type Action = MessageAction<string, ZenObservable.Subscription>

export const subscribeToIncomingMessages: Action = async ({ commit, rootState, state }, conversationId) => {
  const observer = await apolloClient.subscribe<ISubscribeToMessagesSubscription>({
    query: SubscribeToMessagesDocument,
    fetchPolicy: 'network-only',
    variables: { conversationId },
  })
  const subscription = observer.subscribe({
    next(response: any) {
      const incomingMessage = cloneDeep(response.data.subscribeToMessages.message as Message)

      // If I receive subscriptions for my message, scroll to the bottom.
      if (
        incomingMessage.sender.id !== rootState.auth.profileId &&
        !state.messages.map((m) => m.id).includes(incomingMessage.id)
      ) {
        if (!state.unreadMessageBreakpoint) {
          const unreadMessageBreakpoint: UnreadMessageBreakpoint = {
            messageId: incomingMessage.id,
            arrivedAt: incomingMessage.date,
          }
          commit('SET_UNREAD_MESSAGE_BREAKPOINT', unreadMessageBreakpoint)
        }
      }

      commit('PUSH_MESSAGE', incomingMessage)
    },
    error(err: any) {
      console.error(err)
    },
  })

  return subscription
}
