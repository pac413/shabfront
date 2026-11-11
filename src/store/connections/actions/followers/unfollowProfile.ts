import { type IUnfollowProfileMutation,UnfollowProfileDocument } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import type { ConnectionsAction } from '@/store/connections/types'
import type { Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = { profile: Profile }

export const unfollowProfile: ConnectionsAction<Params, boolean> = async ({ commit }, { profile }) => {
  const profileId = profile.id
  let response
  try {
    response = await mutateApollo<IUnfollowProfileMutation>({
      mutation: UnfollowProfileDocument,
      variables: { profileId },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.UNFOLLOW_PROFILE)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.UNFOLLOW_PROFILE)
  }
  commit('REMOVE_MY_FOLLOWING', profileId)
  profile.isFollowing = false
  commit('profile/UPDATE_PARTIAL_PROFILE', { id: profileId, updates: { isFollowing: false } }, { root: true })

  return { data: true }
}
