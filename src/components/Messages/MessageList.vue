<template>
  <div class="messages-list">
    <BLink
      v-if="loading"
      class="messages-list__loader pull-if-rtl-label"
    >
      <FaIcon :icon="['fas', 'spinner']" />
      <span>{{ $t('general.loading') }}...</span>
    </BLink>

    <conversation-pending-alert v-if="isPendingByOpponent" />
    <conversation-rejected-alert v-else-if="isRejectedByOpponent" />
    <conversation-request-form v-if="isPending" />

    <template v-else>
      <div
        ref="scrollerRef"
        class="messages-list__scroller"
        @scroll="onScroll"
      >
        <div class="messages-list__groups">
          <message-group
            v-for="(group, index) of messageGroups"
            :key="index"
            :data="group"
            @delete="maybeDeleteMessage"
            @info="showMessageInfo"
            @open-image="showImage"
            @visible="debouncedVisibleHandler"
            @add-emoji="addEmoji"
          />

          <resize-observer @notify="onMessagesListResize" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import {
  type ConfirmMessageDeleteModalProps,
  type MessageImagePreviewModalProps,
  type MessageInfoModalProps,
  Modal,
  useModalStore
} from '@/stores/modal'
import type { Message, MessageGroup as MessageGroupModel } from '@/types'
import { INFINITE_SCROLL_DISTANCE, MESSAGE_READ_TIME } from '@/utils'

import ConversationPendingAlert from './Alerts/ConversationPendingAlert.vue'
import ConversationRejectedAlert from './Alerts/ConversationRejectedAlert.vue'
import ConversationRequestForm from './ConversationRequestForm.vue'
import MessageGroup from './MessageGroup.vue'


/**
 * Component to render message list
 */
export default defineComponent({
  name: 'MessageList',
  components: {
    ConversationRequestForm,
    ConversationRejectedAlert,
    ConversationPendingAlert,
    MessageGroup
  },
  setup() {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const currentConversation = computed(() => store.state.message.currentConversation!)
    const activeProfileId = computed(() => store.state.auth.profileId!)
    const messageGroups = computed<MessageGroupModel[]>(() =>
      store.getters['message/groupedMessages']
    )
    const isPending = computed<boolean>(() =>
      store.getters['message/currentConversationPending']
    )
    const isPendingByOpponent = computed<boolean>(() =>
      store.getters['message/currentConversationPendingByOpponent']
    )
    const isRejectedByOpponent = computed<boolean>(() =>
      store.getters['message/currentConversationRejectedByOpponent']
    )
    const forceScrollToBottom = computed(() => store.state.message.scrollToBottom)
    const loading = computed(() => store.state.message.messagesLoading)
    const scrollerRef = ref<HTMLDivElement | null>(null)
    const archiveDlgVisible = ref<boolean>(false)
    const scrollerBottomOffset = ref<number>(0)
    const selectedMessage = ref<Message | null>(null)

    const onScroll = (evt: UIEvent) => {
      saveScrollPosition()
      const target = evt.target as HTMLDivElement
      if (target.scrollTop < INFINITE_SCROLL_DISTANCE) {
        loadMore()
      }
      if (Math.abs(target.scrollTop + target.clientHeight - target.scrollHeight) < INFINITE_SCROLL_DISTANCE) {
        setTimeout(() => {
          store.commit('message/SET_UNREAD_MESSAGE_BREAKPOINT', null)
        }, MESSAGE_READ_TIME)
      }
    }

    const onMessagesListResize = () => restoreScrollPosition()

    const loadMore = async () => {
      await store.dispatch('message/getMessagesForCurrentConversation')
    }

    const saveScrollPosition = () => {
      if (!scrollerRef.value) { return }
      scrollerBottomOffset.value = Math.max(scrollerRef.value.scrollHeight - scrollerRef.value.scrollTop, 0)
    }

    const restoreScrollPosition = () => {
      if (!scrollerRef.value) { return }
      scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight - scrollerBottomOffset.value
    }

    const scrollToBottom = () => {
      if (!scrollerRef.value) { return }
      scrollerBottomOffset.value = 0
      restoreScrollPosition()
      store.commit('message/SET_MESSAGE_LIST_SCROLL_TO_BOTTOM', false)
    }

    const maybeDeleteMessage = (message: Message) => {
      selectedMessage.value = message
      const props: ConfirmMessageDeleteModalProps = {
        message,
        onSuccess: null
      }
      showModal({
        modal: Modal.CONFIRM_MESSAGE_DELETE,
        props
      })
    }

    const showMessageInfo = (message: Message) => {
      selectedMessage.value = message
      const props: MessageInfoModalProps = { data: message }
      showModal({
        modal: Modal.MESSAGE_INFO,
        props
      })
    }

    const archiveMessage = async () => {
      await store.dispatch('message/deleteMessage', selectedMessage.value)
    }

    const showImage = (image: string | ArrayBuffer | null) => {
      const props: MessageImagePreviewModalProps = { image }
      showModal({
        modal: Modal.MESSAGE_IMAGE_PREVIEW_MODAL,
        props
      })
    }

    const onVisible = () => {
      store.dispatch('message/markMessagesAsRead')
    }
    const debouncedVisibleHandler = computed(() => debounce(onVisible, 2000))

    const addEmoji = (messageId: string, emoji: string) => {
      store.dispatch('message/createMessageReaction', {
        conversationId: currentConversation.value.id,
        messageId,
        reaction: emoji,
        activeProfileId
      })
    }

    watch(forceScrollToBottom, () => {
      if (!forceScrollToBottom.value) { return }
      nextTick(() => scrollToBottom())
    })

    onMounted(() => {
      nextTick(() => scrollToBottom())
    })

    return {
      archiveDlgVisible,
      archiveMessage,
      debouncedVisibleHandler,
      forceScrollToBottom,
      isPending,
      isPendingByOpponent,
      isRejectedByOpponent,
      loading,
      loadMore,
      maybeDeleteMessage,
      messageGroups,
      onMessagesListResize,
      onScroll,
      onVisible,
      restoreScrollPosition,
      saveScrollPosition,
      scrollerBottomOffset,
      scrollerRef,
      scrollToBottom,
      selectedMessage,
      showImage,
      showMessageInfo,
      addEmoji,
    }
  }
})
</script>

<style lang="scss" scoped>
.messages-list {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  background-repeat: repeat !important;
  overflow: hidden;
}

.messages-list__scroller {
  flex: 1;
  width: 100%;
  padding: 20px 50px;
  overflow-y: auto;
}

.messages-list__loader {
  position: absolute;
  top: 5px;
  align-self: center;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.35);
  border-radius: 20px;
  color: $colorText;
  display: inline-flex;
  align-items: center;
  z-index: 1000;

  &:hover {
    color: #666;
    text-decoration: none;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  }

  span {
    padding-left: 10px;
  }
}

.messages-list__groups {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
