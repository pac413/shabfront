<template>
  <BNavbarToggle target="shabbat-sidebar" class="toggle-container">
    <FaIcon :icon="['fa', 'bars']" class="toggle-icon" />
    <span v-if="showBadge" class="green-dot" />
  </BNavbarToggle>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toggle',
  props: {
    showBadge: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.toggle-container {
  position: relative;
  padding: 0.75rem;
  margin: -0.75rem;
  outline: none;

  &:active {
    opacity: 0.5;
  }

  .toggle-icon {
    color: $colorRed;
  }

  .green-dot {
    position: absolute;
    top: 6px;
    right: 4px;
  }
}

.rtl-at-root {
  .toggle-container {
    .green-dot {
      right: unset;
      left: 4px;
    }
  }
}
</style>
