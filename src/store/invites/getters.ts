import { type GetterTree } from 'vuex'

import { IHostingRole } from '@/composables/graphql/generated'
import { type RootState } from '@/store/types'
import { type InviteDetail, InviteType } from '@/types'
import { getHostingPartsByDate } from '@/utils'

import { type InviteState } from './types'

const getters: GetterTree<InviteState, RootState> = {
  selectedDate: (state) => state.selectedDate,
  currentInvite: (state) => state.currentInvite,
  isRecipient:
    (state: InviteState, getters) =>
      (invite?: InviteDetail): boolean | undefined => {
        invite = invite || state.currentInvite
        if (!invite) {
          return
        }
        const inviteRole = getters.inviteRole(invite)
        return (
          (invite.type === InviteType.INVITATION && inviteRole === IHostingRole.Guest) ||
        (invite.type === InviteType.REQUEST && inviteRole === IHostingRole.Host)
        )
      },
  subjectProfile: (state, getters) => {
    // returns the subject of the invite (aka, the other party - not logged in user)
    if (!state.currentInvite) {
      return
    }
    return getters.inviteRole() === IHostingRole.Host ? state.currentInvite.guest : state.currentInvite.host
  },
  hostingParts: (state) => {
    return getHostingPartsByDate(state.selectedDate)
  },
  inviteRole: (state: InviteState, getters, rootState) => (invite?: InviteDetail) => {
    invite = invite || state.currentInvite
    if (!invite || !rootState.profile.activeProfile) {
      return
    }
    return invite.host.id === rootState.profile.activeProfile.id ? IHostingRole.Host : IHostingRole.Guest
  },
}

export default getters
