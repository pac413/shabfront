import { type ActionTree } from 'vuex'

import { type UploadMediaParams } from '@/store/media/types'
import { type RootState } from '@/store/types'
import { type Media } from '@/types'
import { getMediaType } from '@/utils'

import { createCommentOnFeedItem } from './actions/createCommentOnFeedItem'
import { createCommentReply } from './actions/createCommentReply'
import { createFeedItem } from './actions/createFeedItem'
import { createLikeOnComment } from './actions/createLikeOnComment'
import { createLikeOnCommentReply } from './actions/createLikeOnCommentReply'
import { createLikeOnFeedItem } from './actions/createLikeOnFeedItem'
import { deleteCommentOnFeedItem } from './actions/deleteCommentOnFeedItem'
import { deleteFeedItem } from './actions/deleteFeedItem'
import { deleteLikeOnComment } from './actions/deleteLikeOnComment'
import { deleteLikeOnCommentReply } from './actions/deleteLikeOnCommentReply'
import { deleteLikeOnFeedItem } from './actions/deleteLikeOnFeedItem'
import { deleteReplyOnComment } from './actions/deleteReplyOnComment'
import { getAvatarUpdatedFeedItem } from './actions/getAvatarUpdatedFeedItem'
import { getCommentById } from './actions/getCommentById'
import { getCommentReplyById } from './actions/getCommentReplyById'
import { getFeedItemById } from './actions/getFeedItemById'
import { getPreview } from './actions/getPreview'
import { hideAllPostsFrom } from './actions/hideAllPostsFrom'
import { hidePostFromFeed } from './actions/hidePostFromFeed'
import { loadCommentLikes } from './actions/loadCommentLikes'
import { loadFeedItemById } from './actions/loadFeedItemById'
import { loadFeedItemComments } from './actions/loadFeedItemComments'
import { loadFeedItemLikes } from './actions/loadFeedItemLikes'
import { loadFeedItemsByProfileId } from './actions/loadFeedItemsByProfileId'
import { loadProfileFeedItems } from './actions/loadProfileFeedItems'
import { shareFeedItem } from './actions/shareFeedItem'
import { subscribeToFeed } from './actions/subscribeToFeed'
import { subscribeToFeedItem } from './actions/subscribeToFeedItem'
import { subscribeToNewFeedCount } from './actions/subscribeToNewFeedCount'
import { updateCommentOnFeedItem } from './actions/updateCommentOnFeedItem'
import { updateFeedItem } from './actions/updateFeedItem'
import { updateReplyOnComment } from './actions/updateReplyOnComment'
import { type FeedItemUploadMediaParams, type FeedState } from './types'

const actions: ActionTree<FeedState, RootState> = {
  createCommentOnFeedItem,
  createCommentReply,
  createFeedItem,
  createLikeOnComment,
  createLikeOnCommentReply,
  createLikeOnFeedItem,
  deleteCommentOnFeedItem,
  deleteFeedItem,
  hidePostFromFeed,
  hideAllPostsFrom,
  deleteLikeOnComment,
  deleteLikeOnCommentReply,
  deleteLikeOnFeedItem,
  deleteReplyOnComment,
  getPreview,
  loadFeedItemById,
  loadFeedItemComments,
  loadFeedItemLikes,
  loadCommentLikes,
  loadFeedItemsByProfileId,
  loadProfileFeedItems,
  subscribeToFeed,
  subscribeToFeedItem,
  subscribeToNewFeedCount,
  updateFeedItem,
  getAvatarUpdatedFeedItem,
  getFeedItemById,
  getCommentById,
  getCommentReplyById,
  shareFeedItem,
  updateCommentOnFeedItem,
  updateReplyOnComment,

  async uploadMedia({ dispatch }, payload: FeedItemUploadMediaParams) {
    const { file, mediaSubType, reference, onUrlGenerated } = payload
    const uploadMediaParams: UploadMediaParams = {
      file,
      mediaType: getMediaType(file),
      mediaSubType,
      reference,
      onUrlGenerated,
    }
    const { data, error } = await dispatch('media/uploadMedia', uploadMediaParams, { root: true })
    if (error) {
      throw error
    }
    const media = data as Media
    return media
  },
}

export default actions
