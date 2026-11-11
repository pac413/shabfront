<template>
  <NotificationMenu
    id="nav-non-messages"
    class="messages-menu"
    :loading="loading"
    :notifications="notifications"
    :total="total"
    :unviewed-total="unviewedTotal"
    @load-more="loadNotifications"
    @popover-hide="loadNotificationsTotal"
    @popover-show="() => loadNotifications(true)"
  >
    <template #target="slotData">
      <slot
        v-bind="slotData"
        name="target"
      />
    </template>

    <template #settings="{ hideMenu }">
      <NonMessageNotificationMenuSettings
        :notifications="notifications"
        @hide-menu="hideMenu"
      />
    </template>
  </NotificationMenu>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'

import NotificationMenu from '@/components/Layout/MainLayout/MainHeader/components/Common/NotificationMenu.vue'
import { storeKey } from '@/store'

import NonMessageNotificationMenuSettings from './NonMessageNotificationMenuSettings.vue'

export default defineComponent({
  name: 'NonMessageNotificationMenu',
  components: { NotificationMenu, NonMessageNotificationMenuSettings },
  setup() {
    const store = useStore(storeKey)
    const notifications = computed(() => store.state.notification.nonMessageNotifications)
    const loading = computed(() => store.state.notification.nonMessageNotificationsLoading)
    const total = computed(() => store.state.notification.nonMessageNotificationsTotal)
    const unviewedTotal = computed(() => store.state.notification.nonMessageNotificationsUnviewedTotal)
    const loadNotifications = (reset: boolean = false) =>  {
      store.dispatch('notification/getNonMessageNotifications', { reset })
    }
    const loadNotificationsTotal = () =>  {
      store.dispatch('notification/getUnviewedNonMessageNotificationsTotal')
    }

    onMounted(() => {
      loadNotificationsTotal()
    })

    return {
      loading,
      loadNotifications,
      loadNotificationsTotal,
      notifications,
      targetId: 'nav-messages',
      total,
      unviewedTotal,
    }
  }
})
</script>

<style lang="scss" scoped>
.messages-menu {
  padding: 0;
}
</style>
