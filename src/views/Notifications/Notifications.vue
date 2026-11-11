<template>
  <div class="mt-3 container">
    <ProfileCard
      sticky
      title="Notifications"
    >
      <template #menu>
        <BButton
          class="ms-auto me-2"
          size="sm"
          variant="light"
          @click="toggleDismissed"
        >
          {{ toggleButtonText }}
        </BButton>
      </template>

      <BListGroup>
        <div
          v-if="isEmpty"
          class="notification__empty text-muted"
        >
          {{ $t('notifications.empty') }}
        </div>

        <notification-item
          v-for="(notification, index) in notifications"
          :key="index"
          :notification="notification"
        />

        <InfiniteLoading @infinite="infiniteHandler">
          <template #spinner>
            <Spinner
              type="grow"
              variant="danger"
            />
          </template>
          <template #complete>
            <span></span>
          </template>
        </InfiniteLoading>
      </BListGroup>
    </ProfileCard>
  </div>
</template>

<script lang="ts">
import 'v3-infinite-loading/lib/style.css'

import InfiniteLoading from 'v3-infinite-loading'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import NotificationItem from '@/components/Notifications/NotificationItem.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { storeKey } from '@/store'
import { LoadingStatus } from '@/store/types'
import type { Notification } from '@/types'

export default defineComponent({
  name: 'Notifications',
  components: {
    InfiniteLoading,
    NotificationItem,
    ProfileCard,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const notifications = computed(() => store.state.notification.nonMessageNotifications)
    const loading = computed(() => store.state.notification.nonMessageNotificationsLoading)
    const total = computed(() => store.state.notification.nonMessageNotificationsTotal)
    const includeDismissed = ref<boolean>(false)
    const infiniteStageChanger = ref<any>(null)

    const isEmpty = computed(() => {
      return loading.value === LoadingStatus.Loaded && total.value === 0
    })

    const toggleButtonText = computed(() => {
      return includeDismissed.value
        ? t('notifications.hide-dismissed').toString()
        : t('notifications.show-dismissed').toString()
    })

    const updateScroller = (data: { notifications: Notification[], total: number }) => {
      const { total } = data
      if (notifications.value.length < total) {
        infiniteStageChanger.value.loaded()
      } else {
        infiniteStageChanger.value.complete()
      }
    }

    const infiniteHandler = async ($state: any) => {
      infiniteStageChanger.value = $state

      const res = await loadNotifications()
      if (!res) { return }

      updateScroller(res)
    }

    const loadNotifications = (reset: boolean = false) => {
      return store.dispatch(
        'notification/getNonMessageNotifications',
        {
          reset,
          includeDismissed: includeDismissed.value,
        }
      )
    }

    const toggleDismissed = async () => {
      includeDismissed.value = !includeDismissed.value

      const res = await loadNotifications(true)
      if (!res) { return }
      if (!infiniteStageChanger.value) { return }

      infiniteStageChanger.value.reset()
      updateScroller(res)
    }

    onMounted(() => {
      store.dispatch('notification/getUnviewedNonMessageNotificationsTotal')
      store.commit('notification/SET_NON_MESSAGE_NOTIFICATIONS', [])
    })

    return {
      includeDismissed,
      infiniteHandler,
      infiniteStageChanger,
      isEmpty,
      loading,
      loadNotifications,
      notifications,
      toggleButtonText,
      toggleDismissed,
      total,
      updateScroller,
    }
  }
})
</script>

<style lang="scss" scoped>
.notification__empty {
  display: flex;
  justify-content: center;
  padding: 20px 10px;
  font-size: 1rem;
  border: none;
}
</style>
