<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    body-class="py-4 px-5"
    modal-class="create-invite-modal"
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
    <div class="invite-wrapper mx-2">
      <div class="avatar-wrapper">
        <Spinner v-if="!recipient" />
        <invite-avatar
          v-else
          :profile="recipient"
        />
      </div>
      <div class="vertical-line mx-5" />
      <div class="invite-form-wrapper">
        <div class="invite-form py-3">
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
                future-only
                :model-value="selectedDate"
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
          <BAlert
            v-if="hasExistingHosting"
            :model-value="true"
            variant="danger"
            class="text-center"
          >
            {{ $t('invites.modal.has-existing-hosting-for-selected-date') }}
          </BAlert>
          <template v-else-if="!hostingListLoading">
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
            <div v-if="!canHostMeals && type === IHostingType.Request">
              <BAlert
                :model-value="true"
                variant="danger"
                class="text-center"
              >
                <span>{{ $t('invites.modal.no-meals-for-selected-date') }}</span>
              </BAlert>
            </div>
          </template>
          <Spinner
            v-else
            class="flex-fill justify-content-center align-self-center"
          />
        </div>
      </div>
      <div class="message-wrapper py-4">
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
    <transition name="fade">
      <details-accordion
        v-if="loadAccordion && recipient"
        :subject-role="subjectRole"
        :subject-id="recipient.id"
        :recent-hostings="true"
      />
    </transition>
    <div v-if="type === IHostingType.Request">
      <BAlert
        :model-value="true"
        variant="warning"
        class="text-center"
      >
        {{ $t('invites.modal.request-warning') }}
      </BAlert>
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
        :disabled="hasExistingHosting || !formValid || submitting"
        @click="submit"
      >
        <BSpinner
          v-if="submitting"
          variant="primary"
          small
          class="mr-2"
        />
        {{ submitting? $t('invites.modal.submitting') : $t(`invites.modal.${type}-send-btn`) }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import 'vue3-resize/dist/vue3-resize.css'
import 'vue-tel-input/vue-tel-input.css'

import { type ApolloError } from '@apollo/client/errors'
import * as Sentry from '@sentry/vue'
import { type ComponentPublicInstance, computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueTelInput } from 'vue-tel-input'
import { useStore } from 'vuex'

import ShabbatYomTovDatePicker from '@/components/Common/Date/ShabbatYomTovDatePicker.vue'
import DetailsAccordion from '@/components/Invites/Accordion/DetailsAccordion.vue'
import InviteAvatar from '@/components/Invites/InviteAvatar.vue'
import { useRegisterModal, useToast } from '@/composables'
import {
  type IHostingPart,
  IHostingRole,
  IHostingType,
  IHostProfileStatus,
  useAddGuestSiteRoleMutation,
  useAddHostSiteRoleMutation,
  useExtendHostingMutation,
  useHostAvailabilityLazyQuery,
  useHostingsLazyQuery,
  useRequestHostingMutation
} from '@/composables/graphql/generated'
import { useLocalizedDateDisplayText } from '@/composables/useLocalizedDateDisplayText'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import {
  FlagCode,
  type HostProfile,
  type Profile,
  type ProfileFlag,
  type SiteRole
} from '@/types'

const modalId = Modal.CREATE_INVITE

export default defineComponent({
  name: 'CreateInviteModal',
  components: {
    DetailsAccordion,
    InviteAvatar,
    ShabbatYomTovDatePicker,
    VueTelInput
  },
  props: {
    type: {
      type: String as () => IHostingType,
      required: true,
    },
    recipient: {
      type: Object as () => Profile,
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
    const phoneValid = ref<boolean>(false)
    const updatePhonePromise = ref<Promise<any> | null>(null)
    const datepickerRef =
      ref<ComponentPublicInstance<typeof ShabbatYomTovDatePicker & { focus: () => void }> | null>(null)
    const messageRef = ref<HTMLDivElement | null>(null)
    const phoneInputProps = {
      inputOptions: {
        placeholder: t('profile-edit.contact-info.phone-number').toString()
      },
      mode: 'international'
    }

    const recipientName = computed((): string => props.recipient.displayName)
    const modalTitle = computed((): string =>
      t(
        `invites.modal.${props.type}-title`,
        {
          name: recipientName.value
        }
      ).toString()
    )
    const requiredRole = computed((): IHostingRole =>
      props.type === IHostingType.Request
        ? IHostingRole.Guest
        : IHostingRole.Host
    )
    const requiredRoleLabel = computed((): string => {
      const role = requiredRole.value.toLowerCase()
      return t(`profile-edit.${role}-preferences.${role}-role-label`).toString()
    })
    const updateRoleDescription = computed((): string =>
      t(
        `invites.modal.update-role-explanation-${requiredRole.value}`,
        {
          link: `/profile/edit/${requiredRole.value.toLowerCase()}-preferences`
        }
      ).toString()
    )
    const selectedDateText = computed((): string => localizeDateDisplayText(selectedDate.value))
    const isHostAvailable = computed((): boolean => {
      if (!hostAvailability.value.length) {
        return true
      }
      const availability = hostAvailability.value.find(item => item?.date === selectedDate.value)
      return !availability ||
        (!!availability?.status && [
          IHostProfileStatus.Available,
          IHostProfileStatus.ActivelyLooking
        ].includes(availability?.status))
    })
    const hasExistingHosting = computed((): boolean => {
      if (!hostingList.value || !hostingList.value.length) {
        return false
      }
      return !!hostingList.value.find(item =>
        item.type === props.type &&
        (
          item.host.id === props.recipient.id ||
          item.guest.id === props.recipient.id
        )
      )
    })
    const subjectRole = computed(() =>
      props.type === IHostingType.Request ? IHostingRole.Host : IHostingRole.Guest
    )
    const formValid = computed((): boolean =>
      (
        props.type === IHostingType.Invitation ||
        !!selectedParts.value.length
      ) && (
        !missingDetails.value ||
        phoneValid.value
      )
    )
    const hostProfile = computed((): HostProfile | null | undefined => 
      props.type === IHostingType.Request
        ? props.recipient.hostProfile
        : activeProfile.value?.hostProfile
    )
    const canHostMeals = computed((): boolean =>
      props.type === IHostingType.Invitation
        ? true
        : !!hostProfile.value?.mealAmount,
    )

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

    const { load: loadHostAvailability, result: resultHostAvailability } = useHostAvailabilityLazyQuery({
      id: props.recipient.id,
      date: ''
    })
    const hostAvailability = computed(() => resultHostAvailability.value?.hostAvailability?.availability || [])

    const { load: loadHostingsList, loading: hostingListLoading, result: resultHostings } = useHostingsLazyQuery({
      input: { date: '', role: IHostingRole.Host }
    })
    const hostingList = computed(() => resultHostings.value?.Hostings?.hostings || [])

    const getAvailabilityAndHostings = (date: string) => {
      if (props.type === IHostingType.Request) {
        loadHostAvailability(undefined, {
          id: props.recipient.id,
          date
        })
      }
      loadHostingsList(undefined, {
        input: { date, role: requiredRole.value }
      }, {
        fetchPolicy: 'cache-and-network'
      })
    }
    const updateDate = (date: string) => {
      store.dispatch('invites/setInviteDate', { date })
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
      datepickerRef.value?.focus()
    }
    const onShown = async (): Promise<void> => {
      store.dispatch('invites/resetDate')
      const flags = await store.dispatch('profile/getActiveProfileFlags')

      if (flags && flags.length) {
        missingDetails.value = flags
          .map((flag: ProfileFlag) => flag.code)
          .includes(FlagCode.MISSING_PHONE_NUMBER)
      }

      loadAccordion.value = true
    }

    watch(selectedDate, () => {
      getAvailabilityAndHostings(selectedDate.value)
    }, { immediate: true })

    const closeModal = (): void => {
      isVisible.value = false
    }

    const {
      mutate: extendHosting,
      onDone: onExtendHostingDone,
      onError: onExtendHostingError
    } = useExtendHostingMutation(() => ({
      variables: {
        guest: props.recipient.id,
        parts: selectedParts.value,
        date: selectedDate.value,
        note: messageRef.value?.innerText || ''
      }
    }))
    const {
      mutate: requestHosting,
      onDone: onRequestHostingDone,
      onError: onRequestHostingError
    } = useRequestHostingMutation(() => ({
      variables: {
        host: props.recipient.id,
        parts: selectedParts.value,
        date: selectedDate.value,
        note: messageRef.value?.innerText || '',
        privateInviteCode: hostProfile?.value?.privateInviteCode
      }
    }))
    const onSubmitDone = () => {
      submitting.value = false
      showSuccessToast(
        t(`invites.modal.${props.type.toLowerCase()}-success`).toString(),
        t('profile-view.general.success').toString()
      )
      closeModal()
    }
    const onSubmitError = (error: ApolloError) => {
      Sentry.captureException(error)
      showErrorToast(error)
      submitting.value = false
      closeModal()
    }
    onExtendHostingDone(onSubmitDone)
    onExtendHostingError(onSubmitError)
    onRequestHostingDone(onSubmitDone)
    onRequestHostingError(onSubmitError)

    const submit = async (): Promise<void> => {
      if (updatePhonePromise.value) {
        await updatePhonePromise.value
      }
      const note = messageRef.value?.innerText || ''
      // eslint-disable-next-line no-console
      if (!note.trim()) {
        showErrorToast(
          t(
            props.type === IHostingType.Invitation
              ? 'invites.modal.invite-guest-message-required'
              : 'invites.modal.request-hosting-message-required'
          ).toString(),
          t('invites.modal.include-note').toString()
        )
        return
      }

      submitting.value = true

      if (props.type === IHostingType.Invitation) {
        extendHosting()
      } else {
        requestHosting()
      }
    }

    return {
      modalId,
      modalTitle,
      isVisible,
      datepickerRef,
      messageRef,

      recipientName,
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

      IHostingType,
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

.invite-wrapper {
  display:flex;
  flex-wrap: wrap;
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
    flex: 1 1 25%;
    display: flex;
    align-items: baseline;
    margin-top: 20px;
    justify-content: center;

    :deep(.invite-avatar-wrapper) {
      .avatar {
        width: 200px !important;
        height: 200px !important;
      }
    }
    
  }

  @media (max-width: $mobileMaxWidth) {
    .avatar-wrapper {
      flex: 1 0 100%;
    }

    .vertical-line {
      display: none;
    }
  }
  .invite-form-wrapper {
    flex: 1 1 50%;
  }

  .message-wrapper {
    flex: 1 1 100%;

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

.create-invite-modal.show {
  .modal-footer {
    justify-content: flex-end;
    padding-right: 3em;
  }
}

.rtl-at-root {
  .create-invite-modal.show {
    .modal-footer {
      padding-left: 3em;
      padding-right: unset;
    }
  }
}
</style>
