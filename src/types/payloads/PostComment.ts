import { type Media } from './Media'
import { type PostLike } from './PostLike'
import { type SimpleProfile } from './SimpleProfile'
import { type WebScrapedBasic } from './WebScraped'

export interface PostComment {
  id: string
  content: string
  webScraped?: WebScrapedBasic
  commentedBy: string | SimpleProfile
  date: string
  commentLikes?: PostLike[]
  commentLikesCount: number
  medias?: Media[]
  replies?: PostComment[]
  repliesCount?: number
  attachmentMediaId?: string
  processingMediaId?: string
}
