import { type MediaReference, type MediaUrlInfo } from '@/store/media/types'
import { type LoadingStatus, type TypedAction, type TypedMutation } from '@/store/types'
import { type FeedItem, type MediaSubType, type SubscribeToFeedType } from '@/types'
import { type ParsedError } from '@/utils/errors'

export type FeedItemUploadMediaParams = {
  file: File
  mediaSubType: MediaSubType
  reference: MediaReference
  onUrlGenerated: (params: MediaUrlInfo) => void
}

export interface FeedState {
  /*
   * List of feeds for the current profile
   */
  feed: FeedItem[]
  feedLoading: LoadingStatus
  feedTotal: number
  feedListCommentsHidden: Record<string, boolean>
  currentFeedItem: FeedItem | null
  currentFeedItemLoading: boolean
  activeFeedType: SubscribeToFeedType

  // Count of new feed items for the current active profile
  activeProfileNewFeedCount: number

  editableFeed: FeedItem | null

  /* Store the id of the video currently being played to prevent multiple simultaneously */
  activeVideoId: string | null
}

export type FeedAction<T, R = any> = TypedAction<FeedState, T, { data: R } | ParsedError>
export type FeedMutation<P = any> = TypedMutation<FeedState, P>
