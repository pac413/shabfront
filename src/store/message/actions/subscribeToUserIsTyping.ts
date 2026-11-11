import { cloneDeep } from 'lodash'
import type ZenObservable from 'zen-observable'

import { type ISubscribeToUserIsTypingSubscription, SubscribeToUserIsTypingDocument } from '@/composables/graphql/generated'
import { apolloClient } from '@/plugins/vue-apollo'
import { type MessageAction } from '@/store/message/types'
import { type MediaType } from '@/types'

type Action = MessageAction<{}, ZenObservable.Subscription>

export const subscribeToUserIsTyping: Action = async ({ commit, state }) => {
  const observer = await apolloClient.subscribe<ISubscribeToUserIsTypingSubscription>({
    query: SubscribeToUserIsTypingDocument,
    fetchPolicy: 'network-only',
  })
  const subscription = observer.subscribe({
    next(response: any) {
      const payload: {
        conversationId: string
        mediaType?: MediaType
        profileId: string
      } = cloneDeep(response.data.subscribeToUserIsTyping)
      const { conversationId } = payload
      if (!state.originalConversations.map((c) => c.id).includes(conversationId)) {
        return
      }
      commit('PUSH_TYPING_SESSION', { ...payload, updatedAt: new Date().getTime() })
    },
    error(err: any) {
      console.error(err)
    },
  })

  return subscription
}
