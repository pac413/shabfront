<template>
  <div
    v-if="profile"
    class="profile-layout"
  >
    <profile-heading />

    <encourage-following-card />

    <profile-nav />

    <div class="profile-layout__content">
      <RouterView v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
      <BLink
        v-if="showBackButton"
        class="profile-layout__back"
        :to="{ name: 'Profile', params: { handle: profile.handle }}"
      >
        <FaIcon :icon="['fal', 'times-circle']" />
        <span>{{ $t('profile-view.general.back') }}</span>
      </BLink>
    </div>

    <check-avatar-modal />
  </div>

  <div
    v-else
    class="blocked-layout"
  >
    <profile-blocked v-if="blocked" />
    <Spinner
      v-else
      class="profile-layout"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type ZenObservable from 'zen-observable'

import CheckAvatarModal from '@/components/Profile/CheckAvatarModal.vue'
import EncourageFollowingCard from '@/components/Profile/EncourageFollowingCard.vue'
import ProfileBlocked from '@/components/Profile/ProfileBlocked.vue'
import ProfileHeading from '@/components/Profile/ProfileHeading.vue'
import ProfileNav from '@/components/Profile/ProfileNav.vue'
import { useModal } from '@/composables'
import { storeKey } from '@/store'
import type { Profile } from '@/types'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'ProfileLayout',
  components: {
    ProfileHeading,
    ProfileNav,
    CheckAvatarModal,
    EncourageFollowingCard,
    ProfileBlocked,
    RouterView
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const modal = useModal()
    const activeProfileId = computed(() => store.state.auth.profileId)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const profile = computed(() => store.state.profile.currentProfile)
    const subscriptionToProfile = ref<ZenObservable.Subscription | null>(null)
    const blocked = ref(false)
    const handle = computed(() => getSingleIdFromRouteParam(route.params.handle))
    const showBackButton = computed(() => route.name !== 'Profile')

    const loadProfile = async () => {
      let loadedProfile: Profile | null = null
      try {
        if (handle.value) {
          loadedProfile = await store.dispatch('profile/getProfile', { handle: handle.value })
        } else {
          loadedProfile = activeProfile.value
          store.commit('profile/SET_CURRENT_PROFILE', activeProfile.value)
        }
      } catch (error) {
        // check if profile is not found
        if(typeof error === 'object' && error && 'message' in error) {
          if (error.message === 'Profile Not Found') {
            return router.push('/profile-not-found')
          }
          if (error.message === 'This Shabbat.com member\'s profile is not available at this time.') {
            blocked.value = true
          }
        }
      }

      if (!loadedProfile) {
        return
      }

      if (subscriptionToProfile.value) {
        subscriptionToProfile.value.unsubscribe()
      }

      if (
        handle.value &&
        activeProfile.value &&
        activeProfile.value.handle !== handle.value &&
        (loadedProfile.isBlocked || loadedProfile.isBlocking)
      ) {
        router.replace('/profile')
        return
      }
      subscriptionToProfile.value = await store.dispatch('profile/subscribeToProfile', loadedProfile.id)
    }

    watch(handle, async () => {
      if (activeProfile.value?.handle === handle.value) {
        return router.replace('/profile')
      }
      await loadProfile()
    }, { immediate: true })

    watch(activeProfile, () => {
      if (!activeProfile.value) { return }
      if (handle.value && activeProfile.value.handle !== handle.value) { return }

      if (!activeProfile.value.avatar) {
        const value = localStorage.getItem('remind_add_avatar')
        if (value !== 'no') {
          modal.show('check-avatar-modal')
        }
      }
      store.commit('profile/SET_CURRENT_PROFILE', activeProfile.value)
    }, { immediate: true })

    onBeforeUnmount(() => {
      store.commit('profile/SET_CURRENT_PROFILE', null)
      if (subscriptionToProfile.value) {
        subscriptionToProfile.value.unsubscribe()
      }
    })

    return {
      activeProfile,
      activeProfileId,
      blocked,
      handle,
      profile,
      showBackButton,
      subscriptionToProfile,
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-layout {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  font-size: 14px;
  padding: 20px 0 40px;
  flex: 1;
}

.blocked-layout {
  flex: 1;
  display: flex;
}

.profile-layout__content {
  display: flex;

  > .card {
    flex: 1;
  }
  > .full-width {
    flex: 1;
    margin-bottom: 5rem;
  }
}

:deep(.profile-layout__back) {
  position: fixed;
  bottom: 40px;
  left: calc(50% - 40px);
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1030;

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.35);
  border-radius: 20px;
  color: $colorText;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #666;
    text-decoration: none;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  }
  span {
    padding-left: 8px;
  }
}

@media (max-width: $mobileMaxWidth) {
  .profile-layout {
    width: 100%;
    max-width: 1140px;
  }

  :deep(.profile-layout__back) {
    display: inline-flex;
    align-self: center;
  }
}
</style>
