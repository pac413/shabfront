import type { TypedAction, TypedErrorAction, TypedMutation } from '@/store/types'
import type { Conversation, Message, MessageReaction, TypingSession } from '@/types'

export type UnreadMessageBreakpoint = {
  messageId: string
  arrivedAt: string
}

export type MessageReactionPayload = {
  messageId: string
  reaction: MessageReaction
  activeProfileId: string
}

export interface MessageState {
  originalConversations: Conversation[] // Keep the unsorted/un-filtered conversations data
  pendingConversations: Conversation[] // Used in Message Requests page
  conversationsSearch: string
  conversationsTotal: number
  conversationsLoading: boolean
  pendingConversationsTotal: number
  pendingConversationsLoading: boolean
  messages: Message[]
  messagesTotal: number
  messagesLoading: boolean
  currentConversation: Conversation | null

  typingSessions: TypingSession[]
  typingCheckIntervalHandle: number | undefined

  /*
   * This state var is used to trigger the scroll to bottom of messages list
   */
  scrollToBottom: boolean

  /*
   * This state var is used to keep the start of unread message id and its arrival time
   */
  unreadMessageBreakpoint: UnreadMessageBreakpoint | null
}

export type MessageAction<T, R = any> = TypedAction<MessageState, T, R>
/**
 * TODO:
 *  We would need to finally replace `MessageAction` with `MessageErrorAction` type
 *  to handle errors properly
 */
export type MessageErrorAction<T, R = any> = TypedErrorAction<
  MessageState,
  T,
  R
>
export type MessageMutation<P = any> = TypedMutation<MessageState, P>

export const CONVERATIONS_LIMIT = 30
export const MESSAGES_LIMIT = 30
