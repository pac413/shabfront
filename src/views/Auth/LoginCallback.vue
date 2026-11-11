<template>
  <div class="callback">
    <Spinner />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useToast } from '@/composables'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'LoginCallback',
  async setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()

    const { error } = await store.dispatch('auth/loginRedirect', {
      accessToken: route.query.access_token,
      accessTokenExpiresAt: route.query.access_token_expires_at,
      refreshToken: route.query.refresh_token,
    })

    if (error) {
      return showErrorToast(error)
    }
    router.push('/feed')
  },
})
</script>
