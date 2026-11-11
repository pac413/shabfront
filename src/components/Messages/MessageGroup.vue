<template>
  <div class="message-group">
    <div class="hr message-group__date">
      {{ data.groupedDate }}
    </div>
    <ul class="message-group__messages">
      <transition-group name="fade">
        <template v-for="message in data.messages">
          <div
            v-if="unreadMessageBreakpoint && unreadMessageBreakpoint.messageId === message.id"
            :key="`line${message.id}`"
            class="message-item__new-message"
          >
            <div class="hr message-item__new-message-text">
              {{ $t('messages.new-message') }}
            </div>
          </div>

          <message-item-new-friends
            v-if="message.type === 'NEW_FRIENDS'"
            :key="message.id"
            :data="message"
          />
          <message-item-new-hosting
            v-else-if="message.type === 'NEW_HOSTING'"
            :key="message.id"
            :data="message"
          />

          <message-item
            v-else
            :key="message.internalId || message.id"
            :data="message"
            @delete="$emit('delete', message)"
            @info="$emit('info', message)"
            @open-image="$attrs['onOpenImage']"
            @visible="$attrs['onVisible']"
            @add-emoji="$attrs['onAddEmoji']"
          />
        </template>
      </transition-group>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import type { MessageGroup as MessageGroupModel } from '@/types'

import MessageItem from './MessageItem.vue'
import MessageItemNewFriends from './MessageItemNewFriends.vue'
import MessageItemNewHosting from './MessageItemNewHosting.vue'

export default defineComponent({
  name: 'MessageGroup',
  components: { MessageItem, MessageItemNewFriends, MessageItemNewHosting },
  props: {
    data: {
      type: Object as () => MessageGroupModel,
      required: true,
    }
  },
  emits: ['delete', 'info'],
  setup() {
    const store = useStore(storeKey)
    const unreadMessageBreakpoint = computed(() => store.state.message.unreadMessageBreakpoint)
    return {
      unreadMessageBreakpoint
    }
  }
})
</script>

<style lang="scss" scoped>
.message-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.message-group__messages {
  width: 100%;
  padding: 0;
  margin: 0;

  span {
    display: flex;
    flex-direction: column;
  }
}

.message-item__new-message {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 10px;
}

.hr {
  display: flex;
  text-align: center;
  width: 100%;
  font-size: .9rem;
  font-weight: bold;
  color: $colorSecondary;
  margin: 1rem 0;

  &:before,
  &:after {
    content: '';
    flex: 1;
    margin: auto 1em;
    height: 0;
    border-top: 1px solid $colorBorder;
  }
}

.hr.message-item__new-message-text {
  color: $colorRed;

  &:before,
  &:after {
    border-top: 1px solid $colorRed;
  }
}
</style>
