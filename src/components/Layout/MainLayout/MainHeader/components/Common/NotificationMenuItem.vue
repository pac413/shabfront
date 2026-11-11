<template>
  <BListGroupItem
    class="notification-menu-item"
    :class="{
      'notification-menu-item--viewed': !hasBeenRead,
      'notification-menu-item--closed': isClosed
    }"
    @click.stop="toggleIsClosed"
  >
    <div class="notification-menu-item__content">
      <ProfileAvatar
        linkable
        size="50px"
        thumbnail="medium"
        :profile="notification.triggeredBy"
      />
      <div class="notification-menu-item__details ms-2">
        <div
          class="notification-menu-item__title"
          v-html="notification.title"
        />
        <div
          class="notification-menu-item__inner-content"
          v-html="notification.content"
        />
        <AgoString
          class="text-small text-muted mt-1"
          :date="notification.createdAt"
        />
      </div>

      <div class="notification-menu-item__updates">
        <NotificationMenuItemDismiss
          class="ms-1"
          :notification="notification"
        />
        <NotificationMenuItemStatus
          class="ms-1"
          :notification="notification"
        />
      </div>
    </div>

    <transition
      v-if="hasActions"
      name="fade-in"
      mode="in-out"
    >
      <div
        v-if="!isClosed"
        class="notification-menu-item__actions"
      >
        <NotificationMenuItemAction
          v-for="(action, index) of actions"
          :key="index"
          class="notification-menu-item__action"
          :action="action"
          :notification="notification"
          @hide-menu="$emit('hide-menu')"
        />
      </div>
    </transition>
  </BListGroupItem>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { INotificationStatus } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Notification } from '@/types'

import NotificationMenuItemAction from './NotificationMenuItemAction.vue'
import NotificationMenuItemDismiss from './NotificationMenuItemDismiss.vue'
import NotificationMenuItemStatus from './NotificationMenuItemStatus.vue'


export default defineComponent({
  name: 'NotificationMenuItem',
  components: {
    AgoString,
    NotificationMenuItemAction,
    NotificationMenuItemDismiss,
    NotificationMenuItemStatus,
    ProfileAvatar
  },
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props) {
    const store = useStore(storeKey)
    const isActionsVisible = ref<boolean>(false)
    const isClosed = ref<boolean>(true)
    const actions = computed(() => props.notification.actions)
    const hasActions = computed(() => actions.value.length > 0)
    const hasBeenRead = computed(() => INotificationStatus.Read === props.notification.status)
    const toggleIsClosed = (event: Event) => {
      // If child <a> tag is clicked, just navigate. No need to run further logic.
      if ((event.target as HTMLElement).tagName.toLowerCase() === 'a') {
        return
      } else {
        event.preventDefault()
      }

      if (!hasBeenRead.value) {
        store.dispatch(
          'notification/updateNotificationStatus',
          {
            notification: props.notification,
            newStatus: INotificationStatus.Read
          }
        )
      }

      isClosed.value = !isClosed.value
    }

    onMounted(() => {
      if (props.notification.status === INotificationStatus.New) {
        store.dispatch(
          'notification/updateNotificationStatus',
          {
            notification: props.notification,
            newStatus: INotificationStatus.Viewed
          }
        )
      }
    })

    return {
      actions,
      hasActions,
      hasBeenRead,
      isActionsVisible,
      isClosed,
      toggleIsClosed,
    }
  }
})
</script>

<style lang="scss" scoped>
.notification-menu-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  border-bottom: 1px solid $colorBorder;
  background-color: white;
  color: black;
  font-size: 0.875rem;
  line-height: 1.2rem;
  cursor: pointer;
}

.notification-menu-item__content {
  width: 100%;
  display: flex;
  flex: 1;
}

.notification-menu-item__details :deep(a) {
  color: inherit;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}

.notification-menu-item__title {
  font-weight: bold;
}

// Only items that are both closed and read should be grayed out.
.notification-menu-item--viewed.notification-menu-item--closed {
  background-color: $colorMessaging;
  color: $colorSecondary;
}

.notification-menu-item--closed .notification-menu-item__inner-content{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-menu-item__details {
  flex: 1;

  & > div {
    max-width: 262px;
  }
}

.notification-menu-item__updates {
  display: flex;
}

.notification-menu-item__actions {
  margin-top: .8rem;
  margin-bottom: 1rem;
  padding-left: 58px;
  display: flex;
}

.notification-menu-item__action {
  margin-right: .8rem;

  &.btn-primary {
    order: 3;
  }
  &.btn-secondary {
    order: 2;
  }
  &.btn-link {
    order: 1;
  }
}

.text-small {
  font-size: .75rem;
}

.rtl-at-root {
  .notification-menu-item__action {
    margin-left: .8rem;
    margin-right: 0;
  }
}
</style>
