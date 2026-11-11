import { type IHostingRole } from '@/composables/graphql/generated'
import { type HostProfile, type Suggestion } from '@/types'

export interface PlannerState {
  selectedDate: string
  selectedRole: IHostingRole | undefined
  loading: boolean
  suggestions: Suggestion[]
  hostProfileForDate: HostProfile | undefined
}
