<template>
  <nav>
    <ul v-if="profile">
      <li>
        <RouterLink :to="feedRoute">
          {{ $t('profile-view.nav.feed') }}
        </RouterLink>
      </li>
      <li v-if="hasPictures && !hideAllMedia">
        <RouterLink :to="picturesRoute">
          {{ $t('profile-view.nav.pictures') }}
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="connectionsRoute">
          {{ $t('profile-view.nav.connections') }}
        </RouterLink>
      </li>
      <li v-if="showGuestList">
        <RouterLink :to="hostingRoute">
          {{ $t('profile-view.nav.guest-list') }}
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="endorsementsRoute">
          {{ $t('profile-view.nav.endorsements') }}
        </RouterLink>
      </li>
      <li v-if="shouldShowDating">
        <BLink @click.prevent="showDatingModal">
          {{ $t('profile-view.nav.dating-profile') }}
        </BLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { type RouteLocationRaw, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import {
  useGuestListVisibilityQuery
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'

export default defineComponent({
  name: 'ProfileNav',
  setup() {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const profile = computed(() => store.state.profile.currentProfile)
    const isHost = computed<boolean>(() => store.getters['profile/isHost'])
    const isDating = computed<boolean>(() => store.getters['profile/isDating'])
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const shouldShowDating = computed(() => {
      return isDating.value && !profile.value?.isMarried
    })

    const { result: guestListVisibility } = useGuestListVisibilityQuery({
      profileId: profile.value?.id,
    })

    const showGuestList = computed(() => {
      return guestListVisibility.value?.guestListVisibility.visible && isHost
    })

    const hasPictures = computed(() => {
      return profile.value?.pictures && profile.value?.pictures.length > 0
    })

    const feedRoute = computed((): RouteLocationRaw => {
      return {
        name: 'Profile',
        params: { handle: route.params.handle }
      }
    })

    const picturesRoute = computed((): RouteLocationRaw => {
      return {
        name: 'All Pictures',
        params: { handle: route.params.handle }
      }
    })

    const connectionsRoute = computed((): RouteLocationRaw => {
      return {
        name: 'All Connections',
        params: { handle: route.params.handle }
      }
    })

    const hostingRoute = computed((): RouteLocationRaw => {
      return {
        name: 'Hosting Guest',
        params: {
          handle: route.params.handle,
          hostId: profile.value?.id!
        }
      }
    })

    const endorsementsRoute = computed((): RouteLocationRaw => {
      return {
        name: 'Endorsements',
        params: { handle: route.params.handle }
      }
    })

    const showDatingModal = () => {
      showModal({
        modal: Modal.DATING_PROFILE,
        props: {
          profile: profile.value,
        },
      })
    }

    return {
      connectionsRoute,
      endorsementsRoute,
      feedRoute,
      hasPictures,
      hideAllMedia,
      hostingRoute,
      isDating,
      showGuestList,
      picturesRoute,
      profile,
      shouldShowDating,
      showDatingModal,
    }
  }
})
</script>

<style lang="scss" scoped>
nav {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0 1rem;
  display: flex;
}

li {
  margin: 0;
  padding: 0 0.5rem;
  font-size: 1.1rem;
}

a {
  display: inline-block;
  padding: 0.5rem 1.5rem 1rem;
  color: $colorSecondary;
  text-decoration: none;

  &:hover {
    color: $colorText;
    text-decoration: none;
  }
}

.router-link-exact-active {
  color: $colorText;
  font-weight: bold;
  border-bottom: solid 4px $colorText;
}

@media (max-width: $mobileMaxWidth) {
  ul {
    overflow-x: scroll;
  }

  li {
    flex: 0 0 auto;
    a {
      padding: 5px;
      font-size: .8rem;
    }
  }
}
</style>
