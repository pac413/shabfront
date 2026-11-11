<template>
  <span> {{ displayDateString }} </span>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useGlobalStore } from '@/stores/global'
import { getAgoString } from '@/utils'

/**
 * Common component to show the ago string
 */
export default defineComponent({
  name: 'AgoString',
  props: {
    date: {
      type: String,
      required: true,
    },
    abbreviate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const globalStore = useGlobalStore()
    const displayDateString = ref<string>('')
    const handle = ref<NodeJS.Timeout | null>(null)

    const updateDisplayString = () => {
      displayDateString.value = getAgoString(props.date, props.abbreviate)
    }

    onMounted(() => {
      updateDisplayString()
      handle.value = setInterval(() => updateDisplayString(), 60000)
    })

    onBeforeUnmount(() => {
      if (handle.value) {
        clearInterval(handle.value)
      }
    })

    watch(() => props.date, updateDisplayString)
    watch(() => globalStore.language, updateDisplayString)
    watch(() => props.abbreviate, updateDisplayString)

    return {
      displayDateString,
    }
  },
})
</script>
