import gql from 'graphql-tag'

import { EndorsementFragment } from '@/graphql/fragments/endorsementFragment'
import { ReferenceFragment } from '@/graphql/fragments/referenceFragment'

export const DatingFragment = gql`
  fragment DatingFragment on DatingProfile {
    id
    aboutMe
    amCohen
    amConvert
    amSmoker
    bodyType
    childrenAgeFrom
    childrenAgeTo
    childrenAtHome
    completeness
    coveringHair
    datingEmploymentStatus
    datingJewishEducation
    datingKeepKosher
    datingSecularEducation
    ethnicBackground
    hashkafa
    haveShadchan
    height
    isPrivate
    livingIsrael
    locationUpbringing
    lookingFor
    maritalStatus
    prayer
    primaryLanguage
    primaryPersonalityTrait
    secondaryLanguage
    secondaryPersonalityTrait
    shadchanEmail
    shadchanInfo
    shadchanName
    torahLearning
    torahObservantSince
    wearSkirts
    references {
      ...ReferenceFragment
    }
    datingEndorsements {
      endorsements {
        ...EndorsementFragment
      }
      total
    }
  }
  ${EndorsementFragment}
  ${ReferenceFragment}
`
