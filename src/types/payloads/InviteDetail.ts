import { type HostingPart, type InviteStatus, type InviteType } from './enums'
import { type InviteNote } from './InviteNote'
import { type Profile } from './Profile'

export interface InviteDetail {
  id: string
  host: Profile
  guest: Profile
  date: string
  guestParts?: HostingPart[]
  hostParts?: HostingPart[]
  sharedParts?: HostingPart[]
  notes: InviteNote[]
  type: InviteType
  status: InviteStatus
}
