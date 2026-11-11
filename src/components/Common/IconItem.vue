<template>
  <div class="icon-item">
    <FaIcon
      :icon="icon"
      :class="iconClass"
    />
    <div
      v-if="itemLink"
      class="icon-item-link"
    >
      <a :href="itemLink">{{ itemText }}</a>
    </div>
    <div
      v-else
      class="icon-item-detail"
      @click="$emit('click')"
    >
      {{ itemText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IconItem',
  props: {
    icon: {
      type: Array as () => string[],
      required: true,
      default: () => []
    },
    itemText: {
      type: String,
      required: false,
      default: null,
    },
    itemLink: {
      type: String,
      required: false,
      default: null,
    },
    iconClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['click']
})
</script>

<style lang="scss" scoped>
.icon-item {
  display: flex;
  align-items: center;

  svg {
    width: 20px;

    &.indigo {
      color: indigo;
    }

    &.purple {
      color: purple;
    }

    &.green {
      color: green;
    }

    &.red {
      color: $colorRed;
    }
  }
}

.icon-item-link, .icon-item-detail {
  padding-left: 10px;
}

.rtl-at-root {
  .icon-item-link, .icon-item-detail {
    padding-left: unset;
    padding-right: 10px;
  }

}
</style>
