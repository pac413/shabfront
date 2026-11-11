import { type TypedAction, type TypedMutation } from '@/store/types'
import { type FriendProfile, type FriendshipType } from '@/types'
import { type ParsedError } from '@/utils/errors'

export type ConnectionsState = {
  profiles: FriendProfile[]

  followerIds: string[]
  myFollowerIds: string[]

  friendIds: string[]
  myFriendIds: string[]

  followingIds: string[]
  myFollowingIds: string[]

  myFriendRequests: string[]
  myFriendRequestsLoading: boolean

  totals: {
    myFriends: number
    myFollowers: number
    myFollowings: number
    friends: number
    followers: number
    followings: number
  }

  friendships: { [key: string]: FriendshipType }
}

export type ConnectionsPayload = {
  followerIds: string[]
  followingIds: string[]
  friendIds: string[]
}

export type ConnectionsAction<T, R = any> = TypedAction<ConnectionsState, T, { data: R } | ParsedError>
export type ConnectionsMutation<P = any> = TypedMutation<ConnectionsState, P>
