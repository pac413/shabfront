<template>
  <div>
    <button
      v-b-tooltip.hover
      class="alert-menu-item__status"
      :title="$t(`notifications.${hasBeenRead ? 'mark-as-unread' : 'mark-as-read'}`)"
      @click.stop.prevent="toggleViewedStatus"
    >
      <FaIcon :icon="['fal', 'comment']" />
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { INotificationStatus } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Notification } from '@/types'

export default defineComponent({
  name: 'NotificationMenuItemStatus',
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const hasBeenRead = computed(() => props.notification.status === INotificationStatus.Read)
    const toggleViewedStatus = () => {
      const { status } = props.notification
      store.dispatch(
        'notification/updateNotificationStatus',
        {
          notification: props.notification,
          newStatus: status === INotificationStatus.Viewed ? INotificationStatus.Read : INotificationStatus.Viewed
        }
      )
    }

    return {
      hasBeenRead,
      toggleViewedStatus,
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
