import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'

import { type GuestAvailabilityStatus } from './enums'
import { type Reference } from './Reference'

export interface GuestProfile {
  id: string
  status: GuestAvailabilityStatus
  availabilitySentence: string
  location: Location
  phone: string
  guestEndorsements: {
    endorsements: IEndorsementFragmentFragment[]
    total: number
  }
  references: Reference[]
}
