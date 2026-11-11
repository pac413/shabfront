<template>
  <a id="ios-href" href="https://itunes.apple.com/us/app/id1037705799">
    <img src="@/assets/img/app_promo/ios.png" alt="App Store" />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppStoreButton',
})
</script>

<style lang="scss" scoped>
img {
  height: 80px;
  object-fit: contain;
}
</style>
