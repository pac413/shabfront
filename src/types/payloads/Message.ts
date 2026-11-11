import { type WebScrapedBasic } from '@/types/payloads/WebScraped'

import { type Conversation } from './Conversation'
import { type Media } from './Media'
import { type SimpleProfile } from './SimpleProfile'

export interface MessageStatusDetails {
  status: string
  dateSent: string
  dateRead: string
}

export interface MessageReaction {
  id: string
  reaction: string
  reactedBy: SimpleProfile
  date: string
}

export enum MessageType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  NEW_FRIENDS = 'NEW_FRIENDS',
  NEW_HOSTING = 'NEW_HOSTING',
}

export interface Message {
  id: string
  text: string
  date: string
  type: MessageType
  sender: SimpleProfile
  status: MessageStatusDetails
  isBroadcastMessage: boolean
  attachments?: Media[]
  conversation?: Conversation
  webScraped?: WebScrapedBasic
  reactions?: MessageReaction[]

  // These are the fields not from the backend
  groupedDate?: string
  /*
   * Internal Id is used when uploading attachments to show the progress until the upload process is done
   */
  internalId?: string
}
