import { type ConversationParticipantStatus } from './enums/ConversationParticipantStatus'
import { type SimpleProfile } from './SimpleProfile'

export type ConversationParticipant = {
  profile: SimpleProfile
  status: ConversationParticipantStatus
}
