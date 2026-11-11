<template>
  <OverlayMenu :id="overlayId">
    <template #icon>
      <FaIcon :icon="['fas', 'chevron-down']" />
    </template>
    <template #default="{ hide: hideMenu }">
      <template v-if="isOtherMessage">
        <OverlayMenuItem
          :label="$t('messages.menu-reply')"
          :icon="['fal', 'reply']"
          icon-size="xs"
          :to="replyLink"
          tag="router-link"
          target="_blank"
          @hide-menu="hideMenu"
        />
      </template>
      <template v-else>
        <OverlayMenuItem
          :label="$t('messages.menu-delete')"
          :icon="['fal', 'trash']"
          icon-size="xs"
          @hide-menu="hideMenu"
          @click="$emit('delete')"
        />
        <OverlayMenuItem
          :label="$t('messages.menu-info')"
          :icon="['fas', 'info-circle']"
          icon-size="xs"
          @hide-menu="hideMenu"
          @click="$emit('info')"
        />
      </template>
    </template>
  </OverlayMenu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import OverlayMenu from '@/components/Common/OverlayMenu/OverlayMenu.vue'
import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import { storeKey } from '@/store'
import type { Message } from '@/types'

/**
 * This componet is used in 2 cases:
 * - Broacast conversation: show the reply menu for broadcast conversation initiator
 * - Direct conversation: show the message information for my message
 */
export default defineComponent({
  name: 'MessageItemOverlay',
  components: { OverlayMenu, OverlayMenuItem },
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
  },
  emits: ['hide-menu', 'delete', 'info'],
  setup(props) {
    const store = useStore(storeKey)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const isOtherMessage = computed(() => {
      return props.message.sender.id !== activeProfileId.value
    })
    const replyLink = computed(() => `/messages/${props.message.sender.handle}`)
    const overlayId = computed(() => props.message.id || props.message.internalId)

    return {
      isOtherMessage,
      overlayId,
      replyLink,
    }
  }
})
</script>
