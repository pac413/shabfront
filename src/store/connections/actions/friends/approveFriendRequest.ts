import { approveFriendRequest as mutate } from '@/graphql/mutations'
import { type ConnectionsAction } from '@/store/connections/types'
import { type FriendshipStatus, type FriendshipType, type Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  requestId: string
}

type Response = {
  status: FriendshipStatus
  profile: Profile
}

export const approveFriendRequest: ConnectionsAction<Params, Response> = async ({ commit }, { requestId }) => {
  let response

  try {
    response = await mutate({ requestId })
  } catch (err: any) {
    return parseError(err, ERROR_BY_ACTION.APPROVE_FRIEND_REQUEST)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.APPROVE_FRIEND_REQUEST)
  }

  const { profile, status } = data.approveRequest

  const profileId = profile.id
  commit('REMOVE_MY_FRIEND_REQUEST', { profileId })
  commit('ADD_MY_FRIEND', { profileId })

  const friendship: FriendshipType = { id: requestId, status }
  commit('SET_FRIENDSHIP', { profileId, friendship })

  return { data: data.approveRequest }
}
