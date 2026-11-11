<template>
  <div class="pagination-row">
    <BDropdown
      id="dropdown-1"
      :text="`${sizePerPage}`"
      class="m-md-2"
      variant="outline-primary"
    >
      <BDropdownItem
        v-for="option in sizePerPageOptions"
        :key="option"
        @click="$emit('size-per-page-changed', option)"
      >
        {{ option }}
      </BDropdownItem>
    </BDropdown>

    <BPagination
      v-model="currentPageModel"
      :total-rows="total"
      :per-page="sizePerPage"
      class="mt-4"
    >
      <template #page="{ page, active }">
        <b v-if="active">{{ page }}</b>
        <i v-else>{{ page }}</i>
      </template>
    </BPagination>
  </div>
</template>

<script lang="ts">
import { computed,defineComponent } from 'vue'

export default defineComponent({
  props: {
    total: {
      required: true,
      type: Number,
    },
    sizePerPage: {
      required: true,
      type: Number,
      default: 10
    },
    sizePerPageOptions: {
      type: Array as () => Number[],
      default: () => [10, 25, 50, 100]
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  emits: ['size-per-page-changed', 'page-changed'],
  setup(props, { emit }) {
    const currentPageModel = computed({
      get: () => props.currentPage,
      set: (value: number) => emit('page-changed', value)
    })
    
    return {
      currentPageModel
    }
  },
})
</script>

<style lang="scss" scoped>
.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
