<template>
  <AVMedia
    :media="stream"
    :canv-width="200"
    :canv-height="32"
    :fft-size="32768"
    line-color="#6c757d"
    :line-width="0.5"
    type="waveform"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { AVMedia } from 'vue-audio-visual'

export default defineComponent({
  name: 'AudioVolumeMeter',
  components: {
    AVMedia,
  },
  props: {
    isRecording: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const stream = ref<MediaStream | null>(null)
    watch(
      () => props.isRecording,
      async () => {
        if (props.isRecording) {
          stream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
        } else {
          stream.value = null
        }
      },
      { immediate: true },
    )
    return {
      stream,
    }
  },
})
</script>
