<template>
  <div class="search-group-title" :class="{ 'search-group-header': header }">
    <span>
      <slot />
    </span>
    <span v-if="$slots.action" class="search-group-title__action">
      <slot name="action" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AutoTypeSearchGroupTitle',
  props: {
    header: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.search-group-title {
  padding-top: 16px;
  padding-bottom: 8px;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 14px;
  font-weight: 800;
}

.search-group-header {
  border-bottom: 1px solid #ededeb;
  background-color: #f6f6f6;
  padding: 10px 36px;
  margin-left: -32px;
  margin-right: -32px;
}

.search-group-title__action {
  float: right;
  a {
    font-size: 11px;
    color: $colorRed;
    position: relative;
    border-bottom: 1px dashed;
    text-decoration: none;
  }
}
</style>
