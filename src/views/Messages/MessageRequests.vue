<template>
  <requests
    :requests="requests"
    :title="$t('message-requests.title')"
    :loading="loading"
    :no-requests-phrase="$t('message-requests.noMessageRequests')"
    @loadMore="loadMore"
  >
    <template #actions="props">
      <BButton
        variant="link"
        @click="rejectRequest(props.item)"
      >
        {{ $t('message-requests.delete') }}
      </BButton>
      <BButton
        variant="primary"
        @click="approveRequest(props.item)"
      >
        {{ $t('message-requests.accept') }}
      </BButton>
    </template>
  </requests>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import Requests from '@/components/Common/Requests.vue'
import { storeKey } from '@/store'
import { ConversationParticipantStatus, type GenericRequest } from '@/types'

export default defineComponent({
  name: 'MessageRequests',
  components: { Requests },
  setup() {
    const store = useStore(storeKey)
    const pendingConversations = computed(() => store.state.message.pendingConversations || [])
    const loading = computed(() => store.state.message.pendingConversationsLoading)
    const requests = computed<GenericRequest[]>(() => pendingConversations.value.map(item => ({
      requestId: item.id,
      // the participant with the default "approved" status is a requester
      profile: item.participants.find(participant =>
        participant.status === ConversationParticipantStatus.APPROVED)!.profile
    }))
    )

    const loadMore = (reset: boolean = false) => {
      store.dispatch({
        type: 'message/getPendingConversations',
        reset
      })
    }

    const rejectRequest = (request: GenericRequest) => {
      store.dispatch('message/rejectConversation', request.requestId)
    }

    const approveRequest = (request: GenericRequest) => {
      store.dispatch('message/approveConversation', request.requestId)
    }

    return {
      approveRequest,
      loading,
      loadMore,
      pendingConversations,
      rejectRequest,
      requests,
    }
  }
})
</script>
