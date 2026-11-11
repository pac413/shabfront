import { type ActionTree } from 'vuex'

import { type MessageState } from '@/store/message/types'
import { type RootState } from '@/store/types'

import { approveConversation } from './approveConversation'
import { archiveConversation } from './archiveConversation'
import { createBroadcastConversation } from './createBroadcastConversation'
import { createConversation } from './createConversation'
import { createMessageReaction } from './createMessageReaction'
import { deleteMessage } from './deleteMessage'
import { getConversation } from './getConversation'
import { getConversations } from './getConversations'
import { getMessagesForCurrentConversation } from './getMessagesForCurrentConversation'
import { getPendingConversations } from './getPendingConversations'
import { markMessagesAsRead } from './markMessagesAsRead'
import { rejectConversation } from './rejectConversation'
import { sendMessage } from './sendMessage'
import { sendUserIsTyping } from './sendUserIsTyping'
import { startUserIsTypingChecks } from './startUserIsTypingChecks'
import { stopUserIsTypingChecks } from './stopUserIsTypingChecks'
import { subscribeToConversations } from './subscribeToConversations'
import { subscribeToIncomingMessages } from './subscribeToIncomingMessages'
import { subscribeToUserIsTyping } from './subscribeToUserIsTyping'
import { uploadMedia } from './uploadMedia'

const actions: ActionTree<MessageState, RootState> = {
  approveConversation,
  archiveConversation,
  createBroadcastConversation,
  createConversation,
  createMessageReaction,
  deleteMessage,
  getConversation,
  getConversations,
  getMessagesForCurrentConversation,
  getPendingConversations,
  markMessagesAsRead,
  rejectConversation,
  sendMessage,
  sendUserIsTyping,
  startUserIsTypingChecks,
  stopUserIsTypingChecks,
  subscribeToConversations,
  subscribeToIncomingMessages,
  subscribeToUserIsTyping,
  uploadMedia,
}

export default actions
