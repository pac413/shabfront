<template>
  <div
    v-if="profile"
    class="connection-item"
  >
    <BFormCheckbox
      v-if="selecting"
      button-variant="secondary"
      class="connection-item__checkbox checkbox-red"
      :model-value="selected"
      :value="profile.id"
      @change="onSelect"
    />
    <ProfileOverlayMenu
      :profile="profile"
      :target="overlayMenuTargetId"
      class="connection-item__more more-menu"
    />

    <RouterLink
      target="_blank"
      :to="{ name: 'Profile', params: { handle: profile.handle } }"
    >
      <ProfileAvatar
        linkable
        class="avatar"
        rounded="xl"
        size="8rem"
        thumbnail="large"
        :profile="profile"
      />
      <span class="connection-item__details link-unstyled">{{ fullName }}</span>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import { storeKey } from '@/store'
import type { Profile } from '@/types'
import { type ConnectionTypes } from '@/utils'

export default defineComponent({
  name: 'ConnectionItem',
  components: {
    ProfileOverlayMenu,
    ProfileAvatar
  },
  props: {
    profileId: {
      type: String,
      required: true,
    },
    type: {
      type: String as () => ConnectionTypes,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    selecting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select'],
  setup(props, context) {
    const store = useStore(storeKey)
    const getProfile = computed<(id: string) => (Profile | undefined)>(
      () => store.getters['connections/getProfile']
    )

    const profile = computed(() => {
      return getProfile.value(props.profileId)
    })

    const thumbnail = computed(() => {
      const { avatar } = profile.value!
      return avatar && (avatar.medium || avatar.original)
    })

    const fullName = computed(() => {
      return profile.value!.displayName
    })

    const overlayMenuTargetId = computed(() => {
      return `profile-${props.type}-overlay-menu-${profile.value!.id}`
    })

    const onSelect = () => {
      context.emit('select')
    }

    return {
      fullName,
      onSelect,
      overlayMenuTargetId,
      profile,
      thumbnail,
    }
  }
})
</script>

<style lang="scss" scoped>
.connection-item {
  text-align: center;
  position: relative;
  cursor: pointer;
}

.connection-item__details {
  color: #6B6B6B;
  font-weight: 500;
  padding-top: 10px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.b-avatar) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.b-avatar-img) {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.connection-item__checkbox {
  position: absolute;
  top: 5px;
  left: 10px;
}

.connection-item__more {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.connection-item :deep(a) {

  &:hover {
    text-decoration: none;

    span.link-unstyled {
      text-decoration: underline;
    }
  }
}

.rtl-at-root {
  .connection-item__checkbox {
    left: unset;
    right: 10px;
  }
  .connection-item__more {
    left: 10px;
    right: unset;
  }
}
</style>
