<template>
  <BPopover
    ref="popoverRef"
    container="body"
    :target="target"
    custom-class="dating-menu-popover"
    placement="bottom"
  >
    <BListGroup class="dating-menu__items">
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/dating"
        @click="hidePopover"
      >
        {{ $t('main-header.dating-menu.dating') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/matchmaking"
        @click="hidePopover"
      >
        {{ $t('main-header.dating-menu.matchmaking') }}
      </RouterLink>
    </BListGroup>
  </BPopover>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DatingMenu',
  props: {
    target: {
      type: String,
      required: true,
    },
  },
  setup() {
    const popoverRef = ref<any | null>(null)

    const hidePopover = () => {
      popoverRef.value?.toggle()
    }

    return {
      hidePopover,
      popoverRef,
    }
  }
})
</script>

<style lang="scss">
.dating-menu-popover {
  .popover-body {
    padding: 0;
  }

  .list-group-item {
    font-size: 14px;
    padding: 0.5rem 1rem;
    border: none;
  }

  .list-group-item-header {
    font-weight: 700;
    background: $gray-200;
  }

  .dating-menu__items {
    padding-bottom: 10px;
    width: 200px;
  }
}
</style>
