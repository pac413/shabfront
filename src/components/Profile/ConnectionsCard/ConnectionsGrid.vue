<template>
  <div
    ref="gridContainer"
    @scroll="debouncedOnScroll"
  >
    <div class="my-friends-grid">
      <ConnectionItem
        v-for="item in profiles"
        :key="item"
        :type="type"
        :profile-id="item"
      />
    </div>
    <Spinner v-if="loading" />
    <div
      v-else-if="!profiles || profiles.length === 0"
      class="text-secondary text-center p-4"
    >
      {{ $t(`profile-view.friends.no-${type}`) }}
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { defineComponent } from 'vue'

import ConnectionItem from '@/components/Profile/ConnectionsCard/ConnectionItem.vue'
import { checkIfScrolledOverPercentage, type ConnectionTypes } from '@/utils'

export default defineComponent({
  name: 'ConnectionsGrid',
  components: {
    ConnectionItem,
  },
  props: {
    profiles: {
      type: Array as () => string[],
      required: true,
    },
    type: {
      type: String as () => ConnectionTypes,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['load-more'],
  setup(props, { emit }) {
    const debouncedOnScroll = debounce(onScroll, 100)

    function onScroll() {
      if (checkIfScrolledOverPercentage()) {
        emit('load-more')
      }
    }

    return {
      debouncedOnScroll,
    }
  },
})
</script>

<style lang="scss" scoped>
.my-friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 8rem);
  grid-row-gap: 0.5rem;
  column-gap: 0.5rem;
  justify-content: flex-start;
  font-size: .9rem;
}
</style>
