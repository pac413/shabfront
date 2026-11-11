<template>
  <OverlayMenuItem
    v-if="friendship && friendship.status === FriendshipStatus.Friends"
    :icon="['fal', 'user-minus']"
    :label="$t('profile-view.friends.unfriend')"
    @hide-menu="$emit('hide-menu')"
    @click.stop="showConfirmUnfriendDialog"
  />
  <div v-else-if="friendship && friendship.status === FriendshipStatus.Pending">
    <template v-if="friendship.requester === profile.id">
      <OverlayMenuItem
        :icon="['fal', 'user-plus']"
        :label="$t('profile-view.friends.accept-request')"
        @hide-menu="$emit('hide-menu')"
        @click="acceptFriendRequest"
      />
      <OverlayMenuItem
        :icon="['fal', 'user-minus']"
        :label="$t('profile-view.friends.dismiss-request')"
        class="with-indent"
        @hide-menu="$emit('hide-menu')"
        @click="dismissFriendRequest"
      />
    </template>
    <OverlayMenuItem
      v-else
      :icon="['fal', 'user-minus']"
      :label="$t('profile-view.friends.cancel-request')"
      class="with-indent"
      @hide-menu="$emit('hide-menu')"
      @click="cancelFriendRequest"
    />
  </div>
  <OverlayMenuItem
    v-else
    :icon="['fal', 'user-plus']"
    :label="$t('profile-view.friends.add-friend')"
    @hide-menu="$emit('hide-menu')"
    @click="addFriend"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import { useToast } from '@/composables'
import { storeKey } from '@/store'
import { type addFriend as addFriendAction } from '@/store/connections/actions/friends/addFriend'
import {
  type approveFriendRequest as approveFriendRequestAction
} from '@/store/connections/actions/friends/approveFriendRequest'
import {
  type cancelFriendRequest as cancelFriendRequestAction
} from '@/store/connections/actions/friends/cancelFriendRequest'
import {
  type rejectFriendRequest as rejectFriendRequestAction
} from '@/store/connections/actions/friends/rejectFriendRequest'
import type { StoreActionPayload, StoreActionResponse } from '@/store/types'
import { Modal, useModalStore } from '@/stores/modal'
import { FriendshipStatus, type Profile } from '@/types'

export default defineComponent({
  name: 'FriendMenuItem',
  components: {
    OverlayMenuItem
  },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const { showErrorToast } = useToast()
    const friendships = computed(() => store.state.connections.friendships)
    const friendship = computed(() => {
      if (props.profile.id in friendships.value) {
        return friendships.value[props.profile.id]
      }
      return props.profile.friendship
    })
    const addFriend = async () => {
      const params: StoreActionPayload<typeof addFriendAction> = {
        profileId: props.profile.id
      }
      const response: StoreActionResponse<typeof addFriendAction> =
        await store.dispatch('connections/addFriend', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const cancelFriendRequest = async () => {
      if (!friendship.value) { return }

      const params: StoreActionPayload<typeof cancelFriendRequestAction> = {
        profileId: props.profile.id,
        requestId: friendship.value.id
      }
      const response: StoreActionResponse<typeof cancelFriendRequestAction> =
        await store.dispatch('connections/cancelFriendRequest', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const acceptFriendRequest = async () => {
      if (!friendship.value) { return }

      const params: StoreActionPayload<typeof approveFriendRequestAction> = {
        requestId: friendship.value.id
      }

      const response: StoreActionResponse<typeof approveFriendRequestAction> =
        await store.dispatch('connections/approveFriendRequest', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const dismissFriendRequest = async () => {
      if (!friendship.value) { return }

      const params: StoreActionPayload<typeof rejectFriendRequestAction> = {
        requestId: friendship.value.id
      }
      const response: StoreActionResponse<typeof rejectFriendRequestAction> =
        await store.dispatch('connections/rejectFriendRequest', params)

      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const showConfirmUnfriendDialog = () => {
      if (!friendship.value) { return }

      showModal({
        modal: Modal.CONFIRM_UNFRIEND,
        props: {
          profile: props.profile,
          friendshipId: friendship.value.id
        }
      })
    }

    return {
      acceptFriendRequest,
      addFriend,
      cancelFriendRequest,
      dismissFriendRequest,
      friendship,
      friendships,
      FriendshipStatus,
      showConfirmUnfriendDialog,
    }
  }
})
</script>
