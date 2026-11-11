<template>
  <BPopover
    ref="popoverRef"
    :target="triggerId"
    container="body"
    custom-class="likes-popover"
    placement="bottom"
  >
    <span v-if="!count">{{ $t('feed.likes.post-likes') }}</span>
    <div
      v-else
      class="likes-popover-body"
    >
      <b class="mb-2">{{ $t('feed.likes.liked-by') }}</b>

      <div
        v-for="(like, index) in likes"
        :key="index"
        class="feed-item-likes__likedby mb-1"
      >
        <RouterLink
          v-if="simpleProfileById(like.likedBy)"
          target="_blank"
          :to="`/profile/${simpleProfileById(like.likedBy).handle}`"
          class="profile-link mx-2"
        >
          <ProfileAvatar
            thumbnail="small"
            :profile="simpleProfileById(like.likedBy)"
            class="profile-avatar"
          />
          <b> {{ simpleProfileById(like.likedBy).displayName }}</b>
        </RouterLink>
      </div>
      <div class="likes-popover__all" @click.prevent="viewAll">
        <b>{{ $t('feed.likes.view-all', { count: count }) }}</b>
      </div>
    </div>
  </BPopover>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { storeKey } from '@/store'
import type { PostLike, SimpleProfile } from '@/types'

export default defineComponent({
  name: 'LikesPopover',
  components: { ProfileAvatar },
  props: {
    count: {
      type: Number,
      required: true,
    },
    likes: {
      type: Array as () => PostLike[],
      required: true,
    },
    triggerId: {
      type: String,
      required: true,
    },
  },
  emits: ['view-all'],
  setup(props, context) {
    const store = useStore(storeKey)
    const popoverRef = ref<any | null>(null)
    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )
    const displayName = (id: string) => {
      const profile = simpleProfileById.value(id)
      return profile?.displayName || null
    }
    const viewAll = () => {
      popoverRef.value?.toggle()
      context.emit('view-all')
    }

    return {
      simpleProfileById,
      displayName,
      popoverRef,
      viewAll,
    }
  }
})
</script>

<style lang="scss">
.likes-popover {
  background: rgba(0, 0, 0, 0.8);
  border: none;

  .popover-body {
    padding: 8px;
    font-size: 12px;
  }

  &.bs-popover-bottom {
    top: -4px !important;

    .popover-arrow {
      top: -7px !important;
    }
  }

  &.bs-popover-top {
    top: 4px !important;

    .popover-arrow {
      bottom: -7px !important;
    }
  } 

  .popover-arrow {
    &::after, &::before {
      border-bottom-color: rgba(0, 0, 0, 0.8) !important;
      border-top-color: rgba(0, 0, 0, 0.8) !important;
    }
  }

  .likes-popover-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    color: white;
  }

  .likes-popover__all {
    color: $colorRed;
    text-decoration: underline;
    cursor: pointer;
  }

  .profile-link {
    color: #fff;
    display: flex;
    align-items: center;
  }
  
  .profile-avatar {
    margin-right: 8px;
  }
}
</style>
