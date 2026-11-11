import { type ConnectionsState } from './types'

export const getInitialState: () => ConnectionsState = () => ({
  profiles: [],

  friendIds: [],
  myFriendIds: [],

  followerIds: [],
  myFollowerIds: [],

  followingIds: [],
  myFollowingIds: [],

  myFriendRequestsLoading: false,
  myFriendRequests: [],

  totals: {
    myFriends: 0,
    myFollowers: 0,
    myFollowings: 0,
    friends: 0,
    followers: 0,
    followings: 0,
  },

  // Dynamic Friendship Statuses
  friendships: {},
})

const state: ConnectionsState = getInitialState()

export default state
