<template>
  <div class="guests-avatar-list">
    <GuestsAvatarItem
      v-for="invitation in invitations"
      :key="invitation.id"
      :invitation="invitation"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { type InviteDetail } from '@/types'

import GuestsAvatarItem from './GuestsAvatarItem.vue'

export default defineComponent({
  name: 'GuestsAvatarList',
  components: {
    GuestsAvatarItem,
  },
  props: {
    invitations: {
      type: Array as () => InviteDetail[],
      required: true,
    },
  }
})
</script>
