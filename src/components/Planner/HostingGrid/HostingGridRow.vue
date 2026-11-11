<template>
  <div
    class="grid-row py-2"
    :class="category + ' ' + statusVariant(category)"
  >
    <h5 class="d-flex align-items-center">
      <div>
        <BFormCheckbox
          v-if="selectable && hasAnySelected"
          button-variant="secondary"
          :model-value="allSelected"
          @change="toggleAll"
        />
      </div>
      <template v-if="sortByStatus">
        <FaIcon :icon="statusIcon(category)" />
        {{ $t(`planner.row-${category}`) }} ({{ total || items.length }})
      </template>
      <template v-else>
        {{ $t(`planner.row-${category}`) }}
        <span class="category-totals">{{ $t('planner.confirmed-total', { total: confirmedCount }) }}</span>
      </template>
    </h5>
    <div class="avatars-row px-2">
      <HostingGridItem
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        class="m-2"
        :role="role"
        :invite="item"
        :hide-overlay="hideOverlay"
        :selectable="selectable"
        :selected="selectedStatus[item.id]"
        :status="sortByStatus ? null : statusOfMeal(category, item)"
        @select="onItemSelected"
        @view="$emit('view', item)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import HostingGridItem from '@/components/Planner/HostingGrid/HostingGridItem.vue'
import {
  type IHostingFragmentFragment,
  IHostingRole,
  type IHostingStatus,
} from '@/composables/graphql/generated'
import { type HostingPart, type InviteDetail, InviteStatus } from '@/types'
import { statusIcon, statusOfMeal, statusVariant } from '@/utils'

export default defineComponent({
  name: 'HostingGridRow',
  components: {
    HostingGridItem
  },
  props: {
    items: {
      type: Array as () => (InviteDetail | IHostingFragmentFragment)[],
      required: true,
    },
    category: {
      type: String as () => HostingPart | InviteStatus | IHostingStatus,
      required: true,
    },
    sortByStatus: {
      type: Boolean,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    hideOverlay: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String as () => IHostingRole,
      default: IHostingRole.Host,
    },
    selectedStatus: {
      type: Object as () => { [key: string]: boolean },
      default: () => ({}),
    },
    total: {
      type: Number,
      required: false,
      default: null,
    }
  },
  emits: ['view', 'select'],
  setup(props, context) {
    const allSelected = computed((): boolean =>
      props.items.every((item) => props.selectedStatus[item.id])
    )
    const hasAnySelected = computed((): boolean =>
      Object.keys(props.selectedStatus).some(id => props.selectedStatus[id])
    )
    const confirmedCount = computed((): number => {
      const items = props.items.filter((item) =>
        statusOfMeal(
          props.category as HostingPart,
          item
        ) === InviteStatus.ACCEPTED
      )
      return items.length
    })
    const onItemSelected = (params: { item: InviteDetail, isSelected: boolean }): void => {
      context.emit('select', { items: [params.item], isSelected: params.isSelected })
    }
    const toggleAll = (): void => {
      context.emit('select', { items: props.items, isSelected: !allSelected.value })
    }
    return {
      allSelected,
      confirmedCount,
      hasAnySelected,
      onItemSelected,
      statusIcon,
      statusOfMeal,
      statusVariant,
      toggleAll,
    }
  }
})
</script>

<style lang="scss" scoped>
h5 {
  font-size: 1em;
  font-weight: bold;
  text-transform: uppercase;

  span.category-totals {
    padding: 0 5px;
    font-size: .8em;
    color: $colorSecondary;
  }
  svg {
    margin-right: 5px;
  }
}

.avatars-row {
  display: flex;
  flex-wrap: wrap;
}

.rtl-at-root {
  h5 {
    svg {
      margin-left: 5px;
      margin-right: unset;
    }
  }
}
</style>
