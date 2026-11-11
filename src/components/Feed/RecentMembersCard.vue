<template>
  <!-- If there is any error, this card should simply be hidden -->
  <ProfileCard
    v-if="loading || recentMembers"
    :title="$t('feed.recent-members.title')"
    class="recent-members-card"
  >
    <Spinner v-if="loading" />
    <template v-else-if="recentMembers">
      <Carousel
        class="recent-members-card__carousel"
        :items-to-show="2"
        :items-to-scroll="2"
        snap-align="start"
        :wrap-around="false"
      >
        <Slide
          v-for="(item, index) in recentMembers"
          :key="index"
          class="p-1 recent-member__item"
        >
          <ProfileAvatar
            linkable
            :profile="item"
            size="50px"
            thumbnail="medium"
          />
          <div class="d-flex flex-column py-3 align-items-center">
            <BLink
              :to="{ name: 'Profile', params: { handle: item.handle } }"
              class="recent-member__handle"
            >
              {{ item.displayName }}
            </BLink>
            <div class="recent-member__location">
              {{ getLocationDisplay(item.primaryLocation) }}
            </div>
            <div class="recent-member__date">
              {{ generateDateDiffString(item.createdAt) }}
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </template>
  </ProfileCard>
</template>

<script lang="ts">
import 'vue3-carousel/dist/carousel.css'

import { computed, defineComponent } from 'vue'
import { Carousel, Navigation,Slide } from 'vue3-carousel'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useRecentMembersQuery } from '@/composables/graphql/generated'
import { generateDateDiffString,getLocationDisplay } from '@/utils'

const LIMIT = 9

export default defineComponent({
  name: 'RecentMembersCard',
  components: {
    ProfileAvatar,
    ProfileCard,
    Carousel,
    Slide,
    Navigation
  },
  setup() {
    const { loading, result } = useRecentMembersQuery({ limit: LIMIT  })
    const recentMembers = computed(() => result.value?.recentMembers?.profiles || [])
    const settings = computed(() => {
      return {
        itemsToShow: 2,
        itemsToSlide: 2,
        centerMode: false,
        wheelControl: false
      }
    })

    return {
      generateDateDiffString,
      getLocationDisplay,
      loading,
      settings,
      recentMembers,
    }
  }
})
</script>

<style lang="scss" scoped>
.recent-members-card :deep(.card-content) {
  display: flex;
  overflow: hidden;
}

.recent-members-card__carousel {
  width: 100%;
}

.recent-member__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;

  .recent-member__handle {
    color: $colorText;
    font-weight: bold;
  }

  .recent-member__location {
      font-size: 0.8em;
  }

  .recent-member__date {
      font-size: 0.8em;
      font-style: italic;
      color: $colorSecondary;
  }
}

:deep(:focus) {
  outline: none;
}

:deep(.carousel) {
  height: 100%;
}
:deep(.carousel__prev) {
  transform: translateX(-22px);
  top: calc(50% - 40px);
}
:deep(.carousel__next) {
  transform: translateX(22px);
  top: calc(50% - 40px);
}
</style>
