import { upcomingShabbatOrYomTov } from '@/utils'

import { type PlannerState } from './types'

export const getInitialState: () => PlannerState = () => ({
  selectedDate: upcomingShabbatOrYomTov(),
  selectedRole: undefined,
  loading: false,
  suggestions: [],
  hostProfileForDate: undefined,
})

const state: PlannerState = getInitialState()

export default state
