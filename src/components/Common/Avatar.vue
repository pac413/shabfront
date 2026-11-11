<template>
  <BAvatar v-bind="props" @click="$emit('click')"/>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { getInitials } from '@/utils'

/**
 * Common component to show avatar and initials in case of no avatar image
 *
 * This component benefits bootstrap avatar component
 * and make it available for all the props required by b-avatar component.
 *
 * Here is the reference to bootstrap avatar component
 * https://bootstrap-vue.org/docs/components/avatar
 */
export default defineComponent({
  name: 'Avatar',
  props: {
    text: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['click'],
  setup(props, context) {
    const initials = computed(() => (props.text ? getInitials(props.text) : ''))
    const newProps = computed(() => ({
      ...context.attrs,
      text: initials.value,
    }))

    return {
      props: newProps,
    }
  },
})
</script>

<style lang="scss" scoped>
.b-avatar img {
  object-fit: cover;
}

span.b-avatar {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
