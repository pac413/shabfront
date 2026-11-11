<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    modal-class="bulk-invite-modal"
    body-class="py-4 px-5"
    scrollable
    size="lg"
    :title="modalTitle"
    @shown="onShown"
  >
    <BOverlay
      v-if="!siteRoles.includes(requiredRole)"
      show
      no-wrap
      class="text-center"
    >
      <template #overlay>
        <h4>{{ $t('invites.modal.update-role-title') }}</h4>
        <div class="missing-role-switch">
          <label
            for="missing-role"
            class="input-label mb-0"
          >
            {{ requiredRoleLabel }}
          </label>
          <BFormCheckbox
            id="missing-role"
            switch
            @change="addMissingRole"
          />
        </div>
        <small v-html="updateRoleDescription" />
      </template>
    </BOverlay>
    <BOverlay
      rounded
      opacity="0.6"
      spinner-variant="secondary"
      :show="submitting"
      no-wrap
    />
    <div class="bulk-invite-wrapper mx-2">
      <div class="avatar-wrapper">
        <Spinner v-if="!recipients" />
        <div
          v-else
          class="avatar-list"
        >
          <invite-avatar
            v-for="item in recipients"
            :key="item.id"
            class="invite-avatar"
            :profile="item"
          />
        </div>
      </div>
      <div class="invite-form-wrapper py-3">
        <div class="label">
          <label for="selectedDate mb-0">{{ $t('invites.modal.date') }}:</label>
        </div>
        <div class="input">
          <span
            class="selected-date-text"
            @click="highlightCalendar"
          >
            {{ selectedDateText }}
            <ShabbatYomTovDatePicker
              ref="datepickerRef"
              :model-value="selectedDate"
              future-only
              right
              variant="secondary"
              @change="updateDate"
            />
          </span>
        </div>

        <BAlert
          v-if="hostAvailability.length && !isHostAvailable"
          :model-value="true"
          variant="danger"
          class="text-center"
        >
          {{ $t('invites.modal.host-unavailable') }}
        </BAlert>
        <template v-if="!hostingListLoading">
          <div
            v-if="canHostMeals"
            class="label"
          >
            <label for="selectedParts">{{ $t('invites.modal.meals') }}:</label>
          </div>
          <div
            v-if="canHostMeals"
            class="input"
          >
            <BFormCheckbox
              v-model="allPartsSelected"
              @change="toggleAllParts"
            >
              {{ allPartsSelected ? $t('invites.modal.uncheck-all') : $t('invites.modal.select-all') }}
            </BFormCheckbox>
            <BFormCheckboxGroup
              v-model="selectedParts"
              name="selectedParts"
            >
              <BFormCheckbox
                v-for="option in hostingParts"
                :key="option"
                :value="option"
              >
                {{ $t('invites.hosting-part.' + option) }}
              </BFormCheckbox>
            </BFormCheckboxGroup>
          </div>
        </template>
        <Spinner
          v-else
          class="flex-fill justify-content-center align-self-center"
        />
      </div>
      <div class="message-wrapper py-3">
        <div class="label">
          <label for="message">{{ $t('invites.modal.message-title') }}:</label>
        </div>
        <div
          ref="messageRef"
          class="contenteditable"
          :class="{'disabled': !isHostAvailable }"
          :contenteditable="isHostAvailable"
          :placeholder="$t('invites.modal.message-placeholder')"
        />
      </div>
    </div>
    <div
      v-if="missingDetails"
      class="missing-details py-4"
    >
      <div class="label">
        <label
          for="phone-number"
          class="mb-0"
        >{{ $t('invites.modal.missing-phone-title') }}</label>
      </div>
      <BFormInvalidFeedback
        id="phone-number-feedback"
        class="mb-2 d-flex"
      >
        {{ $t('invites.modal.missing-phone-message') }}
      </BFormInvalidFeedback>
      <VueTelInput
        v-bind="phoneInputProps"
        id="phone-number"
        v-model="phone"
        class="phone-number"
        default-country="US"
        @validate="handlePhoneValidation"
        @blur="updatePhone"
      >
        <template #arrow-icon="{ open }">
          <FaIcon
            v-if="open"
            :icon="['fa', 'caret-up']"
          />
          <FaIcon
            v-else
            :icon="['fa', 'caret-down']"
          />
        </template>
      </VueTelInput>
      <div
        v-if="!phoneValid"
        class="error-details pull-if-rtl-label"
      >
        {{ $t('profile-edit.contact-info.phone-error') }}
      </div>
      <BFormText id="phone-number-help">
        {{ $t('invites.modal.missing-phone-privacy-message') }}
      </BFormText>
    </div>
    <template #footer>
      <BButton
        variant="secondary"
        @click="closeModal"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="!formValid || submitting"
        @click="submit"
      >
        <BSpinner
          v-if="submitting"
          variant="primary"
          small
          class="mr-2"
        />
        {{ submitting? $t('invites.modal.submitting') : $t(`invites.modal.INVITATION-send-btn`) }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import 'vue3-resize/dist/vue3-resize.css'
import 'vue-tel-input/vue-tel-input.css'

import { type ApolloError } from '@apollo/client/errors'
import * as Sentry from '@sentry/vue'
import { computed, type ComputedRef, defineComponent, type Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueTelInput } from 'vue-tel-input'
import { useStore } from 'vuex'

import ShabbatYomTovDatePicker from '@/components/Common/Date/ShabbatYomTovDatePicker.vue'
import InviteAvatar from '@/components/Invites/InviteAvatar.vue'
import { useRegisterModal, useToast } from '@/composables'
import {
  type IHostingPart,
  IHostingRole,
  useAddGuestSiteRoleMutation,
  useAddHostSiteRoleMutation,
  useBulkInvitationsMutation,
} from '@/composables/graphql/generated'
import { useLocalizedDateDisplayText } from '@/composables/useLocalizedDateDisplayText'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import {
  FlagCode,
  type HostAvailability,
  type HostProfile,
  HostProfileStatus,
  type InviteDetail,
  InviteType,
  type Profile,
  type ProfileFlag,
  type SiteRole,
} from '@/types'

const modalId = Modal.BULK_INVITE

export default defineComponent({
  name: 'BulkInviteModal',
  components: {
    InviteAvatar,
    ShabbatYomTovDatePicker,
    VueTelInput,
  },
  props: {
    recipients: {
      type: Array as () => Profile[],
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { isVisible } = useRegisterModal(modalId)
    const { showSuccessToast, showErrorToast } = useToast()
    const { localizeDateDisplayText } = useLocalizedDateDisplayText()
    const selectedDate = computed<string>(() => store.getters['invites/selectedDate'])
    const hostingParts = computed<IHostingPart[]>(() => store.getters['invites/hostingParts'])
    const siteRoles = computed<SiteRole[]>(() => store.getters['auth/siteRoles'])
    const activeProfileId = computed<string | null>(() => store.state.auth.profileId)
    const activeProfile = computed<Profile | null>(() => store.state.profile.activeProfile)

    const submitting = ref<boolean>(false)
    const selectedParts = ref<IHostingPart[]>([])
    const allPartsSelected = ref<boolean>(false)
    const missingDetails = ref<boolean>(false)
    const phone = ref<string>('')
    const loadAccordion = ref<boolean>(false)
    const hostAvailability = ref<HostAvailability[]>([])
    const hostingList = ref<InviteDetail[]>([])
    const hostingListLoading = ref<boolean>(false)
    const phoneValid = ref<boolean>(false)
    const updatePhonePromise = ref<Promise<any> | null>(null)
    const datepickerRef: Ref<typeof ShabbatYomTovDatePicker | null> = ref(null)
    const messageRef: Ref<HTMLDivElement | null> = ref(null)
    const phoneInputProps = {
      inputOptions: {
        placeholder: t('profile-edit.contact-info.phone-number').toString()
      },
      mode: 'international'
    }

    const recipientSize: ComputedRef<number> = computed(() => props.recipients.length)
    const modalTitle: ComputedRef<string> = computed(() =>
      t(
        'invites.modal.bulk-invite-title',
        {
          size: recipientSize.value
        }
      ).toString()
    )
    const requiredRole: ComputedRef<IHostingRole> = computed(() => IHostingRole.Host)
    const requiredRoleLabel: ComputedRef<string> = computed(() => {
      const role = requiredRole.value.toLowerCase()
      return t(`profile-edit.${role}-preferences.${role}-role-label`).toString()
    })
    const updateRoleDescription: ComputedRef<string> = computed(() =>
      t(
        `invites.modal.update-role-explanation-${requiredRole.value}`,
        {
          link: `/profile/edit/${requiredRole.value.toLowerCase()}-preferences`
        }
      ).toString()
    )
    const selectedDateText: ComputedRef<string> = computed(() => localizeDateDisplayText(selectedDate.value))
    const isHostAvailable: ComputedRef<boolean> = computed(() => {
      if (!hostAvailability.value.length) {return true}
      const availability = hostAvailability.value.find(item => item.date === selectedDate.value)
      return !availability ||
        [
          HostProfileStatus.AVAILABLE,
          HostProfileStatus.ACTIVELY_LOOKING,
        ].includes(availability.status)
    })
    const hasExistingHosting: ComputedRef<boolean> = computed(() => {
      if (!hostingList.value || !hostingList.value.length) {
        return false
      }
      const recipientsIds= props.recipients.map(recipient => recipient.id)
      return !!hostingList.value.find(item =>
        item.type === InviteType.INVITATION &&
        (
          recipientsIds.includes(item.host.id) ||
          recipientsIds.includes(item.guest.id)
        )
      )
    })
    const subjectRole: ComputedRef<IHostingRole> = computed(() => IHostingRole.Guest)
    const formValid: ComputedRef<boolean> = computed(() => (
      !missingDetails.value ||
      phoneValid.value
    ))
    const hostProfile: ComputedRef<HostProfile | null | undefined> = computed(() => activeProfile.value?.hostProfile)
    const canHostMeals: ComputedRef<boolean> = computed(() => !!hostProfile.value?.mealAmount)

    const {
      mutate: addHostSiteRole,
      onDone: onAddHostSiteRoleDone,
      onError: onAddHostSiteRoleError
    } = useAddHostSiteRoleMutation({ variables: {} })
    const {
      mutate: addGuestSiteRole,
      onDone: onAddGuestSiteRoleDone,
      onError:  onAddGuestSiteRoleError 
    } = useAddGuestSiteRoleMutation({ variables: {} })

    const addMissingRole = () => {
      if (requiredRole.value === IHostingRole.Guest) {
        submitting.value = true
        addGuestSiteRole()
      } else if (requiredRole.value === IHostingRole.Host) {
        submitting.value = true
        addHostSiteRole()
      }
    }

    onAddHostSiteRoleDone((result) => {
      submitting.value = false
      const { error, profile } = result.data?.addHostSiteRole!
      if (error || !profile) { return }
      store.commit('auth/SET_AUTHENTICATED_SITE_ROLES', profile.siteRoles, { root: true })
    })
    onAddHostSiteRoleError(() => {
      submitting.value = false
    })

    onAddGuestSiteRoleDone((result) => {
      submitting.value = false
      const { error, profile } = result.data?.addGuestSiteRole!
      if (error || !profile) { return }
      store.commit('auth/SET_AUTHENTICATED_SITE_ROLES', profile.siteRoles, { root: true })
    })
    onAddGuestSiteRoleError(() => {
      submitting.value = false
    })

    const toggleAllParts = (checked: boolean): void => {
      selectedParts.value = checked ? hostingParts.value : []
    }
    const getAvailabilityAndHostings = async (date: string): Promise<void> => {
      hostingListLoading.value = true
      hostingList.value = await store.dispatch(
        'invites/getHostingList',
        {
          date,
          role: requiredRole.value
        }
      )
      hostingListLoading.value = false
    }
    const updateDate = (date: string) => {
      store.dispatch('invites/setInviteDate', { date })
      getAvailabilityAndHostings(date)
    }
    const updatePhone = (): void => {
      if (!phoneValid.value || updatePhonePromise.value) {
        return
      }
      updatePhonePromise.value = store.dispatch(
        'profile/updateProfile',
        {
          id: activeProfileId.value,
          phone: phone.value
        }
      ).then(() => {
        updatePhonePromise.value = null
      }).catch(() => {
        updatePhonePromise.value = null
      })
    }
    const handlePhoneValidation = (phoneObject: { valid: boolean }): void => {
      phoneValid.value = phoneObject.valid
    }
    const highlightCalendar = (): void => {
      (datepickerRef.value?.el as any)?.focus()
    }

    const onShown = async (): Promise<void> => {
      store.dispatch('invites/resetDate')
      if (messageRef.value) {
        messageRef.value.innerText = ''
      }
      const flags = await store.dispatch('profile/getActiveProfileFlags')

      if (flags && flags.length) {
        missingDetails.value = flags
          .map((flag: ProfileFlag) => flag.code)
          .includes(FlagCode.MISSING_PHONE_NUMBER)
      }

      await getAvailabilityAndHostings(selectedDate.value)

      loadAccordion.value = true
    }

    const closeModal = (): void => {
      isVisible.value = false
    }
    
    const {
      mutate: bulkInvite,
      onDone: onBulkInviteDone,
      onError: onBulkInviteError
    } = useBulkInvitationsMutation(() => ({
      variables: {
        guests: props.recipients.map(recipient => recipient.id),
        parts: selectedParts.value,
        date: selectedDate.value,
        note: messageRef.value?.innerText || ''
      }
    }))
    const onSubmitDone = () => {
      submitting.value = false
      closeModal()
      showSuccessToast(
        t('invites.modal.invitation-success').toString(),
        t('profile-view.general.success').toString()
      )
    }
    const onSubmitError = (error: ApolloError) => {
      Sentry.captureException(error)
      showErrorToast(error)
      submitting.value = false
      closeModal()
    }
    onBulkInviteDone(onSubmitDone)
    onBulkInviteError(onSubmitError)

    const submit = async (): Promise<void> => {
      if (updatePhonePromise.value) {
        await updatePhonePromise.value
      }
      const note = messageRef.value?.innerText || ''
      // eslint-disable-next-line no-console
      if (!note.trim()) {
        showErrorToast(
          t('invites.modal.invite-guest-message-required').toString(),
          t('invites.modal.include-note').toString()
        )
        return
      }

      submitting.value = true

      bulkInvite()
    }

    return {
      modalId,
      isVisible,
      modalTitle,
      datepickerRef,
      messageRef,

      requiredRole,
      requiredRoleLabel,
      updateRoleDescription,
      selectedDateText,
      isHostAvailable,
      hasExistingHosting,
      subjectRole,
      formValid,
      canHostMeals,

      submitting,
      selectedDate,
      hostingParts,
      siteRoles,
      selectedParts,
      allPartsSelected,
      missingDetails,
      loadAccordion,
      hostAvailability,
      hostingList,
      hostingListLoading,
      phone,
      phoneInputProps,
      phoneValid,

      InviteType,
      addMissingRole,
      highlightCalendar,
      toggleAllParts,
      updateDate,
      updatePhone,
      handlePhoneValidation,
      closeModal,
      onShown,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
h4 {
    font-size: 1.5rem;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.bulk-invite-wrapper {
  display: flex;
  flex-direction: column;
  color: #77838f;
  font-size: 14px;
  overflow: visible;

  .input {
    margin-bottom: 30px;
  }

  :deep(.custom-control-label) {
    line-height: 1.9em;
  }
  .custom-select {
    font-size: inherit
  }

  .avatar-wrapper {
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .avatar-list {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    max-height: 300px;
    width: 100%;

    .invite-avatar {
      width: calc(20% - 1rem);
      margin: 0.5rem;

      :deep(.avatar) {
        width: unset !important;
        height: unset !important;
        aspect-ratio: 1 / 1;
      }
      
      @media (max-width: $tabletMaxWidth) {
        width: calc(50% - 1rem);
      }
    }
  }

  .message-wrapper {
    [contenteditable] {
      min-height: 100px;
      padding: 10px 12px;
      border-radius: 5px;
      margin: 0;

      &.disabled {
        background-color: #EFEFEF;
      }
    }

    [contenteditable][placeholder]:empty:before {
      content: attr(placeholder);
      color: gray;
      background-color: transparent;
    }

    .post-checkbox {
      color: $colorText;
      margin-top: 10px;
    }
  }
}

.label {
  text-transform: uppercase;
  color: $colorText;
  font-weight: 600;

  label {
    margin-bottom: 1rem;
  }
}

.missing-details {
  font-size: 14px;
  .form-control {
    font-size: inherit;
  }
}

.view-all-grid {
  flex: 1
}

.all-host-grid {
  display:flex;
}

.selected-date-text {
  padding-left: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: $colorText;
}

.missing-role-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2em;
  border: solid 1px $colorGrey;
  padding: .5em 1em;
  border-radius: .5em;
  box-shadow: 1px 1px 3px rgba(0,0,0,.4)
}

.bulk-invite-modal.show {
  .modal-footer {
    justify-content: flex-end;
    padding-right: 3em;
  }
}

.rtl-at-root {
  .bulk-invite-modal.show {
    .modal-footer {
      padding-left: 3em;
      padding-right: unset;
    }
  }
}
</style>
