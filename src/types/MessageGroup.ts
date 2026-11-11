import { type Message } from './payloads/Message'

export interface MessageGroup {
  groupedDate: string
  messages: Message[]
}
