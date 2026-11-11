<template>
  <div class="conversation-list">
    <div class="conversation-list__search-container">
      <search-box
        v-model="search"
        class="conversation-list__search"
        :placeholder="$t('messages.search-conversations')"
        @blur="onSearch"
        @enter="onSearch"
        @reset="onSearch"
      />
    </div>

    <BOverlay
      class="conversation-list__list-container"
      rounded
      opacity="0.6"
      spinner-variant="danger"
      :show="loading"
    >
      <div
        v-infinite-scroll="loadMore"
        class="conversation-list__list"
        :infinite-scroll-disabled="loading"
        :infinite-scroll-distance="INFINITE_SCROLL_DISTANCE"
        :infinite-scroll-throttle-delay="INFINITE_SCROLL_THROTTLE_DELAY"
      >
        <transition-group name="fade">
          <template v-for="conversation in conversations">
            <broadcast-conversation-list-item
              v-if="conversation.isBroadcast && conversation.initiator && conversation.initiator.id === activeProfileId"
              :key="conversation.id"
              :conversation="conversation"
            />
            <conversation-list-item
              v-else
              :key="conversation.id"
              :conversation="conversation"
            />
          </template>
        </transition-group>
      </div>
    </BOverlay>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

import SearchBox from '@/components/Common/SearchBox.vue'
import { storeKey } from '@/store'
import type { Conversation } from '@/types'
import { INFINITE_SCROLL_DISTANCE, INFINITE_SCROLL_THROTTLE_DELAY } from '@/utils'

import BroadcastConversationListItem from './BroadcastConversationListItem.vue'
import ConversationListItem from './ConversationListItem.vue'

/**
 * Component to render available conversations.
 */
export default defineComponent({
  name: 'ConversationList',
  components: {
    BroadcastConversationListItem,
    ConversationListItem,
    SearchBox
  },
  setup() {
    const store = useStore(storeKey)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const conversations = computed<Conversation[]>(() => store.getters['message/conversations'])
    const loading = computed(() => store.state.message.conversationsLoading)
    const search = ref<string>('')
    const onSearch = async () => {
      store.commit('message/SET_CONVERSATION_SEARCH_STRING', search.value)
      await store.dispatch('message/getConversations', { reset: true })
    }
    const loadMore = async () => {
      if (loading.value) { return }
      await store.dispatch('message/getConversations', { reset: false })
    }

    watch(search, () => onSearch(), { immediate: true })

    return {
      activeProfileId,
      conversations,
      INFINITE_SCROLL_DISTANCE,
      INFINITE_SCROLL_THROTTLE_DELAY,
      loading,
      loadMore,
      onSearch,
      search,
    }
  }
})
</script>

<style lang="scss" scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #FFFFFF;
}

.conversation-list__search-container {
  display: flex;
  align-items: center;
  height: 74px;
  padding: 16px 15px;
  background: $colorMessaging;
  border-right: 0.5px solid #C2C2C2;
  border-bottom: 0.5px solid #C2C2C2;
}

.conversation-list__search {
  width: 100%;
  margin-bottom: 0;
}

.conversation-list__list-container {
  flex: 1 1 auto;
  overflow: hidden;
}

.conversation-list__list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
