<template>
  <div v-if="!alreadyDismissed">
    <button
      :id="tooltipId"
      class="alert-menu-item__status"
      @click.stop.prevent="toggleViewedStatus"
    >
      <FaIcon :icon="['fal', 'times']" />
    </button>
    <BTooltip
      :target="tooltipId"
      triggers="hover"
    >
      Dismiss
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
  name: 'NotificationItemDismiss',
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
      return `alert-dismiss${props.notification.id}`
    })

    const alreadyDismissed = computed(() => {
      return props.notification.status === INotificationStatus.Dismissed
    })

    const toggleViewedStatus = async () => {
      await store.dispatch(
        'notification/updateNotificationStatus',
        {
          notification: props.notification,
          newStatus: INotificationStatus.Dismissed
        }
      )
      context.emit('updated-status')
    }

    return {
      alreadyDismissed,
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
