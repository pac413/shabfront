import {
  type IShareFeedItemInput,
  type IShareFeedItemMutation,
  type IShareFeedItemMutationVariables,
  ShareFeedItemDocument,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type FeedItem } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = {
  feedItem: FeedItem
}
export type ShareFeedItemAction = FeedAction<Params, FeedItem | null>

export const shareFeedItem: ShareFeedItemAction = async ({ commit, rootState }, { feedItem }) => {
  const input: IShareFeedItemInput = {
    postId: feedItem.id,
  }

  let response
  try {
    response = await mutateApollo<IShareFeedItemMutation, IShareFeedItemMutationVariables>({
      mutation: ShareFeedItemDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_SHARED_FEED_ITEM)
  }
  const { data } = response
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_SHARED_FEED_ITEM)
  }
  // Update share of feedItem on Vuex to avoid share again
  commit('PUSH_FEED_ITEM', { ...feedItem, shared: true })

  // Check if this is profile feed page or generate feed page
  const { activeProfile, currentProfile } = rootState.profile
  if (currentProfile && activeProfile!.id !== currentProfile.id) {
    // Don't add newly created feedItem into vuex state
    return { data: null }
  }

  // data.shareFeedItem is not FeedItem type cos it's not yet normalized to get profiles
  const { feed: newFeedItem, profiles } = getProfilesFromFeed(data.shareFeedItem as any)
  commit('profile/PUSH_PROFILES', profiles, { root: true })
  if ((newFeedItem.medias && newFeedItem.medias.length) || newFeedItem.webScraped) {
    commit('PUSH_FEED_ITEM', newFeedItem)
  }
  return { data: newFeedItem }
}
