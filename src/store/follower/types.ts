import { type ApolloQueryResult } from '@apollo/client/core'

import { type TypedAction, type TypedMutation } from '@/store/types'
import { type Followers, type Followings } from '@/types'

export type FollowersResponse = ApolloQueryResult<{ followersV2: Followers }>
export type FollowingsResponse = ApolloQueryResult<{ followingsV2: Followings }>

export type FollowerState = {
  followers: Followers
  followersLoading: boolean
  followings: Followings
  followingsLoading: boolean
}

export type FollowerAction<T, R = any> = TypedAction<FollowerState, T, R>
export type FollowerMutation<P = any> = TypedMutation<FollowerState, P>
