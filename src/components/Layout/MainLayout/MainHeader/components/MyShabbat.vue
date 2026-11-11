<template>
  <BPopover
    ref="popoverRef"
    container="body"
    :target="target"
    custom-class="my-shabbat-popover"
    placement="bottom"
  >
    <BListGroup class="my-shabbat-menu__items">
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/planner"
        @click="hidePopover"
      >
        {{ $t('main-header.my-shabbat.shabbat-planner') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/shabbat-suggestions"
        @click="hidePopover"
      >
        {{ $t('main-header.my-shabbat.shabbat-suggestions') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/parsha"
        @click="hidePopover"
      >
        {{ $t('main-header.my-shabbat.parsha') }}
      </RouterLink>
      <RouterLink
        v-if="hasHostRole"
        class="list-group-item list-group-item-action"
        to="/profile/edit/host-preferences"
        @click="hidePopover"
      >
        {{ $t('main-header.my-shabbat.hosting-preferences') }}
      </RouterLink>
    </BListGroup>
  </BPopover>
</template>

<script lang="ts">
import { computed,defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { SiteRole } from '@/types'

export default defineComponent({
  name: 'MyShabbat',
  props: {
    target: {
      type: String,
      required: true,
    },
  },
  setup() {
    const store = useStore(storeKey)
    const siteRoles = computed<SiteRole[]>(() => store.getters['auth/siteRoles'])
    const popoverRef = ref<any | null>(null)

    const hasHostRole = computed(() => siteRoles.value.includes(SiteRole.HOST))

    const hidePopover = () => {
      popoverRef.value?.toggle()
    }

    return {
      hidePopover,
      popoverRef,
      hasHostRole
    }
  }
})
</script>

<style lang="scss">
.my-shabbat-popover {
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

  .my-shabbat-menu__items {
    padding-bottom: 10px;
    width: 200px;
  }
}
</style>
