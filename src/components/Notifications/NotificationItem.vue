<template>
  <BListGroupItem
    class="notification__item"
    :class="{ 'notification__item--viewed': hasBeenRead }"
  >
    <RouterLink
      target="_blank"
      :to="profileRoute"
    >
      <ProfileAvatar
        size="4em"
        thumbnail="medium"
        :profile="notification.triggeredBy"
      />
    </RouterLink>

    <div class="notification__item__content ms-3">
      <div
        class="notification__item__title text-body"
        v-html="notification.title"
      />
      <div
        class="notification__item__description mt-1"
        v-html="notification.content"
      />
      <AgoString
        class="notification__item__time mt-1"
        :date="notification.createdAt"
      />
    </div>

    <div class="notification__item__actions">
      <notification-item-action
        v-for="(action, index) of notification.actions"
        :key="index"
        class="mx-2"
        :action="action"
        :notification="notification"
      />
      <notification-item-dismiss
        class="ms-2"
        :notification="notification"
      />
      <notification-item-status
        class="ms-2"
        :notification="notification"
      />
    </div>
  </BListGroupItem>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { INotificationStatus } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Notification } from '@/types'

import NotificationItemAction from './NotificationItemAction.vue'
import NotificationItemDismiss from './NotificationItemDismiss.vue'
import NotificationItemStatus from './NotificationItemStatus.vue'

export default defineComponent({
  name: 'NotificationItem',
  components: {
    AgoString,
    NotificationItemAction,
    NotificationItemDismiss,
    NotificationItemStatus,
    ProfileAvatar
  },
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const hasBeenRead = computed(() => INotificationStatus.Read === props.notification.status)
    const profileRoute = computed(() => `/profile/${props.notification.triggeredBy.handle}`)

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
      hasBeenRead,
      profileRoute,
    }
  }
})
</script>

<style lang="scss" scoped>
.notification__item {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 20px;

  &:hover {
    background: #e8e8e8;
  }

  .notification__item__actions {
    > div {
      order: 4;
    }

    .btn-primary {
      order: 3;
    }
    .btn-secondary {
      order: 2;
    }
    .btn-link {
      order: 1;
    }
  }
}

.notification__item--viewed {
  background-color: $white;
}

.notification__item__content {
  flex: 1;
}

.notification__item__title {
  font-size: .9rem;
}

.notification__item__description {
  font-size: .8rem;
  color: $colorSecondary;
}

.notification__item__time {
  font-size: .8rem;
  color: $colorSecondary;
}

.notification__item__actions {
  display: flex;
  align-items: center;
}
</style>
