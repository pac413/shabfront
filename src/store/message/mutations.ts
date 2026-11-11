import type { MutationTree } from 'vuex'

import moment from '@/plugins/moment'
import type { Conversation, Message, TypingSession } from '@/types'
import { copyAttributes } from '@/utils'

import type {
  MessageReactionPayload,
  MessageState,
  UnreadMessageBreakpoint
} from './types'

const updateLastMessageOfConversation = (
  state: MessageState,
  message: Message
) => {
  // Update the conversations' last message
  const idx = state.originalConversations.findIndex(
    c => c.id === message.conversation!.id
  )
  if (idx < 0) {
    return
  }
  const conversation = state.originalConversations[idx]
  if (conversation.lastMessage) {
    const lastMessageDate = moment(conversation.lastMessage.date)
    const newMessageDate = moment(message.date)
    if (
      conversation.lastMessage.id === message.id ||
      lastMessageDate.isAfter(newMessageDate)
    ) {
      return
    }

    if (lastMessageDate.isSameOrBefore(newMessageDate)) {
      state.originalConversations[idx] = {
        ...state.originalConversations[idx],
        lastMessage: message,
      }
    }
  } else {
    state.originalConversations[idx] = {
      ...state.originalConversations[idx],
      lastMessage: message,
    }
  }
}

