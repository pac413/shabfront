import { type MessageState } from './types'

export const getInitialState: () => MessageState = () => ({
  originalConversations: [],
  pendingConversations: [],
  conversationsSearch: '',
  conversationsTotal: 0,
  conversationsLoading: false,
  pendingConversationsTotal: 0,
  pendingConversationsLoading: false,
  currentConversation: null,
  messages: [],
  messagesTotal: 0,
  messagesLoading: false,
  scrollToBottom: false,
  typingSessions: [],
  typingCheckIntervalHandle: undefined,

  unreadMessageBreakpoint: null,
})

const state: MessageState = getInitialState()

export default state
