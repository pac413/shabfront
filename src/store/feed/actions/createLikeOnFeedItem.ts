import {
  CreateLikeOnFeedItemDocument,
  type ICreateLikeOnFeedItemInput,
  type ICreateLikeOnFeedItemMutation,
  type ICreateLikeOnFeedItemMutationVariables,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type PostLike } from '@/types'
import { getProfilesFromPostLike } from '@/utils'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type CreateLikeOnFeedItemAction = FeedAction<ICreateLikeOnFeedItemInput, PostLike>

export const createLikeOnFeedItem: CreateLikeOnFeedItemAction = async ({ commit }, { postId }) => {
  const input: ICreateLikeOnFeedItemInput = {
    postId,
  }

  let response
  try {
    response = await mutateApollo<ICreateLikeOnFeedItemMutation, ICreateLikeOnFeedItemMutationVariables>({
      mutation: CreateLikeOnFeedItemDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_LIKE_ON_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_LIKE_ON_FEED_ITEM)
  }

  const { like: originalLike, total } = data.createLikeOnFeedItem
  const { postLike, profiles } = getProfilesFromPostLike(originalLike as any)

  commit('PUSH_FEED_ITEM_LIKE', { like: postLike, postId, total })
  commit('profile/PUSH_PROFILES', profiles, { root: true })

  return { data: postLike }
}
