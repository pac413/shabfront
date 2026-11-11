import { rejectFriendRequest as mutate } from '@/graphql/mutations'
import { type ConnectionsAction } from '@/store/connections/types'
import { type Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  requestId: string
}

type Response = {
  profile: Profile
}

export const rejectFriendRequest: ConnectionsAction<Params, Response> = async ({ commit }, { requestId }) => {
  let response
  try {
    response = await mutate({ requestId })
  } catch (err: any) {
    return parseError(err, ERROR_BY_ACTION.REJECT_FRIEND_REQUEST)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.REJECT_FRIEND_REQUEST)
  }

  const { profile } = data.rejectRequest

  commit('SET_FRIENDSHIP', { profileId: profile.id, friendship: null })
  commit('REMOVE_MY_FRIEND_REQUEST', { profileId: profile.id })

  return { data: data.rejectRequest }
}
