<template>
  <div class="posted-by">
    <div class="posted-by__owner-avatar">
      <ProfileAvatar
        linkable
        class="avatar"
        size="3em"
        thumbnail="medium"
        :profile="postedByProfile"
      />
    </div>
    <div class="posted-by__details">
      <div class="posted-by__row posted-by__name">
        <ProfileLinkableName :profile="postedByProfile" />
      </div>
      <div class="posted-by__row posted-by__time">
        <span
          v-if="showTrending && lastActivityAt"
          class="posted-by__trending"
        >
          <FaIcon
            :icon="['fas', 'fire']"
            class="posted-by__trending-icon"
          />
          <span>{{ $t('post.trending') }}: </span>
          <AgoString :date="lastActivityAt" />
        </span>
        <AgoString
          v-else
          :date="updatedAt"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import { storeKey } from '@/store'
import type { SimpleProfile } from '@/types'

export default defineComponent({
  name: 'PostedBy',
  components: {
    AgoString,
    ProfileAvatar,
    ProfileLinkableName
  },
  props: {
    postedBy: {
      type: [String, Object as () => SimpleProfile],
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
    lastActivityAt: {
      type: String,
      default: null,
    },
    showTrending: {
      type: Boolean,
      default: false,
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
    const computedMeta = computed(() => ({
      meta: [{
        vmid: 'fb_title_meta',
        property: 'og:title',
        content: postedByProfile.value?.displayName || ''
      }]
    }))

    useHead(computedMeta)

    return {
      postedByProfile,
    }
  }
})
</script>

<style lang="scss" scoped>
.posted-by {
  display: flex;
  align-items: center;
}

.posted-by__owner-avatar {
  margin-right: 0.5rem;
}

.posted-by__name {
  display: flex;
  align-items: center;
  a {
    color: $colorText;
  }
}

.posted-by__time {
  color: #65676b;
  font-size: 13px;
}

.posted-by__details {
  flex: 1;
}

.posted-by__trending {
  .posted-by__trending-icon {
    margin-top: -4px;
    margin-right: 3px;
    color: $colorRed;
  }
}

.rtl-at-root {
  .posted-by__owner-avatar {
    margin-right: 0;
    margin-left: 0.5rem;
  }

  .posted-by__time {
    text-align: right;
  }
}
</style>
