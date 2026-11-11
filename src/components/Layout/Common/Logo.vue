<template>
  <BNavbarBrand class="logo">
    <RouterLink :to="logoUrl">
      <template v-if="theme === 'crimson'">
        <img
          src="@/assets/img/shabbat-logo-crimson.png"
          alt="Logo"
        >
      </template>
      <template v-else>
        <img
          src="@/assets/img/shabbat-logo.png"
          alt="Logo"
        >
      </template>
    </RouterLink>
  </BNavbarBrand>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'

export default defineComponent({
  name: 'Logo',
  props: {
    theme: {
      type: String as () => 'crimson' | 'white',
      default: 'white',
    },
  },
  setup() {
    const store = useStore(storeKey)
    const authenticated = computed(() => store.state.auth.authenticated)
    const status = computed(() => store.state.auth.status)
    const logoUrl = computed(() => authenticated.value && status.value === 'active' ? '/feed' : '/')

    return {
      authenticated,
      logoUrl,
      status,
    }
  }
})
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  width: auto;
  height: 50px;

  img {
    max-width: 150px;
    height: 100%;
    object-fit: contain;
  }
}
</style>
