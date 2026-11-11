<template>
  <div class="outer-layout pull-if-rtl">
    <OuterHeader />
    <div class="outer-layout__content">
      <slot />
      <GlobalModals />
    </div>
    <Backdrop />
    <MainFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import GlobalModals from '@/components/GlobalModals/GlobalModals.vue'
import Backdrop from '@/components/Layout/Common/Backdrop.vue'
import MainFooter from '@/components/Layout/Common/Footer.vue'
import OuterHeader from '@/components/Layout/OuterLayout/OuterHeader.vue'

export default defineComponent({
  name: 'OuterLayout',
  components: { OuterHeader, Backdrop, MainFooter, GlobalModals },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.outer-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $colorBackground;
}

.outer-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  margin: 0 auto;
}
</style>
