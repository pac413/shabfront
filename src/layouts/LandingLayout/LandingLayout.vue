<template>
  <div class="shabbat-landing pull-if-rtl">
    <LandingHeader />
    <div class="shabbat-landing__content">
      <slot />
    </div>
    <Backdrop />
    <MainFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Backdrop from '@/components/Layout/Common/Backdrop.vue'
import MainFooter from '@/components/Layout/Common/Footer.vue'
import LandingHeader from '@/components/Layout/LandingLayout/LandingHeader.vue'

export default defineComponent({
  name: 'LandingLayout',
  components: { LandingHeader, Backdrop, MainFooter },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.shabbat-landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $colorBackground;
}

.shabbat-landing__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
}
</style>
