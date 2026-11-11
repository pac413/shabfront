<template>
  <div class="dropzone-container px-4">
    <dropzone
      :type="MatchmakingType.Guys"
      :profile="currentGuy"
      :placeholder="$t('matchmaking-view.drop-guy-here')"
      @drop="onDrop"
    />
    <dropzone
      class="my-4"
      :type="MatchmakingType.Girls"
      :profile="currentGirl"
      :placeholder="$t('matchmaking-view.drop-girl-here')"
      @drop="onDrop"
    />
    <BButton
      variant="primary"
      class="filter-button my-2"
      @click="$emit('match')"
    >
      {{ $t('matchmaking-view.make-a-match') }}
    </BButton>
    <BButton
      variant="secondary"
      class="filter-button my-2"
      @click="$emit('clear')"
    >
      {{ $t('matchmaking-view.clear') }}
    </BButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Dropzone from '@/components/Matchmaking/Dropzone.vue'
import { MatchmakingType, type Profile } from '@/types'

export default defineComponent({
  name: 'MatchmakingDropzone',
  components: { Dropzone },
  props: {
    currentGuy: {
      type: Object as () => Profile | null,
      default: null
    },
    currentGirl: {
      type: Object as () => Profile | null,
      default: null
    }
  },
  emits: ['match', 'clear', 'select'],
  setup(_, { emit }) {
    const onDrop = (type: MatchmakingType, profile: Profile | null) => {
      emit('select', type, profile)
    }
    
    return {
      MatchmakingType,
      onDrop
    }
  }
})
</script>

<style lang="scss" scoped>
.dropzone-container {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filter-button {
  display: flex;
  align-items: center;

  &:first-child {
    margin-left: 0px;
  }

  @media (max-width: $mobileMaxWidth) {
    padding: 5px 10px;
  }
}
</style>
