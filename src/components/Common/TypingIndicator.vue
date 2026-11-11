<template>
  <div class="typing-indicator">
    <slot />
    <span class="typing-indicator__dot">.</span>
    <span class="typing-indicator__dot">.</span>
    <span class="typing-indicator__dot">.</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Typing indictor component which shows animating ... at the end of the main slot
 *
 * Usage
 * <typing-indicator>
 *  <span>User A is typing</span>
 * </typing-indicator>
 *
 * This will render `User A typing...`
 *
 */
export default defineComponent({
  name: 'TypingIndicator',
})
</script>

<style lang="scss" scoped>
.typing-indicator__dot {
  animation: 1s blink infinite;
  font-weight: bold;
  font-size: 14px;
  margin: 0 1px;

  &:nth-child(2) {
    animation-delay: 250ms;
  }
  &:nth-child(3) {
    animation-delay: 500ms;
  }
}

@keyframes blink {
  50% {
    color: transparent;
  }
}
</style>