const mutations: MutationTree<MessageState> = {
  SET_CONVERSATIONS(state: MessageState, conversations: Conversation[]) {
    state.originalConversations = conversations
  },

  SET_PENDING_CONVERSATIONS(
    state: MessageState,
    conversations: Conversation[]
  ) {
    state.pendingConversations = conversations
  },

  SET_CONVERSATION_SEARCH_STRING(state: MessageState, search: string) {
    state.conversationsSearch = search
  },

  SET_CURRENT_CONVERSATION(state: MessageState, conversation: Conversation) {
    state.currentConversation = conversation
  },

  SET_CONVERSATIONS_LOADING(state: MessageState, loading: boolean) {
    state.conversationsLoading = loading
  },

  SET_PENDING_CONVERSATIONS_LOADING(state: MessageState, loading: boolean) {
    state.pendingConversationsLoading = loading
  },

  SET_CONVERSATIONS_TOTAL(state: MessageState, total: number) {
    state.conversationsTotal = total
  },

  PUSH_CONVERSATIONS(state: MessageState, conversations: Conversation[]) {
    state.originalConversations.push(...conversations)
  },

  SET_PENDING_CONVERSATIONS_TOTAL(state: MessageState, total: number) {
    state.pendingConversationsTotal = total
  },

  PUSH_PENDING_CONVERSATIONS(
    state: MessageState,
    conversations: Conversation[]
  ) {
    state.pendingConversations.push(...conversations)
  },

  APPEND_CONVERSATION(state: MessageState, conversation: Conversation) {
    const idx = state.originalConversations.findIndex(
      c => c.id === conversation.id
    )
    if (idx < 0) {
      state.originalConversations.unshift(conversation)
    } else {
      state.originalConversations.splice(idx, 1, conversation)
    }
    if (
      state.currentConversation &&
      state.currentConversation.id === conversation.id
    ) {
      state.currentConversation = conversation
    }
  },

  SET_MESSAGES(state: MessageState, messages: Message[]) {
    state.messages = messages
  },

  SET_MESSAGES_TOTAL(state: MessageState, total: number) {
    state.messagesTotal = total
  },

  SET_MESSAGES_LOADING(state: MessageState, loading: boolean) {
    state.messagesLoading = loading
  },

  PUSH_MESSAGE(state: MessageState, message: Message) {
    if (
      state.currentConversation &&
      state.currentConversation!.id === message.conversation!.id
    ) {
      const idx = state.messages.findIndex(m => m.id === message.id)
      if (idx > -1) {
        copyAttributes(state.messages[idx], message)
      } else if (!message.attachments || message.attachments.length === 0) {
        state.messages.push(message)
      } else {
        // Check for the attachment ids if matches
        const jdx = state.messages.findIndex(m => {
          if (!m.attachments || m.attachments.length === 0) {
            return false
          }
          const ids = m.attachments.map(m => m.id)
          return message.attachments!.every(a => ids.includes(a.id))
        })

        if (jdx > -1) {
          copyAttributes(state.messages[jdx], message)
        } else {
          state.messages.push(message)
        }
      }
    }
    updateLastMessageOfConversation(state, message)
  },

  PUSH_MESSAGES(state: MessageState, messages: Message[]) {
    state.messages.unshift(...messages)
  },

  REMOVE_MESSAGE(state: MessageState, message: Message) {
    const idx = state.messages.findIndex(m => m.id === message.id)
    if (idx < 0) {
      return
    }
    state.messages.splice(idx, 1)

    if (!state.currentConversation) {
      return
    }
    const jdx = state.originalConversations.findIndex(
      c => c.id === state.currentConversation!.id
    )
    if (jdx < 0) {
      return
    }

    const lastMessage = state.originalConversations[jdx].lastMessage
    if (!lastMessage) {
      return
    }
    if (lastMessage.id === message.id) {
      // TODO: use getter to get the date-sorted last message
      state.originalConversations[jdx].lastMessage =
        state.messages[state.messages.length - 1]
      state.currentConversation.lastMessage =
        state.messages[state.messages.length - 1]
    }
  },

  UPDATE_MESSAGE_STATUSES(state: MessageState, messages: Message[]) {
    const updatedMap = messages.reduce<{ [key in string]: Message }>(
      (map, m) => {
        map[m.id] = m
        return map
      },
      {}
    )

    state.messages.forEach(message => {
      if (!updatedMap[message.id]) {
        return
      }
      message.status = updatedMap[message.id].status
    })
  },

  REMOVE_CONVERSATION(state: MessageState, conversationId: string) {
    const idx = state.originalConversations.findIndex(
      c => c.id === conversationId
    )
    if (idx < 0) {
      state.currentConversation = null
      state.messages = []
      return
    }
    state.originalConversations.splice(idx, 1)
    if (
      state.currentConversation &&
      state.currentConversation.id === conversationId
    ) {
      state.currentConversation = null
      state.messages = []
    }
  },

  REMOVE_MESSAGE_REQUEST(state: MessageState, conversationId: string) {
    state.pendingConversations = state.pendingConversations.filter(
      item => item.id !== conversationId
    )
  },

  RESET_CURRENT_CONVERSATION(state: MessageState) {
    state.currentConversation = null
    state.messages = []
  },

  SET_MESSAGE_LIST_SCROLL_TO_BOTTOM(state: MessageState, value: boolean) {
    state.scrollToBottom = value
  },

  PUSH_TYPING_SESSION(state: MessageState, typingSession: TypingSession) {
    const idx = state.typingSessions.findIndex(
      ts =>
        ts.conversationId === typingSession.conversationId &&
        ts.profileId === typingSession.profileId
    )
    if (idx < 0) {
      state.typingSessions.push(typingSession)
    } else {
      const newTypingSessions = [...state.typingSessions]
      newTypingSessions[idx] = typingSession
    }
  },

  SET_VALID_TYPING_SESSION(
    state: MessageState,
    typingSessions: TypingSession[]
  ) {
    state.typingSessions.splice(
      0,
      state.typingSessions.length,
      ...typingSessions
    )
  },

  SET_TYPING_CHECK_INTERVAL_HANDLE(
    state: MessageState,
    handle: number | undefined
  ) {
    state.typingCheckIntervalHandle = handle
  },

  SET_UNREAD_MESSAGE_BREAKPOINT(
    state: MessageState,
    payload: UnreadMessageBreakpoint | null
  ) {
    state.unreadMessageBreakpoint = payload
  },

  UPDATE_MESSAGE_REACTION(
    state: MessageState,
    payload: MessageReactionPayload
  ) {
    const { messageId, reaction, activeProfileId } = payload
    const newMessages = [...state.messages]

    const messageIndex = newMessages.findIndex(
      message => message.id === messageId
    )
    if (messageIndex > -1) {
      const { reactions = [] } = newMessages[messageIndex]

      const reactionIndex = reactions.findIndex(
        r => r.reactedBy.id === activeProfileId && r.id !== reaction.id
      )
      if (reactionIndex > -1) {
        reactions[reactionIndex] = reaction
      } else {
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          reactions: [reaction]
        }
      }
    }
    state.messages = newMessages
  }
}

export default mutations
