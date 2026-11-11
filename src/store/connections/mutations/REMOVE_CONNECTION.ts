import { type ConnectionsMutation } from '@/store/connections/types'

type Payload = {
  profileId: string
}

/**
 * This will remove connection from any active/current profile.
 *
 * Usecase:
 * - When the activeProfile blocks a user, it should remove them from connections.
 *
 */
export const REMOVE_CONNECTION: ConnectionsMutation<Payload> = (state, payload) => {
  const { profileId } = payload

  const followerIdx = state.followerIds.indexOf(profileId)
  if (followerIdx >= 0) {
    state.followerIds.splice(followerIdx, 1)
    state.totals.followers = state.totals.followers - 1
  }

  const followingIdx = state.followingIds.indexOf(profileId)
  if (followingIdx >= 0) {
    state.followingIds.splice(followingIdx, 1)
    state.totals.followings = state.totals.followings - 1
  }

  const friendsIdx = state.friendIds.indexOf(profileId)
  if (friendsIdx >= 0) {
    state.friendIds.splice(friendsIdx, 1)
    state.totals.friends = state.totals.friends - 1
  }
}
