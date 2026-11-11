<template>
  <div class="suggestion-container mt-4 container">
    <div class="suggestions-title">
      <h1 class="mb-2">
        {{ $t('main-header.my-shabbat.shabbat-suggestions') }}
      </h1>
      <div class="text-secondary">
        {{ $t('planner.coming-soon') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'

export default defineComponent({
  name: 'Suggestion',
  setup() {
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)

    const occupationGuestLink = computed(() => {
      const occupation = activeProfile.value?.occupation || 'Other'
      return `search?mode=OccupationSearch&type=guests&occupation=${occupation}`
    })

    const occupationHostLink = computed(() => {
      const occupation = activeProfile.value?.occupation || 'Other'
      return `search?mode=OccupationSearch&type=hosts&occupation=${occupation}`
    })

    return {
      activeProfile,
      occupationGuestLink,
      occupationHostLink,
    }
  },
})
</script>

<style lang="scss" scoped>
.grid {
  flex-wrap: wrap;
  display: flex;
}

.suggestion-container {
  display: flex;
  flex-direction: column;

  .suggestions-title {
    margin-top: 2rem;
  }
  .inner-container {
    background-color: #f8fafd;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 65px);
  }
}

.sticky-subheader {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8fafd;

  h5 {
    font-size: 18px;
    font-weight: bold;
    color: $colorStickyText;
  }
}
</style>
