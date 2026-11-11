import { type GetterTree } from 'vuex'

import { IHostingRole } from '@/composables/graphql/generated'
import { type RootState } from '@/store/types'
import { useGlobalStore } from '@/stores/global'
import { SiteRole } from '@/types'
import { getParshaDate, getParshaText } from '@/utils'

import { type PlannerState } from './types'

const getters: GetterTree<PlannerState, RootState> = {
  roles: (_state, _getters, rootState) => {
    const siteRoles = rootState.profile.activeProfile?.siteRoles || []
    const hostingRoles = []
    if (siteRoles.includes(SiteRole.HOST)) {
      hostingRoles.push(IHostingRole.Host)
    }
    if (siteRoles.includes(SiteRole.GUEST)) {
      hostingRoles.push(IHostingRole.Guest)
    }
    return hostingRoles
  },
  selectedRole: (state) => state.selectedRole,
  selectedDate: (state) => state.selectedDate,
  formattedParshaTitle: (state, _, rootState) => {
    const globalStore = useGlobalStore()
    if (!state.selectedDate || !rootState.profile.activeProfile) {
      return
    }
    return (
      '<b>' +
      getParshaText(
        state.selectedDate,
        globalStore.language.locale,
        rootState.profile.activeProfile.religiousAffiliation,
      ) +
      '</b>&nbsp;&nbsp;' +
      getParshaDate(state.selectedDate, globalStore.language.locale)
    )
  },
  isLoading: (state) => state.loading,
  suggestions: (state) => state.suggestions,
  hostProfileForDate: (state, _getters, rootState) => {
    if (!rootState.profile.activeProfile) {
      return
    }
    return state.hostProfileForDate || rootState.profile.activeProfile.hostProfile
  },
}

export default getters
