import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'

import { type HostProfileStatus, type HostReserveBy } from './enums'
import { type Location } from './Location'
import { type Reference } from './Reference'
import { type SimpleProfile } from './SimpleProfile'

export interface HostProfile {
  id: string
  hostMen: boolean
  hostWomen: boolean
  mealAmount: number
  sleepAmount: number
  hostAffiliatedJews: boolean
  hostUnAffiliatedJews: boolean
  showGuestList: boolean
  hostFamiliesWithChildren: boolean
  reserveBy: HostReserveBy
  status: HostProfileStatus
  location: Location
  privateInviteEnabled: boolean
  privateInviteCode: string
  hostEndorsements: {
    endorsements: IEndorsementFragmentFragment[]
    total: number
  }
  references: Reference[]
  unavailableGuests: SimpleProfile[]
}
