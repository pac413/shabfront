import { type MessageAction } from '@/store/message/types'

type Action = MessageAction<{}, void>

export const stopUserIsTypingChecks: Action = ({ commit, state }) => {
  if (!state.typingCheckIntervalHandle) {
    return
  }
  window.clearInterval(state.typingCheckIntervalHandle)
  commit('SET_TYPING_CHECK_INTERVAL_HANDLE', undefined)
}
