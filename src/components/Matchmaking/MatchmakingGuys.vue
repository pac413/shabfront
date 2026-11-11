<template>
  <div class="d-flex flex-column">
    <div class="d-flex align-items-center mb-3">
      <matchmaking-auto-type-search
        :type="MatchmakingType.Guys"
        class="flex-grow-1"
        @drop="$emit('drop', $event)"
      />
      <BButton
        variant="secondary"
        class="filter-button"
        @click="$emit('show-filter', $event)"
      >
        {{ $t('sticky-subheader.filter-guys') }}
      </BButton>
    </div>

    <matchmaking-list
      :loading="loading"
      :data="profiles"
      @loadMore="loadMore"
      @drop="$emit('drop', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'

import MatchmakingAutoTypeSearch from '@/components/Matchmaking/MatchmakingAutoTypeSearch/ProfileSearch.vue'
import MatchmakingList from '@/components/Matchmaking/MatchmakingList.vue'
import { type IProfileFragmentFragment, useDatingSearchLazyQuery } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type DatingProfile, type MatchmakingFilterOption, MatchmakingType } from '@/types'
import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

export default defineComponent({
  name: 'MatchmakingGuys',
  components: {
    MatchmakingList,
    MatchmakingAutoTypeSearch
  },
  props: {
    filters: {
      required: true,
      type: Object as () => MatchmakingFilterOption,
    }
  },
  emits: ['drop', 'show-filter'],
  setup(props) {
    const store = useStore(storeKey)
    const currentDatingProfile = computed<DatingProfile>(() => store.getters['profile/currentDatingProfile'])
    
    const offset: Ref<number> = ref(0)
    const profiles: Ref<IProfileFragmentFragment[]> = ref([])
    
    const { load, loading, onResult } = useDatingSearchLazyQuery({
      offset: 0,
      limit: PROFILE_LIST_PAGE_SIZE,
      filterBy: {
        menOnly: true
      }
    })

    const loadMore = () => {
      load(undefined, {
        offset: offset.value,
        limit: PROFILE_LIST_PAGE_SIZE,
        filterBy: {
          ...props.filters,
          menOnly: true
        }
      }, {
        fetchPolicy: offset.value === 0 ? 'network-only' : 'cache-and-network'
      })
    }

    const reset = () => {
      offset.value = 0
      profiles.value = []
      loadMore()
    }

    onResult((result) => {
      if (result.loading) {
        return
      }
      const newProfiles = [...profiles.value]
      const existingIds = newProfiles.map((profile) => profile.id)
      const loadedProfiles = result.data?.datingSearch?.profiles || []
      loadedProfiles.forEach((profile) => {
        const idx = existingIds.indexOf(profile.id)
        if (idx >= 0) {
          newProfiles.splice(idx, 1, profile)
        } else {
          newProfiles.push(profile)
        }
      })
      profiles.value = newProfiles
      offset.value = profiles.value.length
    })

    watch(() => props.filters, () => {
      reset()
    }, { immediate: true })

    return {
      MatchmakingType,
      loading,
      profiles,
      currentDatingProfile,
      loadMore,
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-button {
  display: flex;
  align-items: center;
  margin-left: 8px;

  &:first-child {
    margin-left: 0px;
  }

  @media (max-width: $mobileMaxWidth) {
    padding: 5px 10px;
  }
}

.rtl-at-root {
  .filter-button {
    margin-left: 0;
    margin-right: 8px;

    &:first-child {
      margin-right: 0;
    }
  }
}
</style>
