import { type ConnectionsMutation } from '@/store/connections/types'

type Payload = {
  profileId: string
}

/**
 * This will remove my connection from any active profile.
 *
 * Usecase:
 * - When the activeProfile blocks a user, it should remove them from connections.
 *
 */
export const REMOVE_MY_CONNECTION: ConnectionsMutation<Payload> = (state, payload) => {
  const { profileId } = payload

  const followerIdx = state.myFollowerIds.indexOf(profileId)
  if (followerIdx >= 0) {
    state.myFollowerIds.splice(followerIdx, 1)
    state.totals.myFollowers = state.totals.myFollowers - 1
  }

  const followingIdx = state.myFollowingIds.indexOf(profileId)
  if (followingIdx >= 0) {
    state.myFollowingIds.splice(followingIdx, 1)
    state.totals.myFollowings = state.totals.myFollowings - 1
  }

  const friendsIdx = state.myFriendIds.indexOf(profileId)
  if (friendsIdx >= 0) {
    state.myFriendIds.splice(friendsIdx, 1)
    state.totals.myFriends = state.totals.myFriends - 1
  }
}
