<template>
  <NotificationMenu
    :id="targetId"
    class="messages-menu"
    :loading="loading"
    :notifications="notifications"
    :total="total"
    :unviewed-total="unviewedTotal"
    @load-more="loadNotifications"
    @popover-hide="loadNotificationsTotal"
    @popover-show="loadNotifications(true)"
  >
    <template #target="slotData">
      <slot
        v-bind="slotData"
        name="target"
      />
    </template>

    <template #settings="{ hideMenu }">
      <MessageNotificationMenuSettings
        :notifications="notifications"
        @hide-menu="hideMenu"
      />
    </template>

    <template #empty>
      {{ $t('notifications.empty-messages') }}
    </template>
  </NotificationMenu>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'

import NotificationMenu from '@/components/Layout/MainLayout/MainHeader/components/Common/NotificationMenu.vue'
import { storeKey } from '@/store'

import MessageNotificationMenuSettings from './MessageNotificationMenuSettings.vue'

export default defineComponent({
  name: 'MessageNotificationMenu',
  components: { NotificationMenu, MessageNotificationMenuSettings },
  setup() {
    const store = useStore(storeKey)
    const notifications = computed(() => store.state.notification.messageNotifications)
    const loading = computed(() => store.state.notification.messageNotificationsLoading)
    const total = computed(() => store.state.notification.messageNotificationsTotal)
    const unviewedTotal = computed(() => store.state.notification.messageNotificationsUnviewedTotal)

    const loadNotifications = (reset: boolean = false) => {
      store.dispatch('notification/getMessageNotifications', { reset })
    }

    const loadNotificationsTotal = () => {
      store.dispatch('notification/getUnviewedMessageNotificationsTotal')
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
