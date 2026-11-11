<template>
  <BModal
    :id="id"
    v-model="show"
    lazy
    centered
    hide-footer
    modal-class="participants-list-modal"
    :title="title"
    @hidden="onClose"
  >
    <div
      class="w-100 pull-if-rtl-label participants-list-container"
    >
      <div
        v-for="participant of participants"
        :key="participant.id"
        class="participants-list__item"
      >
        <ProfileAvatar
          linkable
          class="participants-list__item__avatar"
          size="35px"
          :profile="participant.profile"
        />
        <ProfileLinkableName
          class="participants-list__item__name"
          :profile="participant.profile"
        />
        <RouterLink
          target="_blank"
          :to="`/messages/${participant.profile.handle}`"
          class="btn btn-outline-danger participants-list__item__message"
        >
          {{ $t('messages.direct-message') }}
        </RouterLink>
      </div>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import { storeKey } from '@/store'
import type { Conversation } from '@/types'

export default defineComponent({
  name: 'ParticipantsListDialog',
  components: {
    ProfileAvatar,
    ProfileLinkableName,
  },
  props: {
    conversation: {
      type: Object as () => Conversation,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const store = useStore(storeKey)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const show = computed({
      get: () => props.modelValue,
      set: (val: boolean) => context.emit('update:modelValue', val)
    })
    const onClose = () => {
      show.value = false
    }

    const title = computed(() =>
      `${props.conversation.title} (${props.conversation.participants.length - 1} Participants)`
    )

    const participants = computed(() =>
      props.conversation.participants.filter(p => p.profile.id !== activeProfileId.value)
    )

    return {
      id: 'participants-list-modal',
      onClose,
      participants,
      show,
      title,
    }
  }
})
</script>

<style lang="scss" scoped>
.participants-list-modal.show {
  .modal-body {
    padding: 1rem;
  }
}
.participants-list-container {
  max-height: 40vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.participants-list__item {
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.participants-list__item__avatar {
  margin: 0 10px;
}

.participants-list__item__name {
  flex: 1;
}
</style>
