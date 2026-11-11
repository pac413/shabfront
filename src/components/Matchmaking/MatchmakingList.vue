<template>
  <div class="matchmaking-list">
    <div
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="loading"
      :infinite-scroll-distance="INFINITE_SCROLL_DISTANCE"
      :infinite-scroll-throttle-delay="INFINITE_SCROLL_THROTTLE_DELAY"
    >
      <div class="profile-list">
        <MatchmakingDraggableCard
          v-for="profile in data"
          :key="profile.id"
          :profile="profile"
          class="profile-card"
          @drop="$emit('drop', $event)"
        />
      </div>
    </div>

    <Spinner v-if="loading" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { type Profile } from '@/types'
import {
  INFINITE_SCROLL_DISTANCE,
  INFINITE_SCROLL_THROTTLE_DELAY
} from '@/utils'

import MatchmakingDraggableCard from './MatchmakingDraggableCard.vue'

export default defineComponent({
  name: 'MatchmakingList',
  components: {
    MatchmakingDraggableCard,
  },
  props: {
    loading: {
      required: true,
      type: Boolean,
      default: false
    },
    data: {
      required: true,
      type: Array as () => Profile[],
      default: () => []
    }
  },
  emits: ['drop', 'loadMore'],
  setup(_props, { emit }) {
    const loadMore = () => {
      emit('loadMore')
    }
    
    return {
      INFINITE_SCROLL_DISTANCE,
      INFINITE_SCROLL_THROTTLE_DELAY,
      loadMore
    }
  }
})
</script>

<style lang="scss" scoped>
.matchmaking-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.profile-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;

  .profile-card {
    width: calc(50% - 16px);
    height: 245px;
    margin: 8px;
  }
}
</style>
