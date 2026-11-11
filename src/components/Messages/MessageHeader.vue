<template>
  <direct-message-header v-if="shouldShowDirectMessageHeader" />
  <broadcast-message-header v-else />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'

import BroadcastMessageHeader from './BroadcastMessageHeader.vue'
import DirectMessageHeader from './DirectMessageHeader.vue'

export default defineComponent({
  name: 'MessageHeader',
  components: {
    BroadcastMessageHeader,
    DirectMessageHeader,
  },
  setup() {
    const store = useStore(storeKey)
    const conversation = computed(() => store.state.message.currentConversation!)
    const profileId = computed(() => store.state.auth.profileId!)
    const shouldShowDirectMessageHeader = computed(() =>
      !conversation.value.isBroadcast || conversation.value.initiator?.id !== profileId.value
    )

    return {
      shouldShowDirectMessageHeader,
      profileId,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-header {
  display: flex;
  align-items: center;
  height: 74px;
  justify-content: space-between;
  padding: 15px 15px 15px 25px;
  background: $colorMessaging;
  border-bottom: 0.5px solid #C2C2C2;
  z-index: 1;
}

.message-header__back {
  color: $colorRed;
}

.message-header__about {
  flex: 1 1 auto;
  margin: 0 10px;
  font-size: 1rem;
}

.message-header__archive {
  color: $colorRed;
}
</style>
