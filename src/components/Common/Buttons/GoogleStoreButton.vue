<template>
  <a id="android-href" href="https://play.google.com/store/apps/details?id=com.tribex.shabbat&hl=en">
    <img src="@/assets/img/app_promo/google.png" alt="Google Play" />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GoogleStoreButton',
})
</script>

<style lang="scss" scoped>
img {
  height: 80px;
  object-fit: contain;
}
</style>
