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
  name: 'MessageRequestAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()
    const { acceptMessageRequest, deleteMessageRequest } = useNotificationActionHandlers()

    const handleAction = async (action: string): Promise<ActionResult> => {
      const { id: conversationId } = route.params
      let redirect: RouteLocationRaw = {
        name: 'Profile'
      }
      let message = ''
      let success = false

      switch (action) {
      case 'accept': {
        const result = await acceptMessageRequest(conversationId as string)
        return { ...result, action }
      }
      case 'delete': {
        const result = await deleteMessageRequest(conversationId as string)
        return { ...result, action }
      }
      }

      return {
        message,
        redirect,
        action,
        success
      }
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
