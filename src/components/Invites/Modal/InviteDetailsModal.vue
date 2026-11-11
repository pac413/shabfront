<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    scrollable
    size="lg"
    class="invite-details-modal"
  >
    <template #header>
      <h5 class="modal-title">
        <BBadge
          v-if="isExpired"
          variant="danger"
        >
          {{ $t('invites.modal.expired') }}
        </BBadge>
        <BBadge
          v-if="invitation && !isPending"
          variant="secondary"
        >
          {{ $t(`invites.modal.${invitation.status.toLowerCase()}-status`) }}
        </BBadge>
        {{ inviteTitle }}
      </h5>
      <button
        aria-label="Close"
        class="close"
        @click.prevent="closeModal"
      >
        ×
      </button>
    </template>
    <Spinner v-if="!invitation" />
    <div v-else>
      <div class="invite-wrapper my-2">
        <invite-avatar
          :profile="subjectProfile"
        />
        <div class="vertical-line" />
        <div class="invite-detail-wrapper">
          <status-badge
            :status="invitation.status"
            :type="invitation.type"
            :is-expired="isExpired"
            :is-recipient="isRecipient"
          />
          <IconItem
            :icon="['fas', 'calendar-alt']"
            :item-text="parshaText"
          />
          <IconItem
            :icon="['fal', 'utensils']"
            :item-text="mealsText"
          />
          <speech-bubble
            v-for="(note, index) in inviteNotes"
            :key="index"
            :arrow-right="role === note.sender"
          >
            {{ note.body }}
          </speech-bubble>
        </div>
      </div>
      <details-accordion
        :subject-role="subjectRole"
        :subject-id="subjectProfile.id"
        :recent-hostings="true"
        class="px-4 py-0"
      />
    </div>
    <template #footer>
      <ResponseFooter
        v-if="isRecipient && isPending && !isExpired"
        :parts="initialParts"
        @close="closeModal"
      />
      <template v-else>
        <BButton
          variant="secondary"
          @click="closeModal"
        >
          {{ $t(`general.close`) }}
        </BButton>
      </template>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted } from 'vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import SpeechBubble from '@/components/Common/SpeechBubble/SpeechBubble.vue'
import DetailsAccordion from '@/components/Invites/Accordion/DetailsAccordion.vue'
import InviteAvatar from '@/components/Invites/InviteAvatar.vue'
import ResponseFooter from '@/components/Invites/Modal/ResponseFooter.vue'
import StatusBadge from '@/components/Invites/StatusBadge.vue'
import { useRegisterModal } from '@/composables'
import { IHostingRole } from '@/composables/graphql/generated'
import { useLocalizedDateDisplayText } from '@/composables/useLocalizedDateDisplayText'
import { storeKey } from '@/store'
import { type InviteDetail, InviteStatus, type Profile } from '@/types'
import { initialParts as initialPartsUtils, inviteParts,isPast } from '@/utils'

export default defineComponent({
  name: 'InviteDetailsModal',
  components: {
    InviteAvatar,
    DetailsAccordion,
    ResponseFooter,
    StatusBadge,
    SpeechBubble
  },
  props: {
    role: {
      type: String as () => IHostingRole,
      required: true,
    },
  },
  setup(props) {
    const { role } = toRefs(props)
    const { t } = useI18n()
    const modalId = computed(() => `inviteDetailsModal-${role.value}`)
    const { isVisible } = useRegisterModal(modalId)
    const store = useStore(storeKey)
    const { localizeDateDisplayText } = useLocalizedDateDisplayText()
    const getIsRecipient = computed<() => boolean>(() => store.getters['invites/isRecipient'])
    const invitation = computed<InviteDetail>(() => store.getters['invites/currentInvite'])
    const subjectProfile = computed<Profile>(() => store.getters['invites/subjectProfile'])

    const isExpired = computed(() => {
      return invitation.value && isPast(invitation.value.date)
    })

    const isPending = computed(() => {
      return invitation.value && invitation.value.status === InviteStatus.PENDING
    })

    const isRecipient = computed(() => {
      return getIsRecipient.value()
    })

    const inviteTitle = computed(() => {
      if (!invitation.value) {return t('invites.modal.undefined-title')}
      return t(`invites.modal.${props.role.toLowerCase()}-${invitation.value.type.toLowerCase()}-title`,
        { name: subjectProfile.value.displayName })
    })

    const subjectRole = computed(() => {
      return props.role === IHostingRole.Guest ? IHostingRole.Host : IHostingRole.Guest
    })

    const inviteNotes = computed(() => {
      return invitation.value.notes.filter(note => note.body && note.body.length)
    })

    const mealsText = computed(() => {
      if (!invitation.value) {return}
      return inviteParts(invitation.value).map(item => t('invites.hosting-part.' + item)).join(', ')
    })

    const initialParts = computed(() => {
      if (!invitation.value || !isRecipient.value) {return []}
      return initialPartsUtils(invitation.value)
    })

    const parshaText = computed(() => {
      return localizeDateDisplayText(invitation.value.date)
    })

    const closeModal = () => {
      isVisible.value = false
      store.dispatch('invites/clearInvite')
    }

    onUnmounted(() => {
      store.dispatch('invites/clearInvite')
    })

    return {
      closeModal,
      getIsRecipient,
      initialParts,
      invitation,
      inviteNotes,
      inviteTitle,
      isExpired,
      isPending,
      isRecipient,
      isVisible,
      mealsText,
      modalId,
      parshaText,
      subjectProfile,
      subjectRole,
    }
  }
})
</script>

<style lang="scss" scoped>

.modal-title {
  display: flex;
  align-items: center;
}

:deep(.badge) {
  margin-right: .5rem;
  font-weight: normal;
}

.invite-wrapper {
  display:flex;
  padding: 10px;
  color: #77838f;
  font-size: .9em;
  overflow: visible;

  :deep(.invite-avatar-wrapper) {
    flex: 1 0 200px;

    .avatar {
      width: 200px !important;
      height: 200px !important;
    }
  }

  .invite-detail-wrapper {
    flex: 1 0 50%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .icon-item {
      padding-bottom: 8px;
    }
  }
}

.rtl-at-root {
  .modal-title {
    :deep(.badge) {
      margin-left: .5rem;
      margin-right: unset;
    }
  }
}
</style>
