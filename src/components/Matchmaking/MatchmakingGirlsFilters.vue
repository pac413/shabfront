<template>
  <MatchmakingFilters
    :model-value="filters"
    :type="MatchmakingType.Girls"
    :visible="visible"
    @change="onFilterChange"
    @clear="onFilterClear"
    @close="$emit('toggle')"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { InitialMatchmakingFilters, type MatchmakingFilterOption, MatchmakingType } from '@/types'

import MatchmakingFilters from './MatchmakingFilters.vue'

export default defineComponent({
  name: 'MatchmakingGirlsFilters',
  components: { MatchmakingFilters },
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    },
    filters: {
      required: true,
      type: Object as () => MatchmakingFilterOption,
    }
  },
  emits: ['change', 'toggle'],
  setup(_, { emit }) {
    const onFilterChange = (newGuysFilters: MatchmakingFilterOption) => {
      emit('change', newGuysFilters)
    }

    const onFilterClear = () => {
      emit('change', InitialMatchmakingFilters)
    }

    return {
      MatchmakingType,
      onFilterChange,
      onFilterClear
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
