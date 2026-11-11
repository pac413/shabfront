import { type ConversationParticipant } from './ConversationParticipant'
import { type Message } from './Message'
import { type SimpleProfile } from './SimpleProfile'

export interface Conversation {
  id: string
  participants: ConversationParticipant[]
  isBroadcast: boolean
  title?: string
  initiator?: SimpleProfile
  unreadMessagesCount: number
  lastMessage: Message | null
}
