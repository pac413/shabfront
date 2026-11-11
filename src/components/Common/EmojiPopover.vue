<template>
  <BPopover
    ref="popoverRef"
    custom-class="emoji-tooltip_popover"
    :click="click"
    :hover="hover"
    :target="target"
    container="body"
  >
    <EmojiPicker
      :native="true"
      @select="onAddEmoji"
    />
  </BPopover>
</template>

<script lang="ts">
import 'vue3-emoji-picker/css'

import { defineComponent, ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'

export default defineComponent({
  name: 'EmojiPopover',
  components: {
    EmojiPicker,
  },
  props: {
    target: {
      type: String,
      required: true,
    },
    click: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
  },
  emits: ['select'],
  setup(props, context) {
    const popoverRef = ref<any | null>(null)

    const hidePopover = () => {
      popoverRef.value?.hideFn(new Event('click'))
    }

    const onAddEmoji = (emoji: any) => {
      context.emit('select', emoji)
      hidePopover()
    }

    return {
      hidePopover,
      onAddEmoji,
      popoverRef,
    }
  }
})
</script>

<style lang="scss">
.emoji-tooltip_popover .popover-body {
  padding: 0;
}
</style>
