<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    scrollable
    size="lg"
    :title="$t('modals.view-blocking.title')"
    hide-footer
    no-close-on-backdrop
    @shown="onModalShown"
  >
    <div class="blocking-container container">
      <BListGroup class="blockings-list">
        <BListGroupItem
          v-for="(item, index) in blockingProfiles"
          :key="index"
          class="blocking-item"
        >
          <ProfileAvatar
            class="avatar"
            size="4em"
            thumbnail="medium"
            :profile="item"
          />
          <div class="item-content">
            <RouterLink
              target="_blank"
              :to="{ name: 'Profile', params: { handle: item.handle } }"
            >
              <div class="item-name text-body">
                {{ item.firstName }} {{ item.lastName }}
              </div>
            </RouterLink>
          </div>
          <div class="item-actions">
            <BButton
              variant="primary"
              @click="unblock(item)"
            >
              {{ $t('modals.view-blocking.unblock') }}
            </BButton>
          </div>
        </BListGroupItem>
      </BListGroup>

      <div
        v-if="!blockingProfiles.length"
        class="text-center"
      >
        {{ $t(`modals.view-blocking.no-members`) }}
      </div>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { useRegisterModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import type { SimpleProfile } from '@/types'

const modalId = Modal.VIEW_BLOCKING

export default defineComponent({
  name: 'ViewBlockingModal',
  components: { ProfileAvatar },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { isVisible } = useRegisterModal(modalId)
    const { showSuccessToast, showErrorToast } = useToast()

    const activeProfile = computed(() => store.state.profile.activeProfile)
    const blockingProfilesById = computed<(profileId: string) => SimpleProfile[]>(
      () => store.getters['profile/blockingProfilesById']
    )
    const blockingProfiles = computed(() => {
      const profile = activeProfile.value
      if (!profile?.id) {
        return []
      }
      return blockingProfilesById.value(profile.id)
    })

    const hideDialog = () => {
      return isVisible.value = false
    }

    const onModalShown = async () => {
      const profile = activeProfile.value
      if (!profile?.id) {
        return
      }
      await store.dispatch('profile/blockingProfiles', profile.id)
    }

    const unblock = async (item: SimpleProfile) => {
      try {
        await store.dispatch('profile/unblockProfile', { profile: item })
        showSuccessToast(
          t('modals.view-blocking.toast.success').toString(),
          t('modals.view-blocking.toast.title').toString()
        )
      } catch (error: any) {
        showErrorToast(
          error,
          t('modals.view-blocking.toast.title').toString()
        )
      }
    }

    return {
      activeProfile,
      blockingProfiles,
      blockingProfilesById,
      hideDialog,
      isVisible,
      modalId,
      onModalShown,
      unblock,
    }
  }
})
</script>

<style lang="scss" scoped>
.no-blockings {
  text-align: center;
  padding: 50px 0;
}

.blocking-container {
  display: flex;
  flex-direction: column;
}

.blockings-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.blocking-item {
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 20px;
  display: flex;
  align-items: center;

  &:hover {
    background: #e8e8e8;
  }

  .item-content {
    margin-left: 20px;
    flex-grow: 1;

    .item-secondary {
      font-size: 14px;
      color: rgba(0, 0, 0, .6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 700px;
    }
  }

  .item-actions {
    flex-wrap: nowrap;
    display: flex;

    :deep(.btn) {
      margin-left: 10px;
      font-weight: 700;
    }

    .btn-link {
      color: rgba(0, 0, 0, .6);
    }
  }
}

.rtl-at-root {
  .blocking-item {
    .item-content {
      margin-left: 0;
      margin-right: 20px;
    }

    .item-actions {
      :deep(.btn) {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
}
</style>
