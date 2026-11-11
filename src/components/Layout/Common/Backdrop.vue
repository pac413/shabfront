<template>
  <transition name="fade">
    <div v-if="showBackdrop" class="backdrop" />
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useGlobalStore } from '@/stores/global'

export default defineComponent({
  name: 'Backdrop',
  setup() {
    const globalStore = useGlobalStore()
    const showBackdrop = computed(() => globalStore.showBackdrop)

    return {
      showBackdrop,
    }
  },
})
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
  z-index: 9999;
}
</style>
