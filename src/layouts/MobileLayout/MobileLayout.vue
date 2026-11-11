<template>
  <div class="mobile-layout pull-if-rtl">
    <div v-if="isLoading" class="mobile-layout__loading-container">
      <Spinner />
    </div>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'

export default defineComponent({
  name: 'MobileLayout',
  setup() {
    const store = useStore(storeKey)
    const globalStore = useGlobalStore()
    const isLoading = computed(() => {
      const loading = globalStore.navigatingRoute?.meta.requiresAuth && store.state.auth.status === null
      return loading
    })
    return {
      isLoading
    }
  },
})
</script>

<style lang="scss" scoped>
.mobile-layout {
  height: 100vh;
  background-color: $colorBackground;
  font-family: $bodyFont;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-layout__loading-container {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: $colorBackground;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
