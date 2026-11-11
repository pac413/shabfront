import { queryFriends } from '@/graphql/queries'
import type { ConnectionsAction } from '@/store/connections/types'
import type { FriendProfile, Friends } from '@/types'
import { PROFILE_LIST_PAGE_SIZE } from '@/utils'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  profileId: string
  mine: boolean
  reset?: boolean
}

export type GetFriendsAction = ConnectionsAction<Params, Friends | null>

export const getFriends: GetFriendsAction = async (
  { commit, state },
  params
) => {
  const { profileId, reset, mine } = params

  let offset = 0

  if (!reset) {
    offset = mine ? state.myFriendIds.length : state.friendIds.length

    // check if we already have all friends before querying for them
    const total = mine ? state.totals.myFriends : state.totals.friends
    if (offset >= total) {
      return { data: null }
    }
  }

  let response
  try {
    response = await queryFriends({
      type: 'all',
      targetProfileId: profileId,
      offset: offset,
      limit: PROFILE_LIST_PAGE_SIZE,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.GET_FRIENDS)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.GET_FRIENDS)
  }

  const { profiles } = data.friendsV2
  const friends = profiles.map((profile: FriendProfile) => profile.id)

  commit('SET_FRIENDS', {
    friends,
    append: !reset,
    mine,
    total: data.friendsV2.totalCount
  })
  commit('PUSH_PROFILES', profiles)

  return { data: data.friendsV2 }
}
