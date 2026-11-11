<template>
  <div class="hosting-list-item py-2 px-3">
    <ProfileAvatar
      linkable
      class="avatar"
      size="4em"
      thumbnail="medium"
      :profile="subjectProfile"
    />
    <div
      class="item-details px-3 w-100"
      @click="$emit('view')"
    >
      <div> {{ subjectProfile.displayName }} </div>
      <div class="secondary-text">
        {{ hosting.type === InviteType.INVITATION? $t('planner.invited-for') : $t('planner.requested-hosting') }}
        {{ mealsText }}
      </div>
      <template v-for="(note, index) in hosting.notes">
        <speech-bubble
          v-if="note.body && note.body.length"
          :key="index"
          :arrow-right="role === note.sender"
        >
          {{ note.body }}
        </speech-bubble>
      </template>
    </div>

    <div class="item-actions">
      <template v-if="isRecipient && !isExpired && hosting.status === InviteStatus.PENDING">
        <BButton
          pill
          variant="link"
          @click.prevent="decline"
        >
          {{ $t('invites.modal.decline') }}
        </BButton>
        <BButton
          pill
          variant="primary"
          class="ms-2"
          @click.prevent="accept"
        >
          {{ $t('invites.modal.accept') }}
        </BButton>
      </template>
      <status-badge
        v-else
        :status="hosting.status"
        :type="hosting.type"
        :is-expired="isExpired"
        :is-recipient="isRecipient"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import SpeechBubble from '@/components/Common/SpeechBubble/SpeechBubble.vue'
import StatusBadge from '@/components/Invites/StatusBadge.vue'
import { IHostingRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type InviteDetail, InviteStatus, InviteType } from '@/types'
import { inviteParts,isPast } from '@/utils'

export default defineComponent({
  name: 'InboxListItem',
  components: {
    ProfileAvatar,
    StatusBadge,
    SpeechBubble
  },
  props: {
    hosting: {
      type: Object as () => InviteDetail,
      required: true,
    },
    subject: {
      type: String as () => IHostingRole,
      required: true,
    },
  },
  emits: ['view', 'accept', 'decline'],
  setup(props, context) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const getIsRecipient = computed<(invite: InviteDetail) => boolean>(() =>
      store.getters['invites/isRecipient']
    )
    const role = computed(() => {
      return props.subject === IHostingRole.Host ? IHostingRole.Guest : IHostingRole.Host
    })

    const subjectProfile = computed(() => {
      const subjectProfile = props.subject.toLowerCase() as keyof InviteDetail
      return props.hosting[subjectProfile]
    })

    const mealsText = computed(() => {
      if (!props.hosting) {return ''}
      return inviteParts(props.hosting).map(item => t('invites.hosting-part.' + item).toString()).join(', ')
    })

    const isExpired = computed(() => {
      return isPast(props.hosting.date)
    })

    const isRecipient = computed(() => {
      return getIsRecipient.value(props.hosting)
    })

    const accept = () => {
      const senderParts = props.subject.toLowerCase() + 'Parts' as keyof Pick<InviteDetail, 'hostParts' | 'guestParts'>
      context.emit('accept', {
        id: props.hosting.id,
        parts: props.hosting[senderParts]
      })
    }

    const decline = () => {
      context.emit('decline', { id: props.hosting.id })
    }
    
    return {
      accept,
      decline,
      getIsRecipient,
      InviteStatus,
      InviteType,
      isExpired,
      isRecipient,
      mealsText,
      subjectProfile,
      role,
    }
  }
})
</script>

<style lang="scss" scoped>
.hosting-list-item {
  background-color: white;
  display: flex;
  align-items: center;
  border: solid 1px $colorLightGrey2;

  &:hover {
    background-color:  $colorLightGrey2;
  }

  &:not(:last-of-type) {
    border-bottom: none;
  }

  .item-details {
    flex: 1;
    cursor: pointer
  }

  .avatar {
    box-shadow: 1px 1px 3px rgba(0,0,0,.2);
    align-self: flex-start;
  }

  :deep(.alert) {
    padding: 0.4em 0.8em;
    font-size: 0.9rem;
    margin-bottom: 0;
  }

  :deep(.btn) svg {
    margin-right: 4px;
  }
}

.rtl-at-root {
  .hosting-list-item {
    :deep(.btn) svg {
      margin-left: 4px;
      margin-right: unset;
    }
  }
}
</style>
