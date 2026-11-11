<template>
  <div class="create-broadcast-conversation-buttons-wrapper">
    <div class="create-broadcast-conversation-buttons">
      <button
        id="btn-add-emoji-feeditem"
        tabindex="0"
        class="btn btn-emoji"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'smile']"
        /> {{ $t('conversations.create-broadcast-conversation-modal.emoji-button') }}
      </button>
      <EmojiPopover
        target="btn-add-emoji-feeditem"
        click
        @select="onAddEmoji"
      />
      <button
        class="btn btn-photo"
        @click="$emit('add-picture')"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'camera']"
        /> {{ $t('conversations.create-broadcast-conversation-modal.photo-button') }}
      </button>
      <button
        class="btn btn-video"
        @click="$emit('add-video')"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'video']"
        /> {{ $t('conversations.create-broadcast-conversation-modal.video-button') }}
      </button>
    </div>
    <BButton
      variant="primary"
      class="btn-submit"
      :disabled="!publishable"
      @click="$emit('submit')"
    >
      {{ $t('conversations.create-broadcast-conversation-modal.submit') }}
    </BButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import EmojiPopover from '@/components/Common/EmojiPopover.vue'

export default defineComponent({
  name: 'CreateBroadcastConversationButtons',
  components: {
    EmojiPopover,
  },
  props: {
    publishable: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['add-emoji', 'add-picture', 'add-video', 'submit'],
  setup(props, context) {
    const onAddEmoji = (emoji: any) => {
      context.emit('add-emoji', emoji['i'])
    }

    return {
      onAddEmoji,
    }
  }
})
</script>

<style lang="scss" scoped>
.create-broadcast-conversation-buttons-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: solid 1px $colorBorder;
  padding: .5em 0;
}

.create-broadcast-conversation-buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.btn:not(.btn-submit) {
  font-weight: 600;
  font-size: 15px;
  color: #65676b;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  svg {
    margin-right: 8px;
    font-size: 18px;
  }
  &.btn-emoji {
    svg {
      color: #cea2cc;
    }
  }
  &.btn-photo {
    svg {
      color: #46be62;
    }
  }
  &.btn-video {
    svg {
      color: #e7a33e;
    }
  }
  &.btn-job {
    svg {
      color: #cea2cc;
    }
  }

  &.active {
    color: $colorRed;
    font-weight: 600;
  }
  &:hover(:not(.active)) {
    color: #65676b;
  }
}

.rtl-at-root {
  .btn:not(.btn-submit) {
    svg {
      margin-left: 8px;
      margin-right: unset;
    }
  }
}
</style>
