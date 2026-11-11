import { groupBy } from 'lodash'
import { type GetterTree } from 'vuex'

import moment from '@/plugins/moment'
import { type RootState } from '@/store/types'
import { useGlobalStore } from '@/stores/global'
import { ConversationParticipantStatus, type MessageGroup } from '@/types'
import { getMyConversationStatus, getOpponentConverationStatus, groupedDateDisplay, isConversationMatch } from '@/utils'

import { type MessageState } from './types'

const getters: GetterTree<MessageState, RootState> = {
  conversations(state, getters, rootState) {
    const { originalConversations, conversationsSearch } = state
    const { profileId } = rootState.auth

    if (!profileId) {
      return []
    }
    if (!conversationsSearch) {
      return originalConversations
    }

    return originalConversations.filter((c) => isConversationMatch(c, conversationsSearch, profileId))
  },
  groupedMessages(state) {
    const globalStore = useGlobalStore()
    const { messages } = state
    const messagesWithGroupDate = messages.map((m) => {
      m.groupedDate = groupedDateDisplay(m.date, globalStore.language.locale)
      return m
    })
    const groupedMessagesMap = groupBy(messagesWithGroupDate, 'groupedDate')
    const groupedMessages: MessageGroup[] = []
    Object.keys(groupedMessagesMap)
      .sort((a, b) => moment(groupedMessagesMap[a][0].date).diff(groupedMessagesMap[b][0].date))
      .forEach((group) => {
        groupedMessages.push({
          groupedDate: group,
          messages: groupedMessagesMap[group],
        })
      })
    return groupedMessages
  },
  currentConversationOpponent(state, getters, rootState) {
    const { currentConversation } = state
    if (!currentConversation) {
      return undefined
    }
    return currentConversation.participants.find((p) => p.profile.id !== rootState.auth.profileId)
  },
  currentConversationPending(state, getters, rootState) {
    const { currentConversation } = state
    const { profileId } = rootState.auth
    if (!currentConversation || !profileId) {
      return false
    }
    const status = getMyConversationStatus(currentConversation, profileId)
    return status === ConversationParticipantStatus.PENDING
  },
  currentConversationPendingByOpponent(state, getters, rootState) {
    const { currentConversation } = state
    const { profileId } = rootState.auth
    if (!currentConversation || !profileId) {
      return false
    }
    const opponentStatus = getOpponentConverationStatus(currentConversation, profileId)
    return opponentStatus === ConversationParticipantStatus.PENDING
  },
  currentConversationRejectedByOpponent(state, getters, rootState) {
    const { currentConversation } = state
    const { profileId } = rootState.auth
    if (!currentConversation || !profileId) {
      return false
    }
    const opponentStatus = getOpponentConverationStatus(currentConversation, profileId)
    return opponentStatus === ConversationParticipantStatus.REJECTED
  },
}

export default getters
