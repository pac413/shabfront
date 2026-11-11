import { cancelFriendRequest as mutate } from '@/graphql/mutations'
import { type ConnectionsAction } from '@/store/connections/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = {
  profileId: string
  requestId: string
}

export const cancelFriendRequest: ConnectionsAction<Params, boolean> = async ({ commit }, { profileId, requestId }) => {
  let response
  try {
    response = await mutate({ requestId })
  } catch (err: any) {
    return parseError(err, ERROR_BY_ACTION.CANCEL_FRIEND_REQUEST)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.CANCEL_FRIEND_REQUEST)
  }

  commit('SET_FRIENDSHIP', { profileId, friendship: null })
  return { data: data.cancelRequest }
}
