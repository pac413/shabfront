<template>
  <div class="guests-avatar-item mx-1 my-1">
    <ProfileAvatar
      :id="avatarId"
      linkable
      class="guests-avatar-item__avatar"
      size="35px"
      linkable-target="_blank"
      :profile="invitation.guest"
    />
    <BTooltip
      :target="`#${avatarId}`"
      triggers="hover"
      placement="bottom"
    >
      <IconItem
        v-if="invitation.status"
        :icon="statusIcon"
      />
      <span>
        {{ guestDisplayName }}
      </span>
    </BTooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { type InviteDetail } from '@/types'
import { statusIcon } from '@/utils'

export default defineComponent({
  name: 'GuestsAvatarItem',
  components: { ProfileAvatar },
  props: {
    invitation: {
      type: Object as () => InviteDetail,
      required: true,
    },
  },
  setup(props) {
    return {
      avatarId: `guests-avatar-item-${props.invitation.guest.id}`,
      guestDisplayName: props.invitation.guest.displayName,
      statusIcon: statusIcon(props.invitation.status),
    }
  }
})
</script>

<style lang="scss" scoped>
.guests-avatar-item {
  display: inline-block;
}
</style>
