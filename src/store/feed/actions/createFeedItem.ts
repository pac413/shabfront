import {
  CreatePostDocument,
  type ICreatePostInput,
  type ICreatePostMutation,
  type ICreatePostMutationVariables,
} from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type FeedAction } from '@/store/feed/types'
import { type FeedItem } from '@/types'
import { getProfilesFromFeed } from '@/utils'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = ICreatePostInput & {
  shouldAddToFeedItemStore: boolean
}
export type CreateFeedItemAction = FeedAction<Params, FeedItem>

export const createFeedItem: CreateFeedItemAction = async (
  { commit },
  { content, webScraped, shouldAddToFeedItemStore },
) => {
  const input: ICreatePostInput = {
    content,
    webScraped,
  }
  let response
  try {
    response = await mutateApollo<ICreatePostMutation, ICreatePostMutationVariables>({
      mutation: CreatePostDocument,
      variables: { input },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.CREATE_FEED_ITEM)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CREATE_FEED_ITEM)
  }

  // data.createPost is not FeedItem type cos it's not yet normalized to get profiles
  const feedItem = data.createPost as any
  const { feed: newFeedItem, profiles } = getProfilesFromFeed(feedItem)
  commit('profile/PUSH_PROFILES', profiles, { root: true })

  if (shouldAddToFeedItemStore) {
    commit('PUSH_FEED_ITEM', newFeedItem)
  }
  return { data: newFeedItem }
}
