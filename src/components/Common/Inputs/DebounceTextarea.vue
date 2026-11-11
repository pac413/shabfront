<template>
  <BFormTextarea
    v-bind="attrs"
  />
</template>

<script lang="ts">
import { debounce, type DebouncedFunc } from 'lodash'
import { computed, defineComponent, ref, watch } from 'vue'

/**
 * BFormTextarea component with debounce event
 */
export default defineComponent({
  name: 'DebounceTextarea',
  props: {
    timeout: {
      type: Number,
      default: 275
    },
  },
  emits: ['debounce', 'blur'],
  setup(props, context) {
    const handleInputChange = (value: string): void => {
      context.emit('debounce', value)
    }
    const debounceFunc = ref<DebouncedFunc<(value: string) => void>>(
      debounce(handleInputChange, props.timeout)
    )
    const handleInputBlur = () => {
      // Stop debounce function and just call blur event handler
      debounceFunc.value.cancel()
      context.emit('blur')
    }
    const attrs = computed(() => ({
      ...context.attrs,
      blur: handleInputBlur,
    }))

    watch(() => context.attrs.modelValue as string, (value: string) => {
      debounceFunc.value(value)
    })
    watch(() => props.timeout, () => {
      debounceFunc.value = debounce(handleInputChange, props.timeout)
    })

    return {
      attrs
    }
  }
})
</script>
