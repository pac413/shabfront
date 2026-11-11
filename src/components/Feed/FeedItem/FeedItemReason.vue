<template>
  <div class="feed-item-reason">
    <span v-if="type === 'comment'">
      <ProfileLinkableName :profile="postedByProfile" /> {{ $t('post.post-reason.commented') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import { storeKey } from '@/store'
import type { SimpleProfile } from '@/types'

export default defineComponent({
  name: 'FeedItemReason',
  components: { ProfileLinkableName },
  props: {
    type: {
      type: String,
      required: true,
    },
    postedBy: {
      type: [String, Object as () => SimpleProfile],
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )

    const postedByProfile = computed(() => {
      return typeof props.postedBy === 'string'
        ? simpleProfileById.value(props.postedBy)
        : props.postedBy
    })

    return {
      postedByProfile
    }
  },
})
</script>

<style lang="scss" scoped>
  .feed-item-reason {
    display: flex;
  }
</style>
