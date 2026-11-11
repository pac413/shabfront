<template>
  <SubProfileCard
    v-if="hasDatingProfile"
    :icon="['fal', 'heart']"
    :title="$t('profile-view.dating.title')"
    :site-role="SiteRole.DATING"
    :endorsements="datingProfile.datingEndorsements.endorsements"
    :endorsements-total="datingProfile.datingEndorsements.total"
    :references="datingProfile.references"
    @view-all="$emit('view-all')"
  >
    <IconItem
      v-if="viewingSelf"
      class="link-style"
      :icon="['fal', 'pencil-alt']"
      :item-text="$t('profile-view.dating.edit-dating-profile')"
      @click="$emit('open-edit')"
    />
    <IconItem
      v-else-if="!isPrivate"
      class="link-style"
      :icon="['fas', 'file']"
      :item-text="$t('profile-view.dating.view-dating-profile')"
      @click="openDatingModal"
    />
    <IconItem
      v-else
      v-BModal.request-profile
      class="link-style"
      :icon="['fas', 'file-alt']"
      :item-text="$t('profile-view.dating.request-profile')"
    />

    <!-- MODALS BELOW -->
    <BModal
      :id="requestModalId"
      v-model="isRequestModalVisible"
      centered
      modal-class="shabbat-sm-modal"
      hide-footer
      :title="profile.displayName + '\'s ' + $t('profile-view.dating.dating-profile')"
    >
      {{ $t('profile-view.dating.dating-modal-text') }}
      <div class="modal-footer">
        <BButton
          variant="primary"
          @click="onRequestDatingProfile"
        >
          {{ $t('profile-view.dating.dating-modal-button') }}
        </BButton>
      </div>
    </BModal>
  </SubProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import SubProfileCard from '@/components/Profile/SubProfileCard.vue'
import { useRegisterModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { SiteRole } from '@/types'
import { buildRelationshipClause } from '@/utils/profile'

const requestModalId = 'request-profile'

export default defineComponent({
  name: 'DatingCard',
  components: {
    SubProfileCard
  },
  emits: ['view-all', 'open-edit'],
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const router = useRouter()
    const { isVisible: isRequestModalVisible } = useRegisterModal(requestModalId)
    const { showSuccessToast, showErrorToast } = useToast()
    const profile = computed(() => store.state.profile.currentProfile)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const hasDatingProfile = computed(() => {
      return !!profile.value?.datingProfile
    })
    const datingProfile = computed(() => {
      return profile.value?.datingProfile
    })
    const isPrivate = computed(() => {
      return !!profile.value?.datingProfile && profile.value?.datingProfile.isPrivate
    })

    const relationshipClause = computed(() => {
      const clause: string = buildRelationshipClause(profile.value, isPrivate.value)
      return clause
    })

    const viewAllRoute = computed(() => {
      const { handle } = route.params
      const prefix = handle ? `/profile/${handle}` : '/profile'
      return `${prefix}/endorsements`
    })

    const openEditRoute = computed(() => {
      const { handle } = route.params
      const prefix = handle ? `/profile/${handle}` : '/profile'
      return `${prefix}/edit-dating`
    })

    const openDatingModal = () => {
      showModal({
        modal: Modal.DATING_PROFILE,
        props: {
          profile: profile.value,
        },
      })
    }

    const onRequestDatingProfile = async () => {
      try {
        const payload = {
          profileId: profile.value?.id
        }
        await store.dispatch('profile/requestDatingProfile', payload)
        showSuccessToast(
          t('action.dating-profile.request').toString(),
          t('profile-view.general.success').toString()
        )
      } catch (error: any) {
        if (error.message === 'GraphQL error: RequestExists') {
          showErrorToast(
            t('action.dating-profile.request-exists').toString(),
            t('profile-view.general.error').toString()
          )
        } else {
          showErrorToast(
            t('action.dating-profile.request-error').toString(),
            t('profile-view.general.error').toString()
          )
        }
      }
    }

    const onViewAll = () => {
      router.push(viewAllRoute.value)
    }

    const onOpenEdit = () => {
      router.push(openEditRoute.value)
    }

    return {
      datingProfile,
      hasDatingProfile,
      isPrivate,
      isRequestModalVisible,
      onOpenEdit,
      onRequestDatingProfile,
      onViewAll,
      openDatingModal,
      openEditRoute,
      profile,
      relationshipClause,
      requestModalId,
      SiteRole,
      viewAllRoute,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
