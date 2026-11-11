<template>
  <div class="invite-avatar-wrapper">
    <ProfileAvatar
      :id="avatarId"
      linkable
      class="avatar"
      rounded="lg"
      thumbnail="large"
      linkable-target="_blank"
      :profile="profile"
    />
    <BTooltip
      :target="`#${avatarId}`"
      triggers="hover"
      placement="bottom"
      boundary="window"
    >
      <span>
        {{ profile.displayName }}
      </span>
    </BTooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { type Profile } from '@/types'

export default defineComponent({
  name: 'InviteAvatar',
  components: {
    ProfileAvatar
  },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
  },
  setup(props) {
    const avatarId = computed(() => `invite-avatar-${props.profile.id}`)

    return {
      avatarId
    }
  }
})
</script>

<style lang="scss" scoped>
.invite-avatar-wrapper {
  .avatar {
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.3);
  }
}
</style>
