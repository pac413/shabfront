<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    size="md"
    :title="$t('modals.report-member.title')"
  >
    <BFormGroup
      id="report-member-group"
    >
      <div class="report-member-label">
        <label for="report-member-textarea">{{ $t('modals.report-member.body') }}</label>
      </div>
      <BFormRadioGroup
        v-model="reason"
        stacked
      >
        <BFormRadio
          v-for="option in reasonOptions"
          :key="option.label"
          :value="option.label"
        >
          {{ option.label }}
        </BFormRadio>
      </BFormRadioGroup>
      <BFormTextarea
        id="report-member-textarea"
        v-model="additionalDetails"
        autofocus
        type="text"
        rows="2"
        :placeholder="$t('modals.report-member.additional-details')"
        class="additional-details-input"
        :class="{'is-invalid': errors.length > 0}"
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
        @click="reportMember"
      >
        {{ $t('modals.report-member.button') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal, useStringRequiredRule, useToast } from '@/composables'
import { type IProfileFragmentFragment, useReportMemberMutation } from '@/composables/graphql/generated'
import { Modal } from '@/stores/modal'

const modalId = Modal.REPORT_MEMBER

export default defineComponent({
  name: 'ReportMemberModal',
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const { showSuccessToast, showErrorToast } = useToast()
    const { mutate, loading } = useReportMemberMutation()
 
    const reasonRule = useStringRequiredRule('reason')
    const additionalDetails = ref('')
    const { errors, meta, value: reason } = useField<string>('reason', reasonRule)
    const reasonOptions = computed(() => {
      const options = []
      for (let i = 0; i < 9; i++) {
        options.push({
          label: t(`modals.report-member.reason-${i+1}`).toString(),
          value: ''
        })
      }
      return options
    })

    const hideDialog = () => {
      isVisible.value = false
    }

    const handleChangeReason = (value: string) => {
      reason.value = value
    }

    const reportMember = async () => {
      try {
        const result = await mutate({
          profileId: props.profileId,
          reason: reason.value,
          additionalDetails: additionalDetails.value
        }, {
          updateQueries: {
            // update "search" query result
            search(previousState, { mutationResult }) {
              if (!mutationResult.data?.reportMember.success) {
                return previousState
              }
              const profiles = previousState.search?.profiles as IProfileFragmentFragment[]
              const updatedProfiles = profiles.filter((profile) => profile.id !== props.profileId)
              return {
                ...previousState,
                search: {
                  ...previousState.search,
                  profiles: updatedProfiles,
                },
              }
            },
            // update "datingSearch" query result
            datingSearch(previousState, { mutationResult }) {
              if (!mutationResult.data?.reportMember.success) {
                return previousState
              }
              const profiles = previousState.datingSearch?.profiles as IProfileFragmentFragment[]
              const updatedProfiles = profiles.filter((profile) => profile.id !== props.profileId)
              return {
                ...previousState,
                datingSearch: {
                  ...previousState.search,
                  profiles: updatedProfiles,
                },
              }
            },
            // update "recentGuests" query result
            recentGuests(previousState, { mutationResult }) {
              if (!mutationResult.data?.reportMember.success) {
                return previousState
              }
              const profiles = previousState.recentGuests?.profiles as IProfileFragmentFragment[]
              const updatedProfiles = profiles.filter((profile) => profile.id !== props.profileId)
              return {
                ...previousState,
                recentGuests: {
                  ...previousState.recentGuests,
                  profiles: updatedProfiles,
                },
              }
            },
            // update "recentHosts" query result
            recentHosts(previousState, { mutationResult }) {
              if (!mutationResult.data?.reportMember.success) {
                return previousState
              }
              const profiles = previousState.recentHosts?.profiles as IProfileFragmentFragment[]
              const updatedProfiles = profiles.filter((profile) => profile.id !== props.profileId)
              return {
                ...previousState,
                recentHosts: {
                  ...previousState.recentHosts,
                  profiles: updatedProfiles,
                },
              }
            },
          }
        })

        if (result?.data?.reportMember.success) {
          showSuccessToast(
            t('modals.report-member.success.body').toString(),
            t('modals.report-member.success.title').toString(),
          )
        }
      } catch (error: any) {
        console.error(error)
        showErrorToast(error)
      } finally {
        hideDialog()
      }
    }

    return {
      meta,
      errors,
      handleChangeReason,
      hideDialog,
      isVisible,
      loading,
      modalId,
      reason,
      reportMember,
      additionalDetails,
      reasonOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
}

.report-member-label {
  color: $colorText;
  font-weight: 600;
  font-size: 1.2rem;
}

.additional-details-input {
  margin-top: 1rem;
}

:deep(.custom-control) {
  margin-bottom: 0.5rem;
}

:deep(.custom-control-label) {
  font-size: 0.8rem;
  font-weight: 400;
  color: $colorText;
}

:deep(.custom-control-label::before)  {
  top: 0.125rem;
}

:deep(.custom-control-label::after)  {
  top: 0.125rem;
}
</style>
