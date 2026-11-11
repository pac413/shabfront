<template>
  <div class="navbar header-container shabbat-landing__header">
    <div class="container h-100">
      <div class="w-100 d-flex align-items-center justify-content-between pull-if-rtl">
        <logo theme="crimson" />

        <div class="header-btns d-flex align-items-center">
          <a :href="DONATE_SHABBAT_LINK">
            <BButton class="nav-button" variant="light">
              {{ $t('outer-landing-header.donate') }}
            </BButton>
          </a>

          <RouterLink :to="{ name: 'Login' }">
            <BButton class="nav-button" variant="light">
              {{ $t('outer-landing-header.login') }}
            </BButton>
          </RouterLink>

          <SelectLanguage class="nav-dropdown" variant="light" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Logo from '@/components/Layout/Common/Logo.vue'
import SelectLanguage from '@/components/Layout/Common/SelectLanguage.vue'
import { DONATE_SHABBAT_LINK } from '@/utils'

export default defineComponent({
  name: 'LandingHeader',
  components: {
    Logo,
    SelectLanguage,
  },
  setup() {
    return { DONATE_SHABBAT_LINK }
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
