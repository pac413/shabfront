<template>
  <div class="container">
    <BRow class="messages-inbox">
      <transition name="slide">
        <BCol
          sm="12"
          md="5"
          class="messages-inbox__conversations d-md-block"
          :class="{
            'd-none': currentConversation,
            'ps-md-0': isRtl,
            'pe-md-0': !isRtl
          }"
        >
          <conversation-list />
        </BCol>
      </transition>
      <transition name="slide">
        <BCol
          v-if="currentConversation"
          sm="12"
          md="7"
          class="messages-inbox__messages-container"
          :class="{
            'pe-md-0': isRtl,
            'ps-md-0': !isRtl
          }"
        >
          <div class="messages-inbox__messages">
            <message-header />
            <message-list class="messages-inbox__messages-list" />
            <message-control v-if="!isPending" />
          </div>
        </BCol>
      </transition>
    </BRow>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type ZenObservable from 'zen-observable'

import ConversationList from '@/components/Messages/ConversationList.vue'
import MessageControl from '@/components/Messages/MessageControl.vue'
import MessageHeader from '@/components/Messages/MessageHeader.vue'
import MessageList from '@/components/Messages/MessageList.vue'
import { useIsRtl } from '@/composables/useIsRtl'
import { storeKey } from '@/store'
import type { Conversation } from '@/types'
import { getConversationOpponent, getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'MessagesInbox',
  components: {
    ConversationList,
    MessageHeader,
    MessageList,
    MessageControl
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const { isRtl } = useIsRtl()
    const activeProfileId = computed(() => store.state.auth.profileId)
    const currentConversation = computed(() => store.state.message.currentConversation)
    const conversations = computed<Conversation[]>(() => store.getters['message/conversations'])
    const isPending = computed<boolean>(() => store.getters['message/currentConversationPending'])
    const opponentProfileHandle = computed(() => getSingleIdFromRouteParam(route.params.handle))
    const conversationId = computed(() => getSingleIdFromRouteParam(route.params.conversationId))
    const conversationSubscriber = ref<ZenObservable.Subscription | null>(null)
    const userIsTypingSubscriber = ref<ZenObservable.Subscription | null>(null)
    const incomingMessageSubscriber = ref<ZenObservable.Subscription | null>(null)

    const loadConversations = async () => {
      await store.dispatch('message/getConversations', { reset: true })
    }

    const ensureInitialConversationLoaded = async () => {
      /**
       * Check if the route has indicated the `opponent profile Id` as params.
       * If not, select the first conversation by default.
       */
      if (!opponentProfileHandle.value && !conversationId.value) {
        await store.commit('message/SET_CURRENT_CONVERSATION', null)
        return
      }
      const existingConversation = conversations.value.find(c => {
        if (c.id === conversationId.value) {
          return true
        }
        if (opponentProfileHandle.value) {
          if (c.isBroadcast) {
            return false
          }
          const otherParticipant = getConversationOpponent(c, activeProfileId.value!)
          return otherParticipant && otherParticipant.profile.handle === opponentProfileHandle.value
        }
      })
      if (existingConversation) {
        return loadConversation(existingConversation)
      }

      if (opponentProfileHandle.value) {
        return createConversation()
      }
    }

    const loadConversation = async (conversation: Conversation) => {
      store.commit('message/SET_CURRENT_CONVERSATION', conversation)
      await store.dispatch('message/getMessagesForCurrentConversation', { reset: true })
      store.commit('message/SET_MESSAGE_LIST_SCROLL_TO_BOTTOM', true)
      await store.dispatch('message/markMessagesAsRead')
      await store.dispatch('message/getConversation', conversation.id)

      incomingMessageSubscriber.value?.unsubscribe()
      incomingMessageSubscriber.value = await store.dispatch('message/subscribeToIncomingMessages', conversation.id)
    }

    const createConversation = async () => {
      let conversation: Conversation

      try {
        conversation = await store.dispatch('message/createConversation', [opponentProfileHandle.value])
      } catch (err: any) {
        router.push('/messages')
        throw err
      }
      return loadConversation(conversation)
    }

    watch(opponentProfileHandle, () => ensureInitialConversationLoaded())
    watch(conversationId, () => ensureInitialConversationLoaded())

    onMounted(async () => {
      if (!navigator.mediaDevices) {
        console.warn('Media Devices are not supported from your browser.')
      }

      await loadConversations()
      await ensureInitialConversationLoaded()

      conversationSubscriber.value =
        await store.dispatch('message/subscribeToConversations')
      userIsTypingSubscriber.value =
        await store.dispatch('message/subscribeToUserIsTyping')
      store.dispatch('message/startUserIsTypingChecks')
    })

    onBeforeUnmount(() => {
      store.dispatch('message/stopUserIsTypingChecks')
      if (conversationSubscriber.value) {
        conversationSubscriber.value.unsubscribe()
      }
      if (userIsTypingSubscriber.value) {
        userIsTypingSubscriber.value.unsubscribe()
      }
      if (incomingMessageSubscriber.value) {
        incomingMessageSubscriber.value.unsubscribe()
      }
    })

    return {
      activeProfileId,
      conversations,
      createConversation,
      currentConversation,
      ensureInitialConversationLoaded,
      isPending,
      isRtl,
      loadConversation,
      loadConversations,
      opponentProfileHandle,
    }
  }
})
</script>

<style lang="scss" scoped>
.messages-inbox {
  flex: 1 1 auto;
  font-size: 14px;
  background: white;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  height: 100%;
  overflow: hidden;
}

.messages-inbox__conversations {
  height: 100%;
  box-shadow: 10px 0px 25px rgba(0, 0, 0, 0.05);
  z-index: 1;
  overflow: hidden;
  transition: all .5s;
  padding: 0;
}

.messages-inbox__messages-container {
  height: 100%;
  overflow: hidden;
  padding: 0;
}

.messages-inbox__messages {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-inbox__messages-list {
  flex: 1;
}
</style>
