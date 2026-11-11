import { type ApolloQueryResult } from '@apollo/client/core'
import type ZenObservable from 'zen-observable'

import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'
import { type TypedAction, type TypedErrorAction, type TypedMutation } from '@/store/types'
import {
  type Friends,
  type Occupation,
  type Profile,
  type SimpleProfile,
  type SiteRole,
} from '@/types'

export interface EndorsementPayload {
  profileId: string
  siteRole: SiteRole
  endorsement: IEndorsementFragmentFragment
}

export type FriendsResponse = ApolloQueryResult<{ friends: Friends }>

export interface ProfileState {
  // Logged-in profile
  activeProfile: Profile | null
  // Viewing profile
  currentProfile: Profile | null

  occupations: Occupation[]

  // Profiles for posts, feeds and comments
  profiles: SimpleProfile[]

  // Subscription
  profilesSubscription: ZenObservable.Subscription | null
  profilesSubscriptionIds: string[]

  blockingProfiles: {
    [key: string]: SimpleProfile[]
  }
}

export type ProfileAction<T, R = any> = TypedAction<ProfileState, T, R>
/**
 * TODO:
 *  We would need to finally replace `ProfileAction` with `ProfileErrorAction` type
 *  to handle errors properly
 */
export type ProfileErrorAction<T, R = any> = TypedErrorAction<ProfileState, T, R>
export type ProfileMutation<P = any> = TypedMutation<ProfileState, P>
