<template>
  <div>
    <search-group-title header>
      {{ title }}
    </search-group-title>

    <ul class="search-items">
      <slot name="content" />
    </ul>

    <span class="search-items__footer">
      <slot name="footer" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AutoTypeSearchGroupTitle from './AutoTypeSearchGroupTitle.vue'

export default defineComponent({
  name: 'AutoTypeSearchItems',
  components: {
    SearchGroupTitle: AutoTypeSearchGroupTitle,
  },
  props: {
    title: {
      required: true,
      type: String,
    },
  },
})
</script>

<style lang="scss" scoped>
.search-items {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.search-items__footer {
  font-size: 13px;
  display: block;
  color: inherit;
  margin-top: 8px;
}
</style>
