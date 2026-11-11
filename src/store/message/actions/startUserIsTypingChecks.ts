import { type MessageAction } from '@/store/message/types'
import { MESSAGE_TYPING_CHECK_INTERVAL, MESSAGE_TYPING_THROTTLE_WAIT } from '@/utils'

type Action = MessageAction<{}, void>

export const startUserIsTypingChecks: Action = ({ commit, state }) => {
  if (state.typingCheckIntervalHandle) {
    window.clearInterval(state.typingCheckIntervalHandle)
  }
  const typingCheckInterval = setInterval(() => {
    const now = new Date().getTime()
    const validTypingSessions = state.typingSessions.filter((ts) => now - ts.updatedAt <= MESSAGE_TYPING_THROTTLE_WAIT)
    commit('SET_VALID_TYPING_SESSION', validTypingSessions)
  }, MESSAGE_TYPING_CHECK_INTERVAL)

  commit('SET_TYPING_CHECK_INTERVAL_HANDLE', typingCheckInterval)
}
