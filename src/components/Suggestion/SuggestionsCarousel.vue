<template>
  <ProfileCard
    v-if="profiles.length && suggestionsType"
    class="suggestions-wrapper"
    :title="$t(`shabbat-suggestions.titles.${suggestionsType}`)"
  >
    <Carousel
      :items-to-show="4"
      :items-to-scroll="4"
      snap-align="start"
      :wrap-around="false"
      @slide-end="loadMore"
    >
      <Slide
        v-for="(item, index) in profiles"
        :key="index"
        :index="index"
      >
        <SuggestionsCarouselItem
          :item="item"
          class="item"
        >
          <div v-if="item.totals">
            <FaIcon
              :icon="['fas', 'eye']"
              class="me-1"
            />
            {{ item.totals.views }} {{ $t('profile.views') }}
          </div>
          <div v-if="item.totals?.invites">
            <FaIcon
              :icon="['fal', 'user']"
              class="me-1"
            />
            {{ item.totals.invites }} {{ $t('profile.invites') }}
          </div>
        </SuggestionsCarouselItem>
      </Slide>
      <Slide
        v-if="loading || !profiles.length"
        class="loading-slide"
      >
        <Spinner />
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
    <BLink
      :to="{
        name: 'Search',
        query: {
          type: suggestionsType,
          availableToHost: 'true',
          availableForInvites: 'true',
          picturesOnly: 'true'
        }
      }"
      class="view-all-link float-end"
    >
      {{ $t('profile-view.host.view-all') }}
    </BLink>
  </ProfileCard>
</template>

<script lang="ts">
import 'vue3-carousel/dist/carousel.css'

import { computed, defineComponent } from 'vue'
import { Carousel, Navigation,Slide } from 'vue3-carousel'
import { useStore } from 'vuex'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import SuggestionsCarouselItem from '@/components/Suggestion/SuggestionsCarouselItem.vue'
import { ILanguage, IQueryFilterBy, ISearchFor, ISearchSortBy } from '@/composables/graphql/generated'
import { useSearchResult } from '@/composables/useSearchResult'
import { storeKey } from '@/store'
import { SiteRole } from '@/types'

export default defineComponent({
  name: 'SuggestionsCarousel',
  components: {
    Carousel,
    Slide,
    Navigation,
    SuggestionsCarouselItem,
    ProfileCard
  },
  setup() {
    const store = useStore(storeKey)
    const siteRoles = computed<SiteRole[]>(() => store.getters['auth/siteRoles'])
    const suggestionsType = computed(() => {
      if (siteRoles.value.includes(SiteRole.HOST)) {
        return ISearchFor.Guests
      } else if (siteRoles.value.includes(SiteRole.GUEST)) {
        return ISearchFor.Hosts
      }
      return ISearchFor.Hosts
    })
    const variables = computed(() => ({
      filterBy: {
        availableToHost: true,
        availableForInvites: true,
        picturesOnly: true
      },
      language: ILanguage.En,
      limit: 9,
      sortBy: ISearchSortBy.Random,
      queryBy: IQueryFilterBy.Location,
      searchFor: suggestionsType.value,
    }))
    const {
      fetchMoreProfiles,
      loading,
      profiles,
    } = useSearchResult(variables)
    const settings = {
      itemsToShow: 4,
      itemsToSlide: 4,
      centerMode: false,
      wheelControl: false
    }

    const loadMore = (payload: { currentSlide: any }) => {
      const { currentSlide } = payload
      if (!currentSlide || currentSlide + 4 >= profiles.value.length) {
        fetchMoreProfiles()
      }
    }

    return {
      loading,
      loadMore,
      settings,
      siteRoles,
      profiles,
      suggestionsType,
    }
  }
})
</script>

<style lang="scss" scoped>
.suggestions-wrapper {
  :deep(:focus) {
    outline: none;
  }

  :deep(.suggestion-item .card) {
    padding: 0;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, .05);
  }

  :deep(.carousel) {
    height: 100%;
    width: 100%;
    padding: 0;
  }

  :deep(.carousel__prev) {
    padding: 1em 0;
    transform: translateX(-22px);
    top: calc(50% - 60px);
    left: -10px;
  }

  :deep(.carousel__next) {
    padding: 1em 0;
    transform: translateX(22px);
    top: calc(50% - 60px);
    right: -10px;
  }

  :deep(.carousel__slide) {
    display: flex;
    padding: 5px 0;

    .profile-slide {
      width: 100%;
      background-color: white;
      box-shadow: 1px 1px 8px #CCC;
      overflow: hidden;

      .prospect-card__img-container .avatar img {
        border-radius: 0 !important;
      }
    }
  }

  :deep(.loading-slide) {
    align-items: center;
    justify-content: center;
    border: solid 2px #EEE;
    border-radius: 4px;
    background-color: #EFEFEF;
  }

  :deep(.avatar-buttons) {
    opacity: .9;
  }
}
</style>
