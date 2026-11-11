import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'
import { type InviteDetail, type Reference } from '@/types'

import { getInitialState } from './state'
import { type InviteState } from './types'

const mutations = {
  SET_CURRENT_INVITE: (state: InviteState, invite: InviteDetail) => {
    state.currentInvite = invite
  },
  SET_SELECTED_DATE: (state: InviteState, date: string) => {
    state.selectedDate = date
  },
  RESET_INVITE: (state: InviteState) => {
    state.selectedDate = getInitialState().selectedDate
    state.currentInvite = undefined
    state.subjectEndorsements = []
    state.subjectReferences = []
  },
  SET_SUBJECT_ENDORSEMENTS: (state: InviteState, data: IEndorsementFragmentFragment[]) => {
    state.subjectEndorsements = data
  },
  SET_SUBJECT_REFERENCES: (state: InviteState, data: Reference[]) => {
    state.subjectReferences = data
  },
}

export default mutations
