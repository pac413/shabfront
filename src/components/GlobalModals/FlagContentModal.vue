<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    centered
    size="md"
    :title="$t('modals.flag-content.title')"
  >
    <BFormGroup
      id="flag-content-group"
      class="form-group"
      :label="$t('modals.flag-content.body')"
      label-for="flag-content-textarea"
      label-class="flag-content-label"
    >
      <BFormTextarea
        id="flag-content-textarea"
        v-model="reason"
        autofocus
        type="text"
        rows="8"
        :class="{ 'is-invalid': errors.length > 0 }"
      />
      <div
        v-if="errors.length > 0"
        class="error-details pull-if-rtl-label"
      >
        {{ $t(errors[0]) }}
      </div>
    </BFormGroup>

    <template #footer>
      <BButton
        variant="secondary"
        @click="hideDialog"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="!meta.dirty || errors.length > 0 || loading"
        @click="flagContent"
      >
        <BSpinner
          v-if="loading"
          variant="primary"
          small
          class="mr-2"
        />
        {{ $t('modals.flag-content.button') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { useRegisterModal, useStringRequiredRule, useToast } from '@/composables'
import {
  IFlaggedContentType,
  useFlagContentMutation
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'

const modalId = Modal.FLAG_CONTENT

export default defineComponent({
  name: 'FlagContentModal',
  props: {
    resourceId: {
      type: String,
      required: true,
    },
    type: {
      type: String as () => IFlaggedContentType,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const { showSuccessToast, showErrorToast } = useToast()
    const store = useStore(storeKey)
    const { loading, mutate, onDone, onError } = useFlagContentMutation({})

    const reasonRule = useStringRequiredRule('reason')
    const { errors, meta, value: reason } = useField<string>('reason', reasonRule)

    const hideDialog = () => {
      isVisible.value = false
    }

    onDone((result) => {
      if (result.data?.flagContent) {
        showSuccessToast(
          t('modals.flag-content.success.body').toString(),
          t('modals.flag-content.success.title').toString()
        )

        const { activeProfile, currentProfile } = store.state.profile
        if (activeProfile && currentProfile && activeProfile.id === currentProfile.id) {
          hideDialog()
          return
        }

        if (props.type === IFlaggedContentType.Post) {
          store.commit('feed/DELETE_FEED_ITEM', props.resourceId)
        }
        if (props.type === IFlaggedContentType.MediaProfilePicture) {
          store.commit('profile/REMOVE_ACTIVE_PROFILE_PICTURE', props.resourceId)
          store.commit('profile/REMOVE_CURRENT_PROFILE_PICTURE', props.resourceId)
        }
      } else {
        showErrorToast(
          'Failed to flag content',
          t('modals.flag-content.success.title').toString()
        )
      }

      hideDialog()
    })

    onError((error) => {
      showErrorToast(error, t('modals.flag-content.success.title').toString())
      hideDialog()
    })

    const flagContent = () => {
      mutate({
        resourceId: props.resourceId,
        type: props.type,
        reason: reason.value,
      })
    }

    return {
      errors,
      flagContent,
      hideDialog,
      isVisible,
      loading,
      meta,
      modalId,
      reason,
    }
  }
})
</script>

<style lang="scss" scoped>
#flag-content-group {
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 1rem;
}
</style>
