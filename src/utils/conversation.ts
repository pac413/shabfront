import escapeStringRegexp from 'escape-string-regexp'

import { type Conversation, ConversationParticipantStatus, type Message, MessageType } from '@/types'

/**
 * Get the opponent of the conversation
 * Conversation should contain participants - one of which is the current logged-in user
 * This function will return opponent participant which is not the current logged-in user
 * @param conversation Conversation data
 * @param activeProfileId Current logged-in profile id
 */
export const getConversationOpponent = (conversation: Conversation, activeProfileId: string) => {
  return conversation.participants.find((p) => p.profile.id !== activeProfileId)
}

/**
 * Determines if this conversation matches the search string condition
 * This function will go through as same search logic as backend
 * To reduce backend calls after add/update conversation subscription,
 * we will use this function
 * @param conversation Conversation data
 * @param search Search string
 */
export const isConversationMatch = (conversation: Conversation, search: string, activeProfileId: string) => {
  if (!search) {
    return true
  }
  const opponent = getConversationOpponent(conversation, activeProfileId)
  if (!opponent) {
    return false
  }
  const name = `${opponent.profile.firstName} ${opponent.profile.lastName}`
  return name.match(new RegExp(escapeStringRegexp(search), 'i'))
}

export const getMyConversationStatus = (conversation: Conversation, activeProfileId: string) => {
  const myParticipant = conversation.participants.find((p) => p.profile.id === activeProfileId)
  return myParticipant && myParticipant.status
}

export const getOpponentConverationStatus = (conversation: Conversation, activeProfileId: string) => {
  const opponent = conversation.participants.find((p) => p.profile.id !== activeProfileId)
  return opponent && opponent.status
}

export const getMessageType = (message: Message): MessageType => {
  if (message.attachments && message.attachments[0]) {
    const type = message.attachments[0].mimetype.toLowerCase()
    if (type.startsWith('image')) {
      return MessageType.IMAGE
    } else if (type.startsWith('audio')) {
      return MessageType.AUDIO
    } else if (type.startsWith('video')) {
      return MessageType.VIDEO
    }
  }
  return MessageType.TEXT
}

// Check if conversation is available to active profile
export const checkConversationAvailability = (conversation: Conversation, activeProfileId: string) => {
  const availableConversationParticipantStatus = [
    ConversationParticipantStatus.PENDING,
    ConversationParticipantStatus.APPROVED,
  ]
  const activeParticipant = conversation.participants.find(
    (participant) =>
      participant.profile.id === activeProfileId && availableConversationParticipantStatus.includes(participant.status),
  )
  return !!activeParticipant
}
