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
  name: 'ReferencesRequestAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()
    const { acceptReferenceRequest, deleteReferenceRequest } = useNotificationActionHandlers()

    const handleAction = async (action: string): Promise<ActionResult> => {
      const { id: requestId } = route.params
      const redirect: RouteLocationRaw = { name: 'Profile' }
      let message = ''
      let success = false

      switch (action) {
      case 'accept': {
        const result = await acceptReferenceRequest(requestId as string)
        return { ...result, action, redirect }
      }
      case 'delete': {
        const result = await deleteReferenceRequest(requestId as string)
        return { ...result, action, redirect }
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
