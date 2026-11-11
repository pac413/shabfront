<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    centered
    size="lg"
    :title="title"
    @hidden="onModalClosed"
  >
    <div class="endorsement-modal">
      <div
        v-if="endorsee"
        class="new-endorsement"
      >
        <ProfileAvatar
          linkable
          class="avatar"
          size="50px"
          thumbnail="medium"
          :profile="endorsee"
        />
        <router-link
          target="_blank"
          :to="{ name: 'Profile', params: { handle: endorsee.handle } }"
        >
          <div class="endorsee-name text-body">
            {{ endorsee.firstName }} {{ endorsee.lastName }}
          </div>
        </router-link>
      </div>
      <GuestsAvatarList
        v-if="endorseesInvitations"
        :invitations="endorseesInvitations"
      />
      <div
        v-if="showTemplatesButton"
        class="select-template pull-if-rtl-label"
        @click="showTemplatesModal"
      >
        {{ $t('endorsement-templates.select-template') }}
      </div>
      <div class="input-label">
        {{ label }}
      </div>
      <div
        ref="bodyRef"
        class="contenteditable"
        contenteditable
        :placeholder="placeholder"
        @input="onInput"
        v-text="content"
      />
      <div
        v-if="errorMessage"
        class="error-details pull-if-rtl-label"
      >
        {{ errorMessage }}
      </div>
    </div>
    <template #footer>
      <BButton
        variant="secondary"
        @click="cancel"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="isSubmitting"
        @click="submit"
      >
        <BSpinner
          v-if="isSubmitting"
          variant="primary"
          small
          class="mr-2"
        />
        {{ $t('general.submit') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import GuestsAvatarList from '@/components/Planner/SendMessageToGuestsModal/GuestsAvatarList.vue'
import { useRegisterModal, useToast } from '@/composables'
import { type IEndorsementFragmentFragment, IEndorsementSiteRole, type ISimpleProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type EndorsementModalProps, type EndorsementTemplatesModalProps, Modal, useModalStore } from '@/stores/modal'
import type { InviteDetail } from '@/types'

const modalId = Modal.ENDORSEMENT

export default defineComponent({
  name: 'EndorsementModal',
  components: { ProfileAvatar, GuestsAvatarList },
  props: {
    endorser: {
      type: Object as () => ISimpleProfile,
      required: true,
    },
    endorsee: {
      type: Object as () => ISimpleProfile,
      default: null,
    },
    endorseesInvitations: {
      type: Array as () => InviteDetail[],
      default: null
    },
    type: {
      type: String as () => IEndorsementSiteRole,
      required: true,
    },
    endorsingBack: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: Object as () => EndorsementModalProps['reference'],
      default: null,
    },
    id: {
      type: String,
      required: false,
      default: null,
    },
    content: {
      type: String,
      required: false,
      default: ''
    },
    onSubmitted: {
      type: Function,
      required: false,
      default: () => {},
    },
    onClosed: {
      type: Function,
      required: false,
      default: () => {},
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const { closeAllModals, showModal } = useModalStore()
    const store = useStore(storeKey)
    const { showSuccessToast, showErrorToast } = useToast()
    const errorMessage = ref<string>('')
    const bodyRef = ref<HTMLDivElement | null>(null)
    const isSubmitting = ref<boolean>(false)

    const title = computed((): string =>
      props.id
        ? t(`profile-view.${props.type.toLowerCase()}.edit-endorsement-modal-title`).toString()
        : t(`profile-view.${props.type.toLowerCase()}.add-endorsement-modal-title`).toString()
    )
    const label = computed((): string =>
      t(`profile-view.${props.type.toLowerCase()}.add-endorsement-label`).toString()
    )
    const placeholder = computed(
      (): string => {
        if (props.endorsee) {
          return t(`profile-view.${props.type.toLowerCase()}.add-endorsement-prompt`, {
            firstName: props.endorsee.firstName,
          })
            .toString()
        }
        if (props.endorseesInvitations) {
          if (props.endorseesInvitations.length === 1) {
            return t(`profile-view.${props.type.toLowerCase()}.add-endorsement-prompt`, {
              firstName: props.endorseesInvitations[0].guest.firstName,
            })
              .toString()
          } else {
            return t(`profile-view.${props.type.toLowerCase()}.add-multiple-endorsements-prompt`, {
              number: props.endorseesInvitations.length - 1,
            })
              .toString()
          }
        }
        return ''
      }        
    )
    const showTemplatesButton = computed(() => props.type !== IEndorsementSiteRole.Dating)

    const onInput = (): void => {
      errorMessage.value = ''
    }
    const cancel = (): void => {
      isVisible.value = false
    }
    const onModalClosed = (): void => {
      errorMessage.value = ''
      closeAllModals()
      props.onClosed()
    }
    const showTemplatesModal = (): void => {
      const firstName = props.endorsee
        ? props.endorsee.firstName
        : props.endorseesInvitations.length === 1
          ? props.endorseesInvitations[0].guest.firstName
          : '{firstName}'
      const modalProps: EndorsementTemplatesModalProps = {
        type: props.type,
        firstName,
        onSelect: (template: string) => {
          const modalProps = {
            ...props,
            content: template
          }
          showModal({
            modal: Modal.ENDORSEMENT,
            props: modalProps as any,
          })
        }
      }
      showModal({
        modal: Modal.ENDORSEMENT_TEMPLATES,
        props: modalProps as any,
      })
    }
    const submit = async (): Promise<void> => {
      if (!bodyRef.value) {
        return
      }
      const newContent = bodyRef.value.innerText
      if (!newContent.length) {
        errorMessage.value = t('profile-view.modal.error-enter-endorsement').toString()
        return
      }
      try {
        isSubmitting.value = true
        let endorsement: IEndorsementFragmentFragment

        if (props.id && props.endorsee) {
          endorsement = await store.dispatch('profile/updateEndorsement', {
            siteRole: props.type,
            id: props.id,
            body: newContent,
            profileId: props.endorsee.id
          })
          showSuccessToast(
            t('profile-view.modal.edit-endorsement-success').toString(),
            t('profile-view.general.success').toString()
          )
        } else {
          if (props.endorsee) {
            endorsement = await store.dispatch('profile/addEndorsement', {
              siteRole: props.type,
              endorsement: newContent,
              reference: props.reference,
              profileId: props.endorsee.id,
              endorsingBack: props.endorsingBack
            })
            props.onSubmitted(endorsement)
          }
          if (props.endorseesInvitations) {
            await store.dispatch('profile/addMultipleGuestEndorsements', {
              endorsements: props.endorseesInvitations.map((invitation) => ({
                profileId: invitation.guest.id,
                body: newContent.replace('{firstName}', invitation.guest.firstName)
              })),
            })
          }
          showSuccessToast(
            t('profile-view.modal.add-endorsement-success').toString(),
            t('profile-view.general.success').toString()
          )
        }
      } catch {
        showErrorToast(
          t('profile-view.modal.error').toString(),
          t('profile-view.general.error').toString()
        )
      } finally {
        isSubmitting.value = false
      }
      isVisible.value = false
    }

    return {
      isSubmitting,
      bodyRef,
      cancel,
      errorMessage,
      isVisible,
      modalId,
      onModalClosed,
      onInput,
      placeholder,
      submit,
      title,
      label,
      showTemplatesModal,
      showTemplatesButton
    }
  }
})
</script>

<style lang="scss" scoped>

.endorsement-modal {
  .input-label {
    margin-top: 20px;
    color: $colorSecondary;
    font-size: 14px;
  }

  .contenteditable {
    min-height: 200px;
    font-size: .9em;
    margin: 0;
  }

  button {
    align-self: flex-end;
  }
}
.new-endorsement {
  display: flex;
  align-items: center;

  .avatar {
    flex: 0 0 50px;
    height: 50px;
  }

  .endorsee-name {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
  }

  a {
    &:hover {
      text-decoration: none;
    }
  }
}

.error-details {
  margin-top: 5px;
}

.rtl-at-root .error-details {
  margin-left: unset;
  margin-right: 100px;
}

.select-template {
  cursor: pointer;
  color: $colorRed;
  text-decoration: underline;
  margin-top: 20px;
}
</style>
