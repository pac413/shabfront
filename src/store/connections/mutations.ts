import type { MutationTree } from 'vuex'

import type { FriendProfile, FriendshipType } from '@/types'

import { REMOVE_CONNECTION } from './mutations/REMOVE_CONNECTION'
import { REMOVE_MY_CONNECTION } from './mutations/REMOVE_MY_CONNECTION'
import type { ConnectionsPayload, ConnectionsState } from './types'

const mutations: MutationTree<ConnectionsState> = {
  SET_CONNECTIONS(state: ConnectionsState, connections: ConnectionsPayload) {
    state.followerIds = connections.followerIds || []
    state.followingIds = connections.followingIds || []
    state.friendIds = connections.friendIds || []

    state.totals.followers = connections.followerIds.length
    state.totals.followings = connections.followingIds.length
    state.totals.friends = connections.friendIds.length
  },
  REMOVE_CONNECTION,

  SET_MY_CONNECTIONS(state: ConnectionsState, connections: ConnectionsPayload) {
    state.myFollowerIds = connections.followerIds || []
    state.myFollowingIds = connections.followingIds || []
    state.myFriendIds = connections.friendIds || []

    state.totals.myFollowers = connections.followerIds.length
    state.totals.myFollowings = connections.followingIds.length
    state.totals.myFriends = connections.friendIds.length
  },
  REMOVE_MY_CONNECTION,

  ADD_MY_FOLLOWING(state: ConnectionsState, profileId) {
    if (state.myFollowingIds.indexOf(profileId) === -1) {
      state.myFollowingIds = state.myFollowingIds.concat(profileId)
      state.totals = {
        ...state.totals,
        myFollowings: state.totals.myFollowings + 1,
      }
    }
  },

  REMOVE_MY_FOLLOWING(state: ConnectionsState, profileId) {
    const index = state.myFollowingIds.indexOf(profileId)
    if (index > -1) {
      state.myFollowingIds.splice(index, 1)
      state.totals = {
        ...state.totals,
        myFollowings: state.totals.myFollowings - 1,
      }
    }
  },

  SET_MY_FRIEND_REQUESTS_LOADING(state: ConnectionsState, loading: boolean) {
    state.myFriendRequestsLoading = loading
  },

  ADD_MY_FRIEND_REQUESTS(state: ConnectionsState, params: { friends: string[]; append: boolean }) {
    const { friends, append } = params
    if (append) {
      const friendRequests = (state.myFriendRequests || []).concat(friends)
      state.myFriendRequests = friendRequests
    } else {
      state.myFriendRequests = friends
    }
  },

  ADD_MY_FRIEND(state: ConnectionsState, params: { profileId: string }) {
    if (state.myFriendIds.indexOf(params.profileId) === -1) {
      state.myFriendIds.push(params.profileId)
      state.totals = {
        ...state.totals,
        myFriends: state.totals.myFriends + 1,
      }
    }
  },

  REMOVE_MY_FRIEND_REQUEST(state: ConnectionsState, params: { profileId: string }) {
    const { profileId } = params
    state.myFriendRequests = state.myFriendRequests.filter((item) => item !== profileId)
  },

  ADD_MY_FRIEND_REQUEST(state: ConnectionsState, params: { profileId: string }) {
    const { profileId } = params
    if (state.myFriendRequests.includes(profileId)) {
      state.myFriendRequests.push(profileId)
    }
  },

  REMOVE_MY_FRIEND(state: ConnectionsState, params: { profileId: string }) {
    const { profileId } = params
    const index = state.myFriendIds.indexOf(profileId)
    if (index > -1) {
      state.myFriendIds.splice(index, 1)
      state.totals = {
        ...state.totals,
        myFriends: state.totals.myFriends - 1,
      }
    }
  },

  PUSH_PROFILES (state: ConnectionsState, profiles: FriendProfile[]) {
    state.profiles = [...new Set([...state.profiles, ...profiles])]
  },

  SET_FRIENDS(
    state: ConnectionsState,
    params: {
      friends: string[]
      append: boolean
      mine: boolean
      total: number
    },
  ) {
    const { friends, append, mine, total } = params

    if (mine) {
      state.myFriendIds = append ? state.myFriendIds.concat(friends) : friends
      state.totals.myFriends = total
    } else {
      state.friendIds = append ? state.friendIds.concat(friends) : friends
      state.totals.friends = total
    }
  },

  SET_FOLLOWERS(
    state: ConnectionsState,
    params: {
      profileIds: string[]
      append: boolean
      mine: boolean
      total: number
    },
  ) {
    const { mine, append, profileIds, total } = params

    if (mine) {
      state.myFollowerIds = append ? state.myFollowerIds.concat(profileIds) : profileIds
      state.totals.myFollowers = total
    } else {
      state.followerIds = append ? state.followerIds.concat(profileIds) : profileIds
      state.totals.followers = total
    }
  },

  SET_FOLLOWINGS(
    state: ConnectionsState,
    params: {
      profileIds: string[]
      append: boolean
      mine: boolean
      total: number
    },
  ) {
    const { mine, append, profileIds, total } = params

    if (mine) {
      state.myFollowingIds = append ? state.myFollowingIds.concat(profileIds) : profileIds
      state.totals.myFollowings = total
    } else {
      state.followingIds = append ? state.followingIds.concat(profileIds) : profileIds
      state.totals.followings = total
    }
  },

  SET_FRIENDSHIP(state: ConnectionsState, payload: { profileId: string; friendship: FriendshipType }) {
    state.friendships = {
      ...state.friendships,
      [payload.profileId]: payload.friendship,
    }
  },
}

export default mutations
