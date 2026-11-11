import { type MediaType } from './enums'

export type TypingSession = {
  conversationId: string
  mediaType?: MediaType
  profileId: string
  updatedAt: number
}
