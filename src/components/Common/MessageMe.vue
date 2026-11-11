<template>
  <BButton
    v-b-tooltip.hover.bottom="iconOnly && $t('profile.message')"
    size="sm"
    :variant="variant"
    :to="`/messages/${handle}`"
  >
    <FaIcon
      v-if="icon || iconOnly"
      :icon="icon || ['fas', 'comment-alt']"
      :class="{ 'me-1': !iconOnly }"
    />
    <span v-if="icon || !iconOnly">{{ $t('profile.message') }}</span>
  </BButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MessageMe',
  props: {
    handle: {
      type: String,
      required: true,
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      required: false,
      default: null,
    },
    icon: {
      type: Array as () => string[],
      default: null,
    },
  }
})
</script>
