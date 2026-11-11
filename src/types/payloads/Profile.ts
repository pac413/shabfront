import { type ILocale, type IProfileSettings } from '@/composables/graphql/generated'

import { type Avatar } from './Avatar'
import { type DatingProfile } from './DatingProfile'
import { type AccountStatus, type Gender, type ProfileTitle, type ReligiousAffiliation, type SiteRole } from './enums'
import { type FriendshipType } from './FriendshipType'
import { type GuestProfile } from './GuestProfile'
import { type HostProfile } from './HostProfile'
import { type Location } from './Location'
import { type Picture } from './Picture'
import { type Preference } from './Preference'
import { type ProfileFlag } from './ProfileFlag'
import { type Reference } from './Reference'
import { type RiskAssessment } from './RiskAssessment'
import { type Wallpaper } from './Wallpaper'

export interface Profile {
  id: string
  firstName: string
  lastName: string
  displayName: string
  handle: string
  wallpaper: Wallpaper
  pictures: Picture[]
  title: ProfileTitle
  profileUrl: string
  siteRoles: SiteRole[]
  primaryLocation: Location
  primaryLocale: ILocale
  dateActive: Date
  createdAt: Date
  isBlocking: boolean
  isBlocked: boolean

  isFollowing: boolean
  birthday: string | null
  gender: Gender | null
  occupation: string | null
  occupationId: string | null
  avatar: Avatar | null
  organization: string | null
  uncuratedOccupation: string | null
  religiousAffiliation: ReligiousAffiliation | null
  about: string | null
  isMarried: boolean | null
  spouse: string | null
  children: number | null
  searchPreference: Preference | null
  datingPreference: Preference | null
  flags: ProfileFlag[] | null
  totals: {
    views: number
    connections: number
    invites: number
  }

  datingProfile: DatingProfile | null
  guestProfile: GuestProfile | null
  hostProfile: HostProfile | null
  friendship: FriendshipType | null

  email: string | null
  phone: string | null
  references: Reference[] | null
  accountStatus: AccountStatus | null
  riskAssessment?: RiskAssessment | null
  isZealot?: boolean | null
  isGreenlight?: boolean | null
  isAdmin?: boolean | null
  isPushSupported?: boolean | null
  reportId?: string | null
  lastReportedAt?: Date | null
  loginMethods?: [string] | null
  profileSettings?: IProfileSettings | null
  olamiContactMe?: Boolean | null
}
