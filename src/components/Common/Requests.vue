<template>
  <div class="requests-page mt-3 container">
    <ProfileCard :title="title">
      <BListGroup
        v-infinite-scroll="loadMore"
        class="requests-list"
        :infinite-scroll-disabled="loading"
        :infinite-scroll-distance="INFINITE_SCROLL_DISTANCE"
        :infinite-scroll-throttle-delay="INFINITE_SCROLL_THROTTLE_DELAY"
      >
        <BListGroupItem
          v-for="(item, index) in requests"
          :key="index"
          class="request-item"
        >
          <ProfileAvatar
            linkable
            class="avatar"
            size="4em"
            thumbnail="medium"
            :profile="item.profile"
          />
          <div class="item-content">
            <RouterLink
              target="_blank"
              :to="{ name: 'Profile', params: { handle: item.profile.handle } }"
            >
              <div class="item-name text-body">
                {{ item.profile.firstName }} {{ item.profile.lastName }}
              </div>
            </RouterLink>
            <div class="item-secondary">
              <span>{{ item.profile.uncuratedOccupation }}</span>
              <span v-if="item.profile.about">
                <span v-if="item.profile.uncuratedOccupation"> | </span>
                <span>{{ item.profile.about }}</span>
              </span>
            </div>
          </div>
          <div class="item-actions">
            <slot
              name="actions"
              :item="item"
            />
          </div>
        </BListGroupItem>
      </BListGroup>

      <Spinner v-if="loading" />
      <div
        v-if="!requests.length && !loading"
        class="text-center"
      >
        {{ noRequestsPhrase }}
      </div>
    </ProfileCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import type { GenericRequest } from '@/types'
import { INFINITE_SCROLL_DISTANCE, INFINITE_SCROLL_THROTTLE_DELAY } from '@/utils'

export default defineComponent({
  name: 'Requests',
  components: {
    ProfileAvatar,
    ProfileCard
  },
  props: {
    requests: {
      type: Array as () => GenericRequest[],
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    noRequestsPhrase: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  emits: ['loadMore'],
  setup(props, context) {
    const loadMore = () => {
      context.emit('loadMore')
    }

    onMounted(() => {
      context.emit('loadMore', true)
    })

    return {
      INFINITE_SCROLL_DISTANCE,
      INFINITE_SCROLL_THROTTLE_DELAY,
      loadMore,
    }
  }
})
</script>

<style lang="scss" scoped>
.requests-page {
  display: flex;
  flex-direction: column;
}

.requests-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.request-item {
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 20px;
  display: flex;
  align-items: center;

  &:hover {
    background: #e8e8e8;
  }

  .item-content {
    margin-left: 20px;
    flex-grow: 1;

    .item-secondary {
      font-size: 14px;
      color: rgba(0, 0, 0, .6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 700px;
    }
  }

  .item-actions {
    flex-wrap: nowrap;
    display: flex;

    :deep(.btn) {
      margin-left: 10px;
      font-weight: 700;
    }

    .btn-link {
      color: rgba(0, 0, 0, .6);
    }
  }
}

.rtl-at-root {
  .request-item {
    .item-content {
      margin-left: 0;
      margin-right: 20px;
    }
    .item-actions {
      :deep(.btn) {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
}
</style>
