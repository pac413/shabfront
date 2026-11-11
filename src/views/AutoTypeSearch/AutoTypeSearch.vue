<template>
  <div class="pull-if-rtl inner-container p-3 py-sm-3">
    <div class="align-items-center my-3 py-2">
      <h5 class="pull-if-rtl-label d-sm-block">
        {{ $t('outer-search.mobile-search') }}
      </h5>
    </div>
    <div id="search-wrapper">
      <auto-type-search mobile />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AutoTypeSearch from '@/components/AutoTypeSearch/AutoTypeSearch.vue'

export default defineComponent({
  name: 'MobileAutoTypeSearch',
  components: {
    AutoTypeSearch,
  },
})
</script>

<style lang="scss" scoped>
h5 {
  font-size: 18px;
  font-weight: bold;
}

:deep(.search-wrapper) {
  .search-input {
    .form-control {
      &,
      &:focus {
        box-shadow: 0 0 0 1px #ccc;
      }
    }
  }
}
</style>
