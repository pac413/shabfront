<template>
  <div />
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'

import { useNotificationAction } from '@/composables'
import { useHostingByIdQuery } from '@/composables/graphql/generated'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'HostEndorsementRequestAction',
  setup() {
    const route = useRoute()
    const { next } = useNotificationAction()
    const hostingId = computed(() => getSingleIdFromRouteParam(route.params.hostingId))
    const { onResult } = useHostingByIdQuery(
      { id: hostingId.value },
      { fetchPolicy: 'cache-first' }
    )
    
    onResult((result) => {
      if (result.loading) {
        return
      }
      const handle = result.data?.hostingById?.host.handle
      const action = getSingleIdFromRouteParam(route.params.action)
      if (!action) {
        return
      }
      if (!handle) {
        return next({
          action,
          redirect: '/',
          message: 'Something is wrong',
          success: true,
        })
      }

      const redirect: RouteLocationRaw = {
        name: 'Profile',
        params: {
          handle,
        },
        query: {
          endorsementModal: 'host',
          hostingId: route.params.hostingId,
        }
      }
      return next({
        action,
        redirect,
        message: '',
        success: true,
      })
    })
  }
})
</script>
