<template>
  <div :class="{ right: arrowRight, top: arrowTop }">
    <div class="bubble-body px-3 py-2">
      <div class="arrow" />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SpeechBubble',
  props: {
    arrowRight: {
      type: Boolean,
      default: false,
    },
    arrowTop: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.bubble-body {
  font-size: 0.9rem;
  border-radius: 15px;
  background-color: $colorLightGrey3;
  position: relative;
  display: inline-flex;
  align-self: center;
  flex-wrap: wrap;
  margin: 0.5rem 0;
  word-break: break-word;

  .arrow {
    position: absolute;
    left: -12px;
    width: 0;
    height: 0;
    top: 14px;
    border: solid 8px transparent;
    border-right: 10px solid $colorLightGrey3;
  }
}

.right {
  display: flex;
  justify-content: flex-end;

  .bubble-body .arrow {
    left: unset;
    right: -4px;
    border-right: 8px transparent;
    border-left: 10px solid #efefef;
  }
}

.top .arrow {
  bottom: unset;
}

.rtl-at-root {
  .bubble-body {
    .arrow {
      left: unset;
      right: -4px;
      border-left: 10px solid $colorLightGrey3;
      border-right: unset;
    }
  }

  .right {
    .bubble-body .arrow {
      left: -12px;
      right: unset;
      border-right: 10px solid #efefef;
      border-left: 8px transparent;
    }
  }
}
</style>
