<template>
  <div />
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'

import { useNotificationAction, useNotificationActionHandlers } from '@/composables'
import type { ActionResult } from '@/types/ActionResult'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'MessagesByEmailOffAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()
    const { turnOffmessagesByEmail } = useNotificationActionHandlers()

    const handleAction = async (action: string): Promise<ActionResult> => {
      const { userId } = route.params
      let redirect: RouteLocationRaw = { name: 'Message' }
      const result = await turnOffmessagesByEmail(userId as string)
      return { ...result, redirect, action }
    }

    onMounted(async () => {
      const action = getSingleIdFromRouteParam(route.params.action)
      if (!action) {
        return
      }
      const result = await handleAction(action)
      next(result)
    })
  }
})
</script>
