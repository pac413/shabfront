import { deleteDatingSiteRole, deleteGuestSiteRole, deleteHostSiteRole } from '@/graphql/mutations'
import { type ProfileAction } from '@/store/profile/types'
import { type Profile, SiteRole } from '@/types'

type Params = {
  profileId?: string
  siteRole: SiteRole
}

export type DeleteSiteRoleAction = ProfileAction<Params, Profile | null>

export const deleteSiteRole: DeleteSiteRoleAction = async ({ commit, rootState }, params) => {
  const { profileId, siteRole } = params
  let action: typeof deleteGuestSiteRole | typeof deleteHostSiteRole | typeof deleteDatingSiteRole

  if (siteRole === SiteRole.GUEST) {
    action = deleteGuestSiteRole
  } else if (siteRole === SiteRole.HOST) {
    action = deleteHostSiteRole
  } else if (siteRole === SiteRole.DATING) {
    action = deleteDatingSiteRole
  } else {
    throw new Error('addSiteRole should be called with the right siteRole')
  }

  const { data } = await action({ profileId })
  // TODO: proper error handling
  if (!data) {
    return null
  }
  const { error, profile } =
    'deleteGuestSiteRole' in data
      ? data.deleteGuestSiteRole
      : 'deleteHostSiteRole' in data
        ? data.deleteHostSiteRole
        : data.deleteDatingSiteRole

  if (error || !profile) {
    return null
  }

  if (profileId && rootState.auth.profileId !== profileId) {
    commit('SET_CURRENT_PROFILE', profile)
  } else {
    commit('SET_ACTIVE_PROFILE', profile)
    commit('auth/SET_AUTHENTICATED_SITE_ROLES', profile.siteRoles, { root: true })
  }

  return profile
}
