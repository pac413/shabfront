<template>
  <BTabs
    pills
    class="connections-toggle__tabs"
  >
    <BTab
      v-for="(type) in connectionTypes"
      :key="type.toString()"
      :title="$t(`profile-view.general.${type}`)"
      @click="onTitleChanged(type)"
    >
      <ConnectionsGrid
        :type="type"
        :profiles="profiles"
        :loading="loading"
        @load-more="loadMore"
      />
    </BTab>
  </BTabs>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { useToast } from '@/composables'
import { storeKey } from '@/store'
import { type getFriends } from '@/store/connections/actions/friends/getFriends'
import type { StoreActionPayload, StoreActionResponse } from '@/store/types'
import { ConnectionTypes } from '@/utils'

export default defineComponent({
  name: 'ConnectionsToggleGrid',
  setup() {
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const friends = computed<(mine: boolean) => string[]>(
      () => store.getters['connections/friends']
    )
    const followers = computed<(mine: boolean) => string[]>(
      () => store.getters['connections/followers']
    )
    const followings = computed<(mine: boolean) => string[]>(
      () => store.getters['connections/followings']
    )
    const titleChanged = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const title = ref<string>(ConnectionTypes.friends)

    const showFriends = computed(() => {
      return title.value === ConnectionTypes.friends
    })

    const showFollowers = computed(() => {
      return title.value === ConnectionTypes.followers
    })

    const showFollowings = computed(() => {
      return title.value === ConnectionTypes.followings
    })

    const profileId = computed(() => {
      return viewingSelf.value ? activeProfile.value?.id : currentProfile.value?.id
    })

    const profiles = computed(() => {
      if (showFriends.value) {
        return friends.value(viewingSelf.value)
      } else if (showFollowers.value) {
        return followers.value(viewingSelf.value)
      }
      return followings.value(viewingSelf.value)
    })

    const loadFriends = async (reset: boolean = false) => {
      const params: StoreActionPayload<typeof getFriends> = {
        profileId: profileId.value!,
        reset,
        mine: viewingSelf.value
      }
      const response: StoreActionResponse<typeof getFriends> =
        await store.dispatch('connections/getFriends', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const loadMore = async (reset: boolean = false) => {
      if (loading.value && !titleChanged.value) {
        return
      }
      loading.value = true
      if (showFriends.value) {
        await loadFriends(reset)
      } else if (showFollowers.value) {
        await store.dispatch(
          'connections/getFollowers',
          {
            profileId: profileId.value,
            reset,
            mine: viewingSelf.value
          }
        )
      } else {
        await store.dispatch(
          'connections/getFollowings',
          {
            profileId: profileId.value,
            reset,
            mine: viewingSelf.value
          }
        )
      }
      loading.value = false
      if (titleChanged.value) {
        titleChanged.value = false
      }
    }

    const onTitleChanged = (newTitle: string) => {
      title.value = newTitle
      titleChanged.value = true
      loadMore(true)
    }

    watch(currentProfile, () => loadMore(true), { immediate: true })
    onMounted(() => loadMore(true))

    return {
      activeProfile,
      currentProfile,
      connectionTypes: [
        ConnectionTypes.friends.toString(),
        ConnectionTypes.followers.toString(),
        ConnectionTypes.followings.toString(),
      ],
      followers,
      followings,
      friends,
      loading,
      loadFriends,
      loadMore,
      onTitleChanged,
      profileId,
      profiles,
      showFollowers,
      showFollowings,
      showFriends,
      title,
      titleChanged,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.connections-toggle__tabs {
  font-size: 1rem;
  padding: 0 1rem 1rem;

  :deep(.nav) {
    padding-bottom: 1rem;
  }

  :deep(.nav-link) {
    color: $colorText;
    line-height: 1.2rem;
    padding: .5rem 1.5rem;
    margin: .5rem 1rem .5rem 0;

    &.active {
      color: white;
      background-color: #666;
      border-radius: 25px;
      font-weight: bold;
    }
  }
}
</style>
