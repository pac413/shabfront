<template>
  <div class="overlay-menu-section">
    <div v-if="title" class="overlay-menu-section__title">
      {{ title }}
    </div>
    <div class="overlay-menu-section__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OverlayMenuSection',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped>
.overlay-menu-section {
  width: 100%;
  color: $secondary;

  &:not(:last-child) {
    .overlay-menu-section__content {
      padding-bottom: 5px;
      border-bottom: 1px solid $gray-300;
    }
  }

  &:not(:first-child) {
    padding-top: 5px;
  }
}

.overlay-menu-section__title {
  width: 100%;
  font-size: 13px;
  margin-top: 3px;
  margin-bottom: 3px;
  font-weight: 500;
}

.overlay-menu-section__content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
