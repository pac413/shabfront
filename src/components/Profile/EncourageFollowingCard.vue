<template>
  <transition name="slide">
    <div
      v-if="visible"
      class="encourage-following-card"
    >
      <div class="card-content">
        <div class="title">
          {{ $t('profile-view.encourage-following.title', { firstName: profile.firstName }) }}
        </div>
        <div class="description">
          {{ $t('profile-view.encourage-following.description', { firstName: profile.firstName }) }}
        </div>
      </div>
      <BButton
        v-if="!isFriend"
        size="md"
        variant="primary"
        @click="addFriend"
      >
        <FaIcon :icon="['fal', 'user-plus']" />
        <span class="ms-1">{{ $t('profile-view.friends.add-friend') }}</span>
      </BButton>
      <BButton
        v-if="!isFollowing"
        size="md"
        variant="secondary"
        class="ms-1"
        @click="follow"
      >
        <FaIcon :icon="['fal', 'user-plus']" />
        <span class="ms-1">{{ $t('profile-view.follower.follow') }}</span>
      </BButton>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { useToast } from '@/composables'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'EncourageFollowing',
  setup() {
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const profile = computed(() => store.state.profile.currentProfile)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const isFollowing = computed<boolean>(() => store.getters['profile/isFollowingCurrentProfile'])
    const isFriend = computed<boolean>(() => store.getters['profile/currentFriendshipStatus'])
    const visible = computed(() => {
      // if profile is not myself, and not my friend or following, show this component
      if (
        viewingSelf.value ||
        isFollowing.value ||
        isFriend.value ||
        profile.value?.isBlocking ||
        profile.value?.isBlocked
      ) {
        return false
      }

      return true
    })

    const addFriend = async () => {
      const response = await store.dispatch('connections/addFriend', { profileId: profile.value!.id })
      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    const follow = async () => {
      const response = await store.dispatch('connections/followProfile', { profile: profile.value })
      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    return {
      addFriend,
      follow,
      isFollowing,
      isFriend,
      profile,
      viewingSelf,
      visible,
    }
  }
})
</script>

<style lang="scss" scoped>
  .encourage-following-card {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e4e4e4;
    border-radius: 0 0 12px 12px;
    margin-bottom: 1.5rem;
    padding: 18px 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .card-content {
    flex: 1;

    .title {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .description {
      color: #6c757d;
      line-height: 1.3rem;
      padding: 0.5rem 0;
      white-space: pre-wrap;
    }
  }

</style>
