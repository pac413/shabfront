<template>
  <div
    class="notification-menu"
  >
    <slot
      :id="id"
      :show-badge="unviewedTotal > 0"
      :hide-menu="togglePopover"
      name="target"
    />

    <BPopover
      ref="popoverRef"
      :target="id"
      custom-class="notification-menu-popover"
      placement="bottom"
      container="body"
      @hide="$emit('popover-hide')"
      @show="$emit('popover-show')"
    >
      <BListGroup
        class="notification-menu__items"
        data-infinite-wrapper
      >
        <div
          v-if="isEmpty"
          class="notification-menu__empty text-muted"
        >
          <slot name="empty">
            {{ $t('notifications.empty') }}
          </slot>
        </div>

        <NotificationMenuItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @hide-menu="togglePopover"
        />

        <InfiniteLoading
          :identifier="id"
          @infinite="infiniteHandler"
        >
          <template #spinner>
            <Spinner
              :small="true"
              type="grow"
            />
          </template>
          <template #complete>
            <span></span>
          </template>
        </InfiniteLoading>
      </BListGroup>

      <BListGroupItem class="notification-menu__settings__footer">
        <slot name="settings" :hide-menu="togglePopover" />
      </BListGroupItem>
    </BPopover>
  </div>
</template>

<script lang="ts">
import 'v3-infinite-loading/lib/style.css'

import InfiniteLoading from 'v3-infinite-loading'
import { computed, defineComponent, ref, watch } from 'vue'

import { LoadingStatus } from '@/store/types'
import type { Notification } from '@/types'

import NotificationMenuItem from './NotificationMenuItem.vue'

export default defineComponent({
  name: 'NotificationMenu',
  components: {
    InfiniteLoading,
    NotificationMenuItem
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    notifications: {
      type: Array as () => Notification[],
      required: true,
    },
    unviewedTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    loading: {
      type: Number as () => LoadingStatus,
      required: true,
    },
  },
  emits: ['popover-hide', 'popover-show', 'load-more'],
  setup(props, context) {
    const popoverRef = ref<any | null>(null)
    const infiniteStageChanger = ref<any | null>(null)
    const loaded = computed(() => props.loading === LoadingStatus.Loaded)
    const isEmpty = computed(() => loaded.value && props.total === 0)
    const infiniteHandler = ($state: any) => {
      infiniteStageChanger.value = $state
      context.emit('load-more')
    }
    const togglePopover = () => {
      popoverRef.value.toggle()
    }

    watch(() => props.loading, () => {
      if (!infiniteStageChanger.value) { return }

      if (props.loading === LoadingStatus.Unloaded) {
        infiniteStageChanger.value.reset()
        return
      }

      if (props.loading === LoadingStatus.Loaded) {
        if (props.notifications.length < props.total) {
          infiniteStageChanger.value.loaded()
        } else {
          infiniteStageChanger.value.complete()
        }
      }
    }, { immediate: true })

    return {
      infiniteHandler,
      isEmpty,
      loaded,
      popoverRef,
      togglePopover,
    }
  }
})
</script>

<style lang="scss">
.notification-menu {
  cursor: pointer;
  padding: 0;
}

.notification-menu-popover {
  .popover-body {
    padding: 0;
  }

  .notification-menu__empty {
    display: flex;
    justify-content: center;
    padding: 20px 10px;
    font-size: 1rem;
    border: none;
  }

  .notification-menu__items {
    max-height: 60vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    overflow-y: auto;
    width: 425px;
  }

  .notification-menu__settings__footer {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    background-color: white;
    border: none;
    border-bottom-left-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
  }

  .notification-settings__link {
    width: 100%;
    font-size: 0.875rem;
    text-decoration: none;
    white-space: nowrap;

    &:hover, &:active {
      text-shadow: -0.06ex 0 #6c757d, 0.06ex 0 #6c757d;
      text-decoration: none;
    }

    &:active {
      border: none;
    }
  }

  .divider {
    width: 1px;
    height: 24px;
    background-color: $gray-500;
  }
}
</style>
