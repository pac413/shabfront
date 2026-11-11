<template>
  <div
    ref="rootRef"
    class="main-layout pull-if-rtl"
    :class="{ 'main-layout--fit-height': fitHeight }"
  >
    <div v-if="isLoading" class="main-layout__loading-container">
      <Spinner />
    </div>
    <template v-else>
      <OuterHeader v-if="limitedHeader" />
      <MainHeader v-else />
      <div class="main-layout__content">
        <slot />
        <GlobalModals />
      </div>
    </template>
    <Backdrop />
    <MainFooter v-if="!authenticated && !isLoading" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type ZenObservable from 'zen-observable'

import GlobalModals from '@/components/GlobalModals/GlobalModals.vue'
import Backdrop from '@/components/Layout/Common/Backdrop.vue'
import MainFooter from '@/components/Layout/Common/Footer.vue'
import MainHeader from '@/components/Layout/MainLayout/MainHeader/MainHeader.vue'
import OuterHeader from '@/components/Layout/OuterLayout/OuterHeader.vue'
import { useToast } from '@/composables'
import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'

export default defineComponent({
  name: 'MainLayout',
  components: { OuterHeader, MainHeader, MainFooter, Backdrop, GlobalModals },
  setup() {
    const rootRef = ref<HTMLDivElement | null>(null)
    const store = useStore(storeKey)
    const globalStore = useGlobalStore()
    const { showSuccessToast } = useToast()
    const authenticated = computed(() => store.state.auth.authenticated)
    const status = computed(() => store.state.auth.status)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const notification = computed(() => store.state.notification.currentNotification)
    const fitHeight = computed(() => {
      const layoutProps = (globalStore.navigatingRoute?.meta.layoutProps || {}) as Record<string, any>
      return layoutProps.fitHeight
    })
    const isLoading = computed(() => {
      const routeMeta = globalStore.navigatingRoute?.meta
      if (!!routeMeta?.layout && routeMeta?.layout !== 'main') {
        return true
      }
      const loading = routeMeta?.requiresAuth && store.state.auth.status === null
      return loading
    })
    const limitedHeader = computed(() => {
      const layoutProps = (globalStore.navigatingRoute?.meta.layoutProps || {}) as Record<string, any>
      return !authenticated.value || status.value === 'incomplete' || layoutProps.limitedHeader
    })

    const subscriptionToMessageNotification = ref<ZenObservable.Subscription | null>(null)
    const subscriptionToNonMessageNotification = ref<ZenObservable.Subscription | null>(null)

    const unsubscribe = (): void => {
      if (subscriptionToMessageNotification.value) {
        subscriptionToMessageNotification.value.unsubscribe()
      }
      if (subscriptionToNonMessageNotification.value) {
        subscriptionToNonMessageNotification.value.unsubscribe()
      }
    }
    const subscribe = async (): Promise<void> => {
      unsubscribe()
      {
        const { data } = await store.dispatch('notification/subscribeToMessageNotifications')
        subscriptionToMessageNotification.value = data
      }
      {
        const { data } = await store.dispatch('notification/subscribeToNonMessageNotifications')
        subscriptionToNonMessageNotification.value = data
      }
    }

    onBeforeUnmount(() => {
      unsubscribe()
    })

    watch(authenticated, async (): Promise<void> => {
      if (authenticated.value) {
        await Promise.all([
          store.dispatch('profile/getActiveProfile'),
          store.dispatch('profile/getOccupations')
        ])
        subscribe()
      }
    }, { immediate: true })

    watch(notification, (): void => {
      if (!notification.value || !rootRef.value) {
        return
      }
      const proxy = getCurrentInstance()?.proxy
      if (!proxy) {
        return
      }

      showSuccessToast(
        notification.value.content,
        notification.value.title
      )
    }, { immediate: true })

    return {
      authenticated,
      fitHeight,
      isAdmin,
      isLoading,
      limitedHeader,
      notification,
      status,
      subscribe,
      subscriptionToMessageNotification,
      subscriptionToNonMessageNotification,
      rootRef,
      unsubscribe
    }
  }
})
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $colorBackground;
  font-family: $bodyFont;
}

.main-layout__loading-container {
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

.main-layout--fit-height {
  height: 100vh;
  overflow: hidden;

  .main-layout__content {
    overflow: hidden;
  }
}

.main-layout__content {
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
  margin: auto;
}
</style>
