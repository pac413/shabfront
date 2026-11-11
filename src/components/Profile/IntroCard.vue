<template>
  <div
    v-if="profile"
    class="intro-card__wrapper"
  >
    <div class="intro-card__main">
      <div class="intro-card__username">
        {{ profile.displayName }}
      </div>
      <div class="role-wrapper">
        {{ profileRole }}
      </div>
      <div
        v-if="profileAbout"
        class="about-wrapper"
        :class="{ 'truncated': isTruncated }"
      >
        <div class="about-details">
          <p
            ref="aboutRef"
            :class="{ 'truncated': isTruncated }"
          >
            {{ profileAbout }}
          </p>
          <span
            v-if="isTruncated"
            role="button"
            class="text-muted"
            @click="showFullProfileAbout"
          >
            <em>{{ $t('profile-view.intro.show-more') }}</em>
          </span>
        </div>
        <BLink
          v-if="viewingSelf"
          class="edit-icon btn btn-link"
          to="/profile/edit/about-me"
        >
          <FaIcon
            class="icon"
            :icon="['fal', 'pencil-alt']"
          />
        </BLink>
      </div>
      <IntroButtons />
    </div>
    <div class="intro-card__intro-list">
      <template v-for="(item, index) of iconItems">
        <IconItem
          v-if="item.text"
          :key="`iconItem${index}`"
          :icon="item.icon"
          :item-text="item.text"
          :item-link="item.link"
        />
      </template>
    </div>
  </div>
  <BModal
    v-model="shouldShowFullProfileAbout" 
    ok-only 
    scrollable 
    hide-header
    size="lg"
  >
    <div class="full-about-details">
      {{profileAbout}}
    </div>
  </BModal>
</template>

<script lang="ts">
import _ from 'lodash'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import IntroButtons from '@/components/Profile/IntroButtons.vue'
import { storeKey } from '@/store'
import { SearchFor } from '@/types'
import { getActiveOrSinceNotation, getLocationDisplay } from '@/utils'

export default defineComponent({
  name: 'IntroCard',
  components: {
    IntroButtons
  },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const router = useRouter()
    const profile = computed(() => store.state.profile.currentProfile)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const isTruncated = ref<boolean>(false)
    const aboutRef = ref<Element | null>(null)
    const profileRole = computed(() => {
      return profile.value?.siteRoles.map(role => _.capitalize(role)).join(', ')
    })

    const profileAbout = computed(() => {
      const placeholder = `${profile.value?.firstName}, ${t('profile-view.intro.about-placeholder')}`
      const about = profile.value?.about ? profile.value?.about.trim() : ''
      return about || (viewingSelf.value ? placeholder : '')
    })

    const occupation = computed(() => {
      return profile.value?.occupation || profile.value?.uncuratedOccupation
    })

    const occupationLink = computed(() => {
      return router.resolve({
        name: 'Search',
        query: {
          type: SearchFor.all,
          occupation: occupation.value
        }
      }).href
    })

    const locationLink = computed(() => {
      if (!profile.value?.primaryLocation) {
        return
      }
      const { city, state, country } = profile.value?.primaryLocation
      return router.resolve({
        name: 'Search',
        query: {
          type: SearchFor.all,
          city,
          state,
          country
        }
      }).href
    })

    const iconItems = computed(() => {
      const { dateActive, createdAt, religiousAffiliation, organization } = profile.value || {}
      let dateString = getActiveOrSinceNotation(createdAt!, dateActive!)

      return [
        {
          icon: ['fal', 'globe-americas'],
          text: getLocationDisplay(profile.value!.primaryLocation)
          // link: this.locationLink
        },
        {
          icon: ['fal', 'user'],
          text: religiousAffiliation ? t(`profile-view.intro.affiliation-${religiousAffiliation}`) : ''
        },
        {
          icon: ['fal', 'briefcase'],
          text: occupation.value,
          link: occupationLink.value
        },
        {
          icon: ['fal', 'graduation-cap'],
          text: organization ? `${t('profile-view.intro.affiliated-with')} ${organization}` : ''
        },
        {
          icon: ['fal', 'laptop'],
          text: dateString
        }
      ]
    })

    /**
     * custom js logic for about <p> tag
     * check if aboutMe string is more than 3 lines
     * if yes, add additional class to Show More button to hide it
     */
    const checkAboutIfTruncated = () => {
      const ps = aboutRef.value
      return !!ps && ps.scrollHeight > ps.clientHeight
    }

    watch(profile, () => {
      nextTick(() => {
        isTruncated.value = checkAboutIfTruncated()
      })
    }, { immediate: true })

    const shouldShowFullProfileAbout = ref(false)

    const showFullProfileAbout = () => {
      shouldShowFullProfileAbout.value = true
    }

    return {
      aboutRef,
      checkAboutIfTruncated,
      iconItems,
      isTruncated,
      locationLink,
      occupation,
      occupationLink,
      profile,
      profileAbout,
      profileRole,
      viewingSelf,
      shouldShowFullProfileAbout,
      showFullProfileAbout
    }
  }
})
</script>

<style lang="scss" scoped>
.intro-card__wrapper {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: black;
}

.intro-card__main {
  flex: 1;
  max-width: 600px;
}
.intro-card__intro-list {
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.intro-card__username {
  color: $colorText;
  font-family: $headerFont;
  font-size: 1.5rem;
  font-weight: bold;
  flex: 1 0 auto;
}

.role-wrapper {
  padding-top: 10px;
}

.about-wrapper {
  display: flex;
  align-items: center;

  &.truncated {
    align-items: flex-end;
  }
}

:deep(.edit-icon) {
  padding-bottom: 10px;
  color: $colorRed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transition: none;
  border: none;

  &:hover, &:focus, &:active {
    color: $colorRed !important;
    background: none;
    border: none;
    opacity: 0.8;
  }
}

.about-details {
  color: $colorSecondary;
  line-height: 1.3rem;
  padding: 10px 0;

  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: pre-line;
    overflow: hidden;
    margin-bottom: 0;
  }

  label {
    font-size: 0.8rem;
    margin-bottom: 0;
  }
}

:deep(.icon-item) {
  line-height: 1.5rem;
  svg {
    color: $colorSecondary;
  }
  a {
    color: inherit;
  }
}

.full-about-details {
  white-space: pre-wrap;
}

@media (max-width: $mobileMaxWidth) {
  .intro-card__wrapper {
    padding: 5px 20px;
    flex-direction: column;
    text-align: center;

    :deep(.intro-buttons) {
      justify-content: center;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: solid 1px #CCC;
    }

    .about-details.self {
      justify-content: center;
    }

    .intro-card__intro-list {
      flex: 1;
      margin: 0 auto;
    }
  }
}
</style>
