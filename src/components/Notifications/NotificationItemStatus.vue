<template>
  <div>
    <button
      :id="tooltipId"
      class="alert-menu-item__status"
      @click.stop.prevent="toggleViewedStatus"
    >
      <FaIcon :icon="['fal', 'comment']" />
    </button>
    <BTooltip
      :target="tooltipId"
      triggers="hover"
    >
      {{ $t(`notifications.${hasBeenRead ? 'mark-as-unread' : 'mark-as-read'}`) }}
    </BTooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { INotificationStatus } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Notification } from '@/types'

export default defineComponent({
  name: 'NotificationItemStatus',
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  emits: ['updated-status'],
  setup(props, context) {
    const store = useStore(storeKey)
    const tooltipId = computed(() => {
      return `alert-status${props.notification.id}`
    })

    const hasBeenRead = computed(() => {
      return props.notification.status === INotificationStatus.Read
    })

    const toggleViewedStatus = () => {
      const { status } = props.notification
      store.dispatch(
        'notification/updateNotificationStatus',
        {
          notification: props.notification,
          newStatus: status === INotificationStatus.Viewed ? INotificationStatus.Read : INotificationStatus.Viewed
        }
      )

      context.emit('updated-status')
    }

    return {
      hasBeenRead,
      toggleViewedStatus,
      tooltipId,
    }
  }
})
</script>

<style lang="scss" scoped>
.alert-menu-item__status {
  width: 32px;
  height: 32px;
}
</style>
