import { upcomingShabbatOrYomTov } from '@/utils'

import { type InviteState } from './types'

export const getInitialState: () => InviteState = () => ({
  selectedDate: upcomingShabbatOrYomTov(),
  currentInvite: undefined,
  subjectEndorsements: [],
  subjectReferences: [],
})

const state: InviteState = getInitialState()

export default state
