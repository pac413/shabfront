<template>
  <div
    id="app"
    :class="classes"
    data-view
  >
    <LandingLayout
      v-if="layout === 'landing-layout'"
      v-bind="layoutProps"
    >
      <RouterView />
    </LandingLayout>
    <MainLayout
      v-else-if="layout === 'main-layout'"
      v-bind="layoutProps"
    >
      <RouterView />
    </MainLayout>
    <MobileLayout
      v-else-if="layout === 'mobile-layout'"
      v-bind="layoutProps"
    >
      <RouterView />
    </MobileLayout>
    <OuterLayout
      v-else-if="layout === 'outer-layout'"
      v-bind="layoutProps"
    >
      <RouterView />
    </OuterLayout>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { computed, defineComponent, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import LandingLayout from '@/layouts/LandingLayout/LandingLayout.vue'
import MainLayout from '@/layouts/MainLayout/MainLayout.vue'
import MobileLayout from '@/layouts/MobileLayout/MobileLayout.vue'
import OuterLayout from '@/layouts/OuterLayout/OuterLayout.vue'
import { DEFAULT_META_OPTIONS, DEFAULT_TITLE } from '@/utils/consts'

import { useIsRtl } from './composables/useIsRtl'
import i18n from './plugins/i18n'
import { storeKey } from './store'
import { useGlobalStore } from './stores/global'
import { defineAbbreviatedLocale,session } from './utils'
import { SessionEvent } from './utils/session'

const DEFAULT_LAYOUT = 'main'

export default defineComponent({
  name: 'App',
  components: {
    LandingLayout,
    MainLayout,
    MobileLayout,
    OuterLayout,
    RouterView,
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const { isRtl } = useIsRtl()
    const globalStore = useGlobalStore()

    const classes = computed(() => `locale-${globalStore.language.locale}`)

    const layout = computed(() => {
      // Avoid main-layout appear for initial loading by default
      if (route.fullPath === '/' && !route.meta.layout) {
        return 'main-layout'
      }
      return `${(route.meta.layout || DEFAULT_LAYOUT)}-layout`
    })

    const layoutProps = computed(() => route.meta.layoutProps || {})

    const logout = async () => {
      await store.dispatch('auth/logout', { router })
    }

    const onAccessToken = async (newAccessToken: string) => {
      if (!newAccessToken) {
        return
      }
      const { error } = await store.dispatch('auth/loginWithToken')
      if (error) { return }
      router.replace('/feed')
    }

    session.on(SessionEvent.Logout, logout)
    session.on(SessionEvent.AccessToken, onAccessToken)
    defineAbbreviatedLocale()

    watch(isRtl, () => {
      if (isRtl.value) {
        document.body.classList.add('rtl-at-root')
      } else {
        document.body.classList.remove('rtl-at-root')
      }
    }, { immediate: true })

    watch(() => globalStore.language, () => {
      i18n.global.locale.value = globalStore.language.locale
    }, { immediate: true })

    useHead({
      title: DEFAULT_TITLE,
      meta: DEFAULT_META_OPTIONS,
    })

    return {
      classes,
      isRtl,
      layout,
      layoutProps,
      logout,
      onAccessToken,
    }
  }
})
</script>

<style lang="scss">
.locale-ru {
  &, .main-layout, .header-container, h1, h2, h3, h4, h5, h6 {
    font-family: 'Source Sans Pro', Arial, sans-serif !important;
  }
}

.rtl-at-root {
  &, .main-layout, .header-container, h1, h2, h3, h4, h5, h6 {
    font-family: 'Heebo', Arial, sans-serif !important;
  }
}

.hide-modal-header {
  display: none !important;
}
</style>
