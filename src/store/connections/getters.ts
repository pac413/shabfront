import { type GetterTree } from 'vuex'

import { type RootState } from '@/store/types'
import { type FriendProfile,type GenericRequest } from '@/types'

import { type ConnectionsState } from './types'

const getters: GetterTree<ConnectionsState, RootState> = {
  myConnectionsTotal: (state: ConnectionsState) => {
    return [...new Set([...state.myFollowerIds, ...state.myFollowingIds, ...state.myFriendIds])].length
  },

  friends:
    (state: ConnectionsState) =>
      (mine: boolean): string[] => {
        return mine ? state.myFriendIds : state.friendIds
      },

  followings:
    (state: ConnectionsState) =>
      (mine: boolean): string[] => {
        return mine ? state.myFollowingIds : state.followingIds
      },

  followers:
    (state: ConnectionsState) =>
      (mine: boolean): string[] => {
        return mine ? state.myFollowerIds : state.followerIds
      },

  connectionsCount:
    (state: ConnectionsState) =>
      (mine: boolean): number => {
        return mine
          ? state.myFriendIds.length + state.myFollowerIds.length + state.myFollowingIds.length
          : state.friendIds.length + state.followerIds.length + state.followingIds.length
      },

  friendRequests: (state: ConnectionsState): GenericRequest[] => {
    const friends: FriendProfile[] = state.myFriendRequests.map(item => {
      return state.profiles.find(profile => profile.id === item)!
    })

    return friends
      .filter(({ friendship }) => !!friendship)
      .map((profile) => ({
        requestId: profile.friendship!.id,
        profile
      }))
  },

  getProfile: (state: ConnectionsState) => (
    profileId: string
  ): FriendProfile | undefined => {
    return state.profiles.find(item => item.id === profileId)
  },

  mutualFriendCount: (state: ConnectionsState): number => {
    if (!state.friendIds || !state.myFriendIds) {
      return 0
    }
    const mutualFriendsIds = state.myFriendIds.filter((f) => state.friendIds.includes(f))
    return mutualFriendsIds.length
  },
}

export default getters
