<template>
  <div>
    <button
      v-b-tooltip.hover
      class="alert-menu-item__status"
      title="Dismiss"
      @click.stop.prevent="toggleViewedStatus"
    >
      <FaIcon :icon="['fal', 'times']" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

import { INotificationStatus } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Notification } from '@/types'

export default defineComponent({
  name: 'NotificationMenuItemDismiss',
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const toggleViewedStatus = async () => {
      await store.dispatch(
        'notification/updateNotificationStatus',
        {
          notification: props.notification,
          newStatus: INotificationStatus.Dismissed
        }
      )
    }
    return {
      toggleViewedStatus,
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
