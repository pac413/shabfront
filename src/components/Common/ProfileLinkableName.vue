<template>
  <RouterLink
    v-if="profile"
    :to="{ name: 'Profile', params: { handle: profile.handle } }"
  >
    <b>{{ profile.displayName }}</b>
  </RouterLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type { ISimpleProfile } from '@/composables/graphql/generated'

/**
 * Common component to display a profile name and link to their handle
 *
 * @param profile Profile/SimpleProfile containing name and handle
 *
 */
export default defineComponent({
  name: 'ProfileLinkableName',
  props: {
    profile: {
      type: Object as () => ISimpleProfile,
      required: true,
    },
  }
})
</script>
