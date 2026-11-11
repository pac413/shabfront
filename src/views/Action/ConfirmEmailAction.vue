<template>
  <div />
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import { type RouteLocationRaw, useRoute } from 'vue-router'

import { useNotificationAction, useNotificationActionHandlers } from '@/composables'
import type { ActionResult } from '@/types/ActionResult'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'VerifyEmailAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()
    const { confirmEmail } = useNotificationActionHandlers()

    const handleAction = async (action: string): Promise<ActionResult> => {
      const { id: token } = route.params
      let redirect: RouteLocationRaw = { name: 'Register Complete' }
      let message = ''
      let success = false

      switch (action) {
      case 'confirm': {
        const result = await confirmEmail(token as string)
        return { ...result, redirect, action }
      }
      case 'delete': {
        break
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
