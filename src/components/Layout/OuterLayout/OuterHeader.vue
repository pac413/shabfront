<template>
  <div class="navbar header-container">
    <div class="container h-100">
      <div class="w-100 d-flex align-items-center justify-content-between pull-if-rtl">
        <logo theme="crimson" />

        <div v-if="authenticated" class="header-btns d-flex align-items-center">
          <BButton class="nav-button" variant="light" @click="onLogout">
Logout
</BButton>
        </div>
        <div v-else class="header-btns d-flex align-items-center">
          <RouterLink :to="{ name: 'Login' }">
            <BButton class="nav-button" variant="light">
              {{ $t('outer-header.login') }}
            </BButton>
          </RouterLink>

          <RouterLink :to="{ name: 'Landing' }">
            <BButton class="nav-button" variant="light">
              {{ $t('outer-header.register') }}
            </BButton>
          </RouterLink>

          <SelectLanguage class="nav-dropdown" variant="light" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Logo from '@/components/Layout/Common/Logo.vue'
import SelectLanguage from '@/components/Layout/Common/SelectLanguage.vue'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'OuterHeader',
  components: { Logo, SelectLanguage },
  setup() {
    const store = useStore(storeKey)
    const router = useRouter()
    const authenticated = computed(() => store.state.auth.authenticated)
    const onLogout = () => store.dispatch('auth/logout', { router })

    return {
      authenticated,
      onLogout,
    }
  },
})
</script>

<style scoped lang="scss">
@import '../header.scss';

.navbar {
  padding: 0.5rem 1rem;
}

:deep(.dropdown-toggle.btn-light) {
  background-color: $colorLightGrey2;
}
</style>
