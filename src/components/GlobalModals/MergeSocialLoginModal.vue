<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    hide-footer
    :title="$t('admin.recent-members.merge-social-login-modal.title')"
  >
    <div v-html="$t('admin.recent-members.merge-social-login-modal.body')" />

    <div class="form-group search-input">
      <auto-type-search
        typeahead-mode
        @selected="secondaryProfile = $event"
      />
    </div>

    <div
      v-if="secondaryProfile"
      class="secondary-profile"
    >
      <p>Secondary Profile:</p>
      <ProfileAvatar
        thumbnail="small"
        :profile="secondaryProfile"
      />
      <span class="secondary-profile__name">
        {{ secondaryProfile.displayName }}
      </span>
    </div>

    <div class="modal-footer">
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="!secondaryProfile || !profileId"
        @click="action"
      >
        {{ $t('admin.recent-members.merge-social-login-modal.merge') }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AutoTypeSearch from '@/components/AutoTypeSearch/AutoTypeSearch.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { useRegisterModal, useToast } from '@/composables'
import { useMergeProfilesMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'
import type { SimpleProfile } from '@/types'

const modalId = Modal.MERGE_SOCIAL_LOGIN

export default defineComponent({
  name: 'MergeSocialLoginModal',
  components: { ProfileAvatar, AutoTypeSearch },
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { showSuccessToast, showErrorToast } = useToast()
    const { isVisible } = useRegisterModal(modalId)
    const { mutate, onDone, onError } = useMergeProfilesMutation({})
    const secondaryProfile = ref<SimpleProfile | null>(null)

    const hideDialog = () => {
      isVisible.value = false
    }

    const action = () => {
      if (!secondaryProfile.value) {
        return
      }

      mutate({
        primaryProfileId: props.profileId,
        secondaryProfileId: secondaryProfile.value.id
      })
    }

    onDone((result) => {
      const status = result.data?.mergeProfiles.status
      if (status) {
        showSuccessToast(
          t('admin.recent-members.merge-social-login-modal.success').toString(),
          t('admin.recent-members.merge-social-login-modal.title').toString()
        )
      } else {
        showErrorToast(
          t('admin.recent-members.merge-social-login-modal.error').toString(),
          t('admin.recent-members.merge-social-login-modal.title').toString()
        )
      }
      hideDialog()
    })

    onError((error) => showErrorToast(error))

    return {
      action,
      hideDialog,
      isVisible,
      modalId,
      secondaryProfile,
    }
  }
})
</script>

<style lang="scss" scoped>
  .secondary-profile {
    p {
      margin-bottom: 10px;
      margin-top: 20px;
      font-weight: 600;
    }
  }
</style>
