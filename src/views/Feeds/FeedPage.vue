<template>
  <div class="feed-page layout--two-column">
    <div v-if="!mq.mobile" class="two-column__left">
      <VueAffix relative-element-selector="#feed-list" :offset="{ top: 90, bottom: 20 }" :scroll-affix="true">
        <div>
          <ProfileAtAGlanceCard />
          <RecentMembersCard />
          <RecentBlogPostsCard />
        </div>
      </VueAffix>
    </div>
    <div id="feed-list" :class="`two-column__right ${feedListMqClassName}`">
      <FeedList />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import VueAffix from '@/components/Common/VueAffix/VueAffix.vue'
import FeedList from '@/components/Feed/FeedList/FeedList.vue'
import ProfileAtAGlanceCard from '@/components/Feed/ProfileAtAGlanceCard.vue'
import RecentBlogPostsCard from '@/components/Feed/RecentBlogPostsCard.vue'
import RecentMembersCard from '@/components/Feed/RecentMembersCard.vue'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'FeedPage',
  components: {
    VueAffix,
    FeedList,
    ProfileAtAGlanceCard,
    RecentMembersCard,
    RecentBlogPostsCard,
  },
  setup() {
    const store = useStore(storeKey)
    const mq = useMq()
    const feedListMqClassName = computed(() => {
      if (mq.mobile) {
        return 'mobile'
      }
      return ''
    })

    onMounted(() => {
      store.commit('feed/SET_FEED_ITEMS', [])
      store.commit('feed/SET_FEED_TOTAL', 0)
    })

    return {
      feedListMqClassName,
      mq,
    }
  },
})
</script>

<style lang="scss" scoped>
.feed-page {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin: 0 auto;
  font-size: 14px;
  padding: 20px 0 40px;
  flex: 1;

  :deep(.card) {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e4e4e4;
    border-radius: 12px;
    margin-bottom: 1rem;
    padding: 18px 20px;
  }

  .two-column__right.mobile {
    width: 95%;
    margin: 0 auto;
  }
}

.two-column__left {
  float: left;
  position: relative;
}

.two-column__right {
  float: left;
  will-change: height;
}
</style>
