<template>
  <div class="all-viewers-wrapper">
    <ProfileCard
      :icon="['fal', 'binoculars']"
      :title="$t('profile-view.general.viewers')"
    >
      <div
        v-infinite-scroll="loadMore"
        class="all-viewers-grid"
        :infinite-scroll-disabled="loading"
        :infinite-scroll-distance="INFINITE_SCROLL_DISTANCE"
        :infinite-scroll-throttle-delay="INFINITE_SCROLL_THROTTLE_DELAY"
      >
        <viewer-item
          v-for="(item, index) in profileViews"
          :key="index"
          :data="item"
        />
      </div>

      <Spinner v-if="loading" />
      <div
        v-else-if="!profileViews.length"
        class="text-secondary text-center"
      >
        {{ $t('profile-view.anonymous-browse.no-viewers') }}
      </div>
    </ProfileCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useProfileViews } from '@/composables/useProfileViews'
import { storeKey } from '@/store'
import { INFINITE_SCROLL_DISTANCE, INFINITE_SCROLL_THROTTLE_DELAY, PROFILE_LIST_PAGE_SIZE } from '@/utils'

import ViewerItem from './ViewerItem.vue'

export default defineComponent({
  name: 'AllViewersCard',
  components: { ProfileCard, ViewerItem },
  setup() {
    const store = useStore(storeKey)
    const variables = computed(() => {
      const currentProfile = store.state.profile.currentProfile
      const activeProfile = store.state.profile.activeProfile
      return {
        limit: PROFILE_LIST_PAGE_SIZE,
        profileId: currentProfile ? currentProfile.id : activeProfile!.id,
      }
    })
    const {
      loading,
      fetchMoreProfileViews,
      profileViews,
    } = useProfileViews(variables)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])

    return {
      INFINITE_SCROLL_DISTANCE,
      INFINITE_SCROLL_THROTTLE_DELAY,
      loading,
      loadMore: fetchMoreProfileViews,
      profileViews,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.all-viewers-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.menu-buttons {
  button {
    margin-left: 5px;
  }
}

a.link {
  cursor: pointer;
}
.all-viewers-grid {
  flex-wrap: wrap;
  display: flex;
}

.rtl-at-root {
  .menu-buttons {
    button {
      margin-left: unset;
      margin-right: 5px;
    }
  }
}
</style>
