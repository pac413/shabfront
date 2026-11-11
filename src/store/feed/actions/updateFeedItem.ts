import {
  type IUpdatePostInput,
  type IUpdatePostMutation,
  type IUpdatePostMutationVariables,
  UpdatePostDocument,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type FeedItem } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = IUpdatePostInput & { shouldAddToFeedItemStore: boolean }
export type UpdateFeedItemAction = FeedAction<Params, FeedItem>

export const updateFeedItem: UpdateFeedItemAction = async (
  { commit },
  { content, id, webScraped, shouldAddToFeedItemStore },
) => {
  const input: IUpdatePostInput = {
    content,
    id,
    webScraped,
  }

  let response
  try {
    response = await mutateApollo<IUpdatePostMutation, IUpdatePostMutationVariables>({
      mutation: UpdatePostDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.UPDATE_FEED_ITEM)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.UPDATE_FEED_ITEM)
  }

  // data.updatePost is not FeedItem type cos it's not yet normalized to get profiles
  const feedItem = data.updatePost
  const { feed: newFeedItem, profiles } = getProfilesFromFeed(feedItem as any)
  commit('profile/PUSH_PROFILES', profiles, { root: true })

  if (shouldAddToFeedItemStore) {
    commit('PUSH_FEED_ITEM', newFeedItem)
  }

  return { data: newFeedItem }
}
