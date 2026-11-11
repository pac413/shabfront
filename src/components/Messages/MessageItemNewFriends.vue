<template>
  <li class="message-item-new-friends">
    <div class="message-item-new-friends__wrapper">
      <div v-html="data.text" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { type Message } from '@/types'

export default defineComponent({
  name: 'MessageItemNewFriends',
  props: {
    data: {
      type: Object as () => Message,
      required: true,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item-new-friends {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message-item-new-friends__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  background: $colorLightGrey3;
  border-radius: 6px;
}
</style>
