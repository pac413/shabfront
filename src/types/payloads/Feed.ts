import { type PostPrivacySetting, type PostType } from './enums'
import { type Media } from './Media'
import { type PostComment } from './PostComment'
import { type PostLike } from './PostLike'
import { type SimpleProfile } from './SimpleProfile'
import { type WebScrapedLarge } from './WebScraped'

export interface FeedItem {
  id: string
  content: string
  postType: PostType
  commentsCount: number
  viewsCount: number
  likesCount: number
  latestComments: PostComment[]
  latestLikes: PostLike[]
  likedByProfile: boolean
  medias: Media[]
  postedDate: string
  lastActivityAt: string
  postedBy: string | SimpleProfile
  webScraped?: WebScrapedLarge
  shared: boolean
  readonly: boolean
  // TODO: this should be removed after we fully implement medias
  attachmentMediaId?: string
  processingMediaId?: string
  editableFeedId?: string
  privacySetting: PostPrivacySetting
}

export type UpdateFeedInput = Pick<FeedItem, 'content' | 'webScraped'> & {
  shouldAddToFeedItemStore: boolean
}
