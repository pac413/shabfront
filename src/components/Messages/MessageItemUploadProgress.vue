<template>
  <RadialProgress
    :start-color="progressStartColor"
    :stop-color="progressStopColor"
    :diameter="50"
    :stroke-width="5"
    :inner-stroke-width="5"
    :completed-steps="sentBytes"
    :total-steps="totalBytes"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import RadialProgress from 'vue3-radial-progress'

import { getStyleVariable } from '@/utils'

export default defineComponent({
  name: 'MessageItemUploadProgress',
  components: { RadialProgress },
  props: {
    sentBytes: {
      type: Number,
      default: 0,
    },
    totalBytes: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const progressStartColor = computed(() => {
      return getStyleVariable('colorRed')
    })

    const progressStopColor = computed(() => {
      return `${getStyleVariable('colorRed')}CC`
    })

    return {
      progressStartColor,
      progressStopColor,
    }
  },
})
</script>
