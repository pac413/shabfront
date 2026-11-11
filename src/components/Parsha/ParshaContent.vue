<template>
  <div v-if="selectedParsha">
    <div class="parsha-headline">
      {{ selectedParsha.title }}
    </div>
    <div class="content-container">
      <div class="parsha-content">
        <div
          class="player-desc"
          v-html="$t('parsha.content.parsha-audio-desc')"
        />
        <AudioPlayer
          :poster="selectedParsha.image"
          :src="selectedParsha.url"
        />
        <div class="fine-print">
          {{ $t('parsha.content.copyright') }}
        </div>
      </div>
      <div class="bonus-content">
        <div
          class="player-desc"
          v-html="
            $t('parsha.content.bonus-audio-desc', {
              parsha: selectedParsha.title
            })
          "
        />
        <BOverlay
          v-if="!selectedParsha.bonusUrl"
          show
          class="bonus-placeholder"
          variant="dark"
        >
          <template #overlay>
            Coming soon...
          </template>
          <img
            alt="bonus"
            src="@/assets/img/parsha/bonus-content.png"
          >
        </BOverlay>
        <AudioPlayer
          v-else
          class="bonus-player"
          :src="selectedParsha.bonusUrl"
        />
      </div>
    </div>
  </div>
  <Spinner v-else-if="isLoading" />
  <div
    v-else
    class="text-center"
  >
    {{ $t('parsha.load-error') }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import AudioPlayer from '@/components/Common/AudioPlayer.vue'
import { storeKey } from '@/store'
import type { ParshaAudio } from '@/types'

export default defineComponent({
  name: 'ParshaContent',
  components: { AudioPlayer },
  setup() {
    const store = useStore(storeKey)
    const selectedParsha = computed<ParshaAudio>(() => store.getters['parsha/selectedParsha'])
    const isLoading = computed<boolean>(() => store.getters['parsha/isLoading'])

    return {
      selectedParsha,
      isLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.content-container {
  display: flex;
  margin: 1rem auto;
}

.parsha-content {
  flex: 1;
  margin: 2rem;
}

.bonus-content {
  flex: 1;
  margin: 2rem;
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 265px;
    object-fit: cover;
  }
}

.bonus-placeholder {
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  text-shadow: black 1px 1px 10px;
}

.bonus-player {
  background-image: url(../../assets/img/parsha/bonus-content.png);
}

.player-desc {
  font-size: 1.1rem;
  padding-bottom: 1rem;
}

.fine-print {
  padding-top: 1rem;
  font-size: 0.9rem;
}
</style>
