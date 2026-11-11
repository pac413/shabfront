import { type ActionTree } from 'vuex'

import { getAllConnections, getFollowers, getFollowings } from '@/graphql/queries'
import { queryApollo } from '@/plugins/vue-apollo'
import { type FollowersResponse, type FollowingsResponse } from '@/store/follower/types'
import { type RootState } from '@/store/types'
import { type FriendProfile } from '@/types'
import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

import { followProfile } from './actions/followers/followProfile'
import { unfollowProfile } from './actions/followers/unfollowProfile'
import { addFriend } from './actions/friends/addFriend'
import { approveFriendRequest } from './actions/friends/approveFriendRequest'
import { cancelFriendRequest } from './actions/friends/cancelFriendRequest'
import { getFriends } from './actions/friends/getFriends'
import { getMyFriendRequests } from './actions/friends/getMyFriendRequests'
import { rejectFriendRequest } from './actions/friends/rejectFriendRequest'
import { removeFriend } from './actions/friends/removeFriend'
import { type ConnectionsState } from './types'

const extractProfiles = (items: { profiles: FriendProfile[] }) => {
  return {
    profiles: items.profiles,
    profileIds: items.profiles.map((profile) => profile.id),
  }
}

const actions: ActionTree<ConnectionsState, RootState> = {
  // Friends
  getFriends,
  getMyFriendRequests,
  addFriend,
  approveFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  removeFriend,

  async getConnections({ rootState, commit }, params) {
    const { profileId } = params
    const response = await queryApollo({
      query: getAllConnections,
      variables: {
        profileId,
      },
    })

    const { data } = response
    if (rootState.auth.profileId === profileId) {
      commit('SET_MY_CONNECTIONS', data.getAllConnections)
    } else {
      commit('SET_CONNECTIONS', data.getAllConnections)
    }
  },

  getIfFollowingProfile({ state }, params: { profileId: string }) {
    return state.myFollowingIds.indexOf(params.profileId) > -1
  },

  followProfile,
  unfollowProfile,

  async getFollowers({ state, commit }, params: { profileId: string; reset: boolean; mine: boolean }) {
    const { profileId, reset, mine } = params

    let offset = 0
    if (!reset) {
      offset = mine ? state.myFollowerIds.length : state.followerIds.length

      // check if we already have all followers before querying for them
      const total = mine ? state.totals.myFollowers : state.totals.followers
      if (offset >= total) {
        return null
      }
    }

    try {
      const response: FollowersResponse = await queryApollo({
        query: getFollowers,
        variables: {
          profileId,
          offset,
          limit: PROFILE_LIST_PAGE_SIZE,
        },
        fetchPolicy: 'network-only',
      })
      const { profiles, profileIds } = extractProfiles(response.data.followersV2)

      commit('SET_FOLLOWERS', { profileIds, append: !reset, mine, total: response.data.followersV2.total })
      commit('PUSH_PROFILES', profiles)
    } catch (error: any) {
      console.error('Unable to fetch followers: ', error)
    }
  },

  async getFollowings({ state, commit }, params: { profileId: string; reset: boolean; mine: boolean }) {
    const { profileId, reset, mine } = params

    let offset = 0
    if (!reset) {
      offset = mine ? state.myFollowingIds.length : state.followingIds.length

      // check if we already have all followers before querying for them
      const total = mine ? state.totals.myFollowings : state.totals.followings
      if (offset >= total) {
        return null
      }
    }

    try {
      const response: FollowingsResponse = await queryApollo({
        query: getFollowings,
        variables: {
          profileId,
          offset,
          limit: PROFILE_LIST_PAGE_SIZE,
        },
        fetchPolicy: 'network-only',
      })

      const { profiles, profileIds } = extractProfiles(response.data.followingsV2)

      commit('SET_FOLLOWINGS', { profileIds, append: !reset, mine, total: response.data.followingsV2.total })
      commit('PUSH_PROFILES', profiles)
    } catch (error: any) {
      console.error('Unable to fetch followings: ', error)
    }
  },
}

export default actions
