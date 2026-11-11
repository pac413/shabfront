<template>
  <div />
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useNotificationActionHandlers } from '@/composables'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'HostingAction',
  setup() {
    const route = useRoute()
    const { acceptHostingRequest, deleteHostingRequest } = useNotificationActionHandlers()

    const handleAction = (action: string) => {
      const hostingId = getSingleIdFromRouteParam(route.params.id)
      if (!hostingId) {
        return
      }

      switch (action) {
      case 'accept':
        acceptHostingRequest(hostingId)
        break
      case 'decline':
        deleteHostingRequest(hostingId)
        break
      default:
        break
      }
    }

    onMounted(() => {
      const action = getSingleIdFromRouteParam(route.params.action)
      if (!action) {
        return
      }
      handleAction(action)
    })
  }
})
</script>
