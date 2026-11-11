<template>
  <div />
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import type{ RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'

import { useNotificationAction } from '@/composables'
import type { ActionResult } from '@/types/ActionResult'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'EndorseBackAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()

    const handleAction = (action: string): ActionResult => {
      if (action === 'accept') {
        const { endorserHandle, endorsementType } = route.params

        const redirect: RouteLocationRaw = {
          name: 'Profile',
          params: {
            handle: endorserHandle,
          },
          query: {
            endorsementModal: endorsementType,
            endorsingBack: 'true'
          }
        }
        return {
          action,
          redirect,
          message: '',
          success: true,
        }
      }
      return {
        action,
        message: '',
        success: true,
      }
    }

    onMounted(() => {
      const action = getSingleIdFromRouteParam(route.params.action)
      if (!action) {
        return
      }
      const result = handleAction(action)
      next(result)
    })
  }
})
</script>
