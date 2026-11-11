<template>
  <div
    class="audio-player"
    :style="poster ? { 'background-image': `url(${poster})` } : {}"
  >
    <div class="play-btn" @click="playAudio" />
    <Player ref="audio">
      <VmAudio :key="src" cross-origin="anonymous">
        <source type="audio/mp3" :src="src" />
      </VmAudio>

      <DefaultUi no-settings />
    </Player>
  </div>
</template>

<script lang="ts">
import '@vime/core/themes/default.css'

import { Audio as VmAudio, DefaultUi, Player } from '@vime/vue-next'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AudioPlayer',
  components: {
    Player,
    VmAudio,
    DefaultUi,
  },
  props: {
    poster: {
      type: String,
      default: null,
    },
    src: {
      type: String,
      required: true,
    },
  },
  setup() {
    const audio = ref<HTMLAudioElement | null>(null)
    const playAudio = () => {
      if (!audio.value) {
        return
      }
      if (audio.value.paused) {
        audio.value.play()
      } else {
        audio.value.pause()
      }
    }
    return {
      audio,
      playAudio,
    }
  },
})
</script>

<style lang="scss" scoped>
.audio-player {
  min-height: 265px;
  min-width: 300px;
  background-color: black;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  .play-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  audio {
    flex: 0 0 auto;
    width: 100%;
    padding: 2px;
  }
}

:deep(vm-player) {
  --vm-controls-bg: rgba(0, 0, 0, 0.85);
}
</style>
