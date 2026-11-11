<template>
  <div :class="alignClass">
    <BSpinner
      :type="type"
      :small="small"
      class="m-2"
      :variant="variant"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export type SpinnerType = 'border' | 'grow'
export type SpinnerAlignment = 'left' | 'right' | 'center'
export type SpinnerVariant = 'danger' | 'light'

export default defineComponent({
  name: 'Spinner',
  props: {
    type: {
      type: String as () => SpinnerType,
      default: 'border'
    },
    small: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String as () => SpinnerAlignment,
      default: 'center',
    },
    variant: {
      type: String as () => SpinnerVariant,
      default: 'danger',
    }
  },
  setup(props) {
    const alignClass = computed(() => {
      switch (props.align) {
      case 'left':
        return 'text-start'
      case 'right':
        return 'text-end'
      case 'center':
      default:
        return 'text-center'
      }
    })

    return {
      alignClass
    }
  }
})
</script>
