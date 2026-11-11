<template>
  <div>
    <search-options
      v-if="!keyword && !typeaheadMode"
      v-model:search-by="searchBySync"
      @close-popup="$emit('close-popup')"
    />
    <div
      v-else-if="keyword && hasResult"
      class="search-popup__content"
    >
      <auto-type-search-profiles
        :keyword="keyword"
        :profiles="profiles"
        :active-index="activeIndex"
        :typeahead-mode="typeaheadMode"
        @close-popup="$emit('close-popup')"
        @selected="$emit('selected', $event)"
      />
      <auto-type-search-occupations
        :keyword="keyword"
        :occupations="occupations"
        :active-index="activeIndex - profiles.length"
        @close-popup="$emit('close-popup')"
      />
    </div>
    <div
      v-else-if="loading"
      class="search-loading"
    >
      <span>{{ $t('outer-search.loading') }}</span>
      <div class="search-loading-icon">
        <FaIcon
          :icon="['fa', 'spinner']"
          pulse
        />
      </div>
    </div>
    <div
      v-else-if="!hasResult"
      class="search-no-items"
    >
      <span v-if="typeaheadMode">{{ $t('outer-search.typeSomething') }}</span>
      <span v-else>{{ $t('outer-search.noItemsToShow') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount,onMounted, ref, watch } from 'vue'

import { type Occupation, type SearchBy, type SimpleProfile } from '@/types'

import AutoTypeSearchOccupations from './AutoTypeSearchOccupations.vue'
import AutoTypeSearchOptions from './AutoTypeSearchOptions/AutoTypeSearchOptions.vue'
import AutoTypeSearchProfiles from './AutoTypeSearchProfiles.vue'

export default defineComponent({
  name: 'AutoTypeSearchPopup',
  components: {
    AutoTypeSearchOccupations,
    AutoTypeSearchProfiles,
    SearchOptions: AutoTypeSearchOptions
  },
  props: {
    keyword: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    searchBy: {
      type: String as () => SearchBy,
      required: true
    },
    profiles: {
      required: false,
      type: Array as () => SimpleProfile[],
      default: () => []
    },
    occupations: {
      required: false,
      type: Array as () => Occupation[],
      default: () => []
    },
    typeaheadMode: {
      required: false,
      type: Boolean,
      default: false
    },
  },
  emits: ['close-popup', 'selected', 'set-search-by'],
  setup(props, { emit }) {
    const searchBySync = computed({
      get: () => props.searchBy,
      set: (val: SearchBy) => emit('set-search-by', val)
    })
    const hasResult = computed(() => props.profiles.length > 0 || props.occupations.length > 0)
    const activeIndex = ref(0)

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown)
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        if (props.keyword && hasResult.value) {
          const total = props.profiles.length + props.occupations.length
          activeIndex.value = (activeIndex.value + 1) % total
        }
      }
      if (event.key === 'ArrowUp') {
        if (props.keyword && hasResult.value) {
          const total = props.profiles.length + props.occupations.length
          if (activeIndex.value - 1 >= 0) {
            activeIndex.value = activeIndex.value - 1
          } else {
            activeIndex.value = total - 1
          }
        }
      }
      if (event.key === 'Escale') {
        emit('close-popup')
      }
    }
    
    watch(() => props.keyword, () => {
      activeIndex.value = -1
    })

    watch(() => props.searchBy, () => {
      activeIndex.value = -1
    })

    return {
      searchBySync,
      hasResult,
      activeIndex
    }
  }
})
</script>

<style lang="scss" scoped>
.search-popup__content {
  margin: 0 0 16px;
  padding: 0 12px;
}

.search-loading {
  font-size: 14px;
  padding: 16px 32px;
  line-height: 14px;
  display: flex;
  align-items: center;
}

.search-loading-icon {
  margin-left: 6px;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
  }
}

.search-no-items {
  font-size: 14px;
  padding: 16px 32px;
  line-height: 14px;
}

.rtl-at-root {
  .search-loading-icon {
    margin-left: 0;
    margin-right: 6px;
  }
}
</style>
