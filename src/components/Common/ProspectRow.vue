<template>
  <div class="prospect-row">
    <ProspectCard
      v-for="profile in source.items"
      :key="profile.id"
      :source="profile"
      :selectable="selectable"
      :selected="!!profilesSelection[profile.id]"
      @select="onProfileSelected"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProspectCard from '@/components/Common/ProspectCard.vue'
import { storeKey } from '@/store'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'ProspectRow',
  components: {
    ProspectCard,
  },
  props: {
    source: {
      type: Object as () => ({ items: Profile[], id: number }),
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore(storeKey)
    const profilesSelection = computed(() => store.state.search.profilesSelection)
    const onProfileSelected = (params: { profile: Profile, isSelected: boolean }) => {
      const { profile: { id: profileId }, isSelected } = params
      store.commit('search/SET_PROFILE_SELECTION', {
        [profileId]: isSelected
      })
    }
    return {
      onProfileSelected,
      profilesSelection,
    }
  }
})
</script>

<style scoped lang="scss">
.prospect-row {
  display: flex;
  flex-wrap: wrap;

  :deep(.prospect-card) {
    width: calc(20% - 2rem);
    margin: 1rem;

    @media (max-width: $tabletMaxWidth) {
      width: calc(33% - 2rem);
    }
  }
}
</style>
