import { FollowProfileDocument, type IFollowProfileMutation } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import type { ConnectionsAction } from '@/store/connections/types'
import type { Profile } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

type Params = { profile: Profile }

export const followProfile: ConnectionsAction<Params, boolean> = async ({ commit }, { profile }) => {
  const profileId = profile.id
  let response
  try {
    response = await mutateApollo<IFollowProfileMutation>({
      mutation: FollowProfileDocument,
      variables: { profileId },
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.FOLLOW_PROFILE)
  }

  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.FOLLOW_PROFILE)
  }
  commit('ADD_MY_FOLLOWING', profileId)
  profile.isFollowing = true
  commit('PUSH_PROFILES', [profile])
  commit('profile/UPDATE_PARTIAL_PROFILE', { id: profileId, updates: { isFollowing: true } }, { root: true })

  return { data: true }
}
