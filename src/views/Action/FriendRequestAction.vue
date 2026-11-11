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
  name: 'FriendRequestAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()
    const { approveFriendRequest, rejectFriendRequest } = useNotificationActionHandlers()

    const handleAction = async (action: string): Promise<ActionResult> => {
      const { id: friendshipId } = route.params
      let redirect: RouteLocationRaw = { name: 'Friends' }
      let message = ''
      let success = false
      const back = false

      switch (action) {
      case 'accept': {
        const result = await approveFriendRequest(friendshipId as string)
        return { ...result, action }
      }
      case 'delete': {
        const result = await rejectFriendRequest(friendshipId as string)
        return { ...result, action }
      }
      }

      return {
        message,
        redirect,
        back,
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
