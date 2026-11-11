<template>
  <div class="notification-settings">
    <BButton
      class="notification-settings__link"
      variant="text-dark"
      @click.stop="viewAll"
    >
      <FaIcon
        :icon="['fal', 'eye']"
        class="me-1"
      />
      <span v-t="{ path: 'main-header.alerts.view-in-inbox' }"></span>
    </BButton>
    <div class="divider" />
    <BButton
      class="notification-settings__link"
      variant="text-dark"
      @click="dismissAll"
    >
      <FaIcon
        :icon="['fal', 'times']"
        class="me-1"
      />
      <span v-t="{ path: 'main-header.alerts.dismiss-all' }"></span>
    </BButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { INotificationStatus } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Notification } from '@/types'

export default defineComponent({
  name: 'NonMessageNotificationMenuSettings',
  props: {
    notifications: {
      type: Array as () => Notification[],
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props, context) {
    const store = useStore(storeKey)
    const router = useRouter()

    const dismissAll = () => {
      context.emit('hide-menu')
      for (const notification of props.notifications) {
        if (notification.status !== INotificationStatus.Dismissed) {
          store.dispatch(
            'notification/updateNotificationStatus',
            {
              notification,
              newStatus: INotificationStatus.Dismissed
            }
          )
        }
      }
    }
    const viewAll = () => {
      context.emit('hide-menu')
      nextTick(() => {
        router.push('/notifications')
      })
    }

    return {
      dismissAll,
      viewAll,
    }
  }
})
</script>

<style lang="scss" scoped>
.notification-settings {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
