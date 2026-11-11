import { addFriend as mutate } from '@/graphql/mutations'
import { type ConnectionsAction } from '@/store/connections/types'
import { FriendshipStatus, type FriendshipType, type Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = Parameters<typeof mutate>[0]
type Response = {
  status: FriendshipStatus
  profile: Profile
}

export const addFriend: ConnectionsAction<Params, Response> = async ({ commit }, { profileId }) => {
  let response
  try {
    response = await mutate({ profileId })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.ADD_FRIEND)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.ADD_FRIEND)
  }
  const { id, profile, status } = data.addFriend

  if (status === FriendshipStatus.Friends) {
    commit('ADD_MY_FRIEND', { profileId: profile.id })
  } else if (status === FriendshipStatus.Pending) {
    commit('ADD_MY_FRIEND_REQUEST', { profileId: profile.id })
  }
  commit('PUSH_PROFILES', [profile])

  const friendship: FriendshipType = { id: id!, status: status! }
  commit('SET_FRIENDSHIP', { profileId, friendship })

  return { data: data.addFriend }
}
