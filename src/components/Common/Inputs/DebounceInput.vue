<template>
  <BFormInput
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @blur="handleInputBlur"
  />
</template>

<script lang="ts">
import { debounce, type DebouncedFunc } from 'lodash'
import { defineComponent, ref, watch } from 'vue'

/**
 * <BFormInput> component with debounce event
 */
export default defineComponent({
  name: 'DebounceInput',
  props: {
    modelValue: {
      type: [String, Number] as unknown as () => (string | number),
      default: ''
    },
    timeout: {
      type: Number,
      default: 275
    },
  },
  emits: ['update:modelValue', 'change', 'debounce', 'blur', 'input'],
  setup(props, context) {
    const handleInputChange = (value: string | number): void => {
      context.emit('debounce', value)
    }
    const debounceFunc = ref<DebouncedFunc<(value: string | number) => void>>(
      debounce(handleInputChange, props.timeout)
    )
    const handleInputBlur = () => {
      // Stop debounce function and just call blur event handler
      debounceFunc.value.cancel()
      context.emit('blur')
    }

    watch(() => props.modelValue, (value: string | number) => {
      debounceFunc.value(value)
    })
    watch(() => props.timeout, () => {
      debounceFunc.value = debounce(handleInputChange, props.timeout)
    })

    return {
      handleInputBlur
    }
  }
})
</script>
