import { addDatingSiteRole, addGuestSiteRole, addHostSiteRole } from '@/graphql/mutations'
import { type ProfileAction } from '@/store/profile/types'
import { type Profile, SiteRole } from '@/types'

type Params = {
  profileId?: string
  siteRole: SiteRole
}

export type AddSiteRoleAction = ProfileAction<Params, Profile | null>

export const addSiteRole: AddSiteRoleAction = async ({ commit, rootState }, params) => {
  const { profileId, siteRole } = params
  let action: typeof addGuestSiteRole | typeof addHostSiteRole | typeof addDatingSiteRole

  if (siteRole === SiteRole.GUEST) {
    action = addGuestSiteRole
  } else if (siteRole === SiteRole.HOST) {
    action = addHostSiteRole
  } else if (siteRole === SiteRole.DATING) {
    action = addDatingSiteRole
  } else {
    throw new Error('addSiteRole should be called with the right siteRole')
  }

  const { data } = await action({ profileId })
  // TODO: proper error handling
  if (!data) {
    return null
  }
  const { error, profile } =
    'addGuestSiteRole' in data
      ? data.addGuestSiteRole
      : 'addHostSiteRole' in data
        ? data.addHostSiteRole
        : data.addDatingSiteRole

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
