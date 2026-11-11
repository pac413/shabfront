<template>
  <div class="friends-page w-100">
    <requests
      :requests="requests"
      :title="$t('friends.title')"
      :loading="friendRequestsLoading"
      :no-requests-phrase="$t('friends.noFriendRequests')"
      @loadMore="loadMoreFriendRequests"
    >
      <template #actions="props">
        <BButton
          variant="link"
          @click="rejectRequest(props.item)"
        >
          {{ $t('friends.delete') }}
        </BButton>
        <BButton
          variant="primary"
          @click="approveRequest(props.item)"
        >
          {{ $t('friends.accept') }}
        </BButton>
      </template>
    </requests>
    <div class="my-friends mt-3 container">
      <ProfileCard
        :title="'Connections'"
        class="pb-4"
      >
        <connections-toggle-grid />
      </ProfileCard>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import Requests from '@/components/Common/Requests.vue'
import ConnectionsToggleGrid from '@/components/Profile/ConnectionsCard/ConnectionsToggleGrid.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useToast } from '@/composables'
import { storeKey } from '@/store'
import { type approveFriendRequest } from '@/store/connections/actions/friends/approveFriendRequest'
import { type getMyFriendRequests } from '@/store/connections/actions/friends/getMyFriendRequests'
import { type rejectFriendRequest } from '@/store/connections/actions/friends/rejectFriendRequest'
import type { StoreActionPayload, StoreActionResponse } from '@/store/types'
import type { GenericRequest } from '@/types'

export default defineComponent({
  name: 'Friends',
  components: { ConnectionsToggleGrid, ProfileCard, Requests },
  setup() {
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const friendRequests = computed(() => store.state.connections.myFriendRequests)
    const friendRequestsLoading = computed(() => store.state.connections.myFriendRequestsLoading)
    const requests = computed<GenericRequest[]>(() => store.getters['connections/friendRequests'])
    const loading = ref<boolean>(false)

    const loadMoreFriendRequests = async (reset: boolean = false) => {
      const params: StoreActionPayload<typeof getMyFriendRequests> = {
        reset
      }
      const response: StoreActionResponse<typeof getMyFriendRequests> =
        await store.dispatch('connections/getMyFriendRequests', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const rejectRequest = async (request: GenericRequest) => {
      const params: StoreActionPayload<typeof rejectFriendRequest> = {
        requestId: request.requestId
      }

      const response: StoreActionResponse<typeof rejectFriendRequest> =
        await store.dispatch('connections/rejectFriendRequest', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const approveRequest = async (request: GenericRequest) => {
      const params: StoreActionPayload<typeof approveFriendRequest> = {
        requestId: request.requestId
      }

      const response: StoreActionResponse<typeof approveFriendRequest> =
        await store.dispatch('connections/approveFriendRequest', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    onMounted(() => {
      loadMoreFriendRequests(true)
    })

    return {
      approveRequest,
      friendRequests,
      friendRequestsLoading,
      loading,
      loadMoreFriendRequests,
      rejectRequest,
      requests,
    }
  }
})
</script>
