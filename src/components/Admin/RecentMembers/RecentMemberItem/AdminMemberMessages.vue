<template>
  <div class="admin-member-messages">
    <message-item
      v-for="message in messages"
      :key="message.id"
      :data="message"
      @delete="$emit('delete', message)"
      @info="$emit('info', message)"
      @open-image="$emit('open-image', message)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import MessageItem from '@/components/Messages/MessageItem.vue'
import type { Message } from '@/types'

export default defineComponent({
  name: 'AdminMemberMessages',
  components: { MessageItem },
  props: {
    messages: {
      required: true,
      type: Array as () => Message[]
    }
  },
  emits: ['delete', 'info', 'open-image']
})
</script>

<style lang="scss" scoped>
.admin-member-messages {
  flex: 1;
  width: 100%;
  max-height: 70vh;
  padding: 20px 50px;
  overflow-y: auto;
}
</style>
