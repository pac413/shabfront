import { uniqBy } from 'lodash'
import { computed, type ComputedRef, type Ref } from 'vue'

import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

import { IFriendsType } from './graphql/generated'
import { useFollowers } from './useFollowers'
import { useFollowings } from './useFollowings'
import { useFriends } from './useFriends'

export const useConnections = (
  profileId: ComputedRef<string> | Ref<string>,
  limit: number = PROFILE_LIST_PAGE_SIZE
) => {
  const followersParams = computed(() => ({
    profileId: profileId.value,
    limit
  }))
  const followingsParams = computed(() => ({
    profileId: profileId.value,
    limit
  }))
  const friendsParams = computed(() => ({
    targetProfileId: profileId.value,
    type: IFriendsType.All,
    limit
  }))

  const {
    fetchNewFollowers,
    fetchMoreFollowers,
    fetchingMore: fetchingMoreFollowers,
    followers,
    hasError: hasFollowersError,
    loading: loadingFollowers,
    noResults: noFollowers,
    total: totalFollowers,
  } = useFollowers(followersParams)
  const {
    fetchNewFollowings,
    fetchMoreFollowings,
    fetchingMore: fetchingMoreFollowings,
    followings,
    hasError: hasFollowingsError,
    loading: loadingFollowings,
    noResults: noFollowings,
    total: totalFollowings,
  } = useFollowings(followingsParams)
  const {
    fetchNewFriends,
    fetchMoreFriends,
    fetchingMore: fetchingMoreFriends,
    friends,
    hasError: hasFriendsError,
    loading: loadingFriends,
    noResults: noFriends,
    mutualCount: mutualFriendsCount,
    total: totalFriends,
  } = useFriends(friendsParams)

  const connections = computed(() => uniqBy(
    [
      ...friends.value,
      ...followers.value,
      ...followings.value,
    ],
    'id',
  ))
  const loading = computed(() => loadingFriends.value || loadingFollowers.value || loadingFollowings.value)
  const fetchNewConnections = () => {
    fetchNewFriends()
    fetchNewFollowers()
    fetchNewFollowings()
  }
  const hasError = computed(() => hasFriendsError.value || hasFollowersError.value || hasFollowingsError.value)
  const noConnections = computed(() => noFriends.value && noFollowers.value && noFollowings.value)
  const fetchingMore = computed(() =>
    fetchingMoreFriends || fetchingMoreFollowers || fetchingMoreFollowings
  )
  const fetchMoreConnections = () => {
    fetchMoreFriends()
    fetchMoreFollowers()
    fetchMoreFollowings()
  }

  return {
    connections,
    fetchingMore,
    fetchMoreConnections,
    fetchNewConnections,
    friends,
    hasError,
    loading,
    mutualFriendsCount,
    noConnections,
    totalFriends,
    totalFollowers,
    totalFollowings,
  }
}
