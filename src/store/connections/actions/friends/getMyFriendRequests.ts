import { queryFriends } from '@/graphql/queries'
import type { ConnectionsAction } from '@/store/connections/types'
import type { FriendProfile,Friends } from '@/types'
import { PROFILE_LIST_PAGE_SIZE } from '@/utils'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  reset: boolean
} | void

export type GetMyFriendRequestsAction = ConnectionsAction<
  Params,
  Friends | null
>

export const getMyFriendRequests: GetMyFriendRequestsAction = async (
  { commit, state },
  params
) => {
  if (state.myFriendRequestsLoading) {
    return { data: null }
  }

  const reset = params && params.reset
  const offset =
    !reset && state.myFriendRequests ? state.myFriendRequests.length : 0

  commit('SET_MY_FRIEND_REQUESTS_LOADING', true)

  let response
  try {
    response = await queryFriends({
      type: 'pending',
      offset: offset,
      limit: PROFILE_LIST_PAGE_SIZE,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.GET_MY_FRIEND_REQUESTS)
  } finally {
    commit('SET_MY_FRIEND_REQUESTS_LOADING', false)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.GET_MY_FRIEND_REQUESTS)
  }

  const { profiles } = data.friendsV2
  const friendRequestIds = profiles.map((profile: FriendProfile) => profile.id)
  commit('ADD_MY_FRIEND_REQUESTS', {
    friends: friendRequestIds,
    append: !reset
  })
  commit('PUSH_PROFILES', profiles)

  return { data: data.friendsV2 }
}
