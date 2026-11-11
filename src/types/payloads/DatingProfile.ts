import type { IEndorsementFragmentFragment } from '@/composables/graphql/generated'

import {
  type DatingProfileBodyType,
  type EmploymentStatus,
  type EthnicBackground,
  type Frequency,
  type Hashkafa,
  type Importance,
  type JewishEducation,
  type KeepKosher,
  type Language,
  type MaritalStatus,
  type PersonalityTrait,
  type SecularEducation,
} from './enums'
import { type Reference } from './Reference'

// TODO: Compare this with backend DatingProfile schema and type optional fields
export interface DatingProfile {
  id: string
  aboutMe: string
  amCohen: boolean
  amConvert: boolean
  amSmoker: boolean
  bodyType: DatingProfileBodyType
  childrenAgeFrom: number
  childrenAgeTo: number
  childrenAtHome: boolean
  coveringHair: boolean
  datingEmploymentStatus: EmploymentStatus
  datingJewishEducation: JewishEducation
  datingKeepKosher: KeepKosher
  datingSecularEducation: SecularEducation
  ethnicBackground: EthnicBackground
  hashkafa: Hashkafa
  haveShadchan: boolean
  height: number
  isPrivate: boolean
  livingIsrael: Importance
  locationUpbringing: string
  lookingFor: string
  maritalStatus: MaritalStatus
  prayer: Frequency
  primaryLanguage: Language
  primaryPersonalityTrait: PersonalityTrait
  secondaryLanguage: Language
  secondaryPersonalityTrait: PersonalityTrait
  shadchanEmail: string
  shadchanInfo: string
  shadchanName: string
  torahLearning: Frequency
  torahObservantSince: string
  wearSkirts: boolean
  datingEndorsements: {
    endorsements: IEndorsementFragmentFragment[]
    total: number
  }
  references: Reference[]
  completeness: number
}
