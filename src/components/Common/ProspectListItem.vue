<template>
  <BCard class="prospect-item">
    <div class="prospect-item__container">
      <div
        v-if="selectable"
        class="prospect-item__checkbox"
      >
        <BFormCheckbox
          v-model="selected"
          class="checkbox-red"
          button-variant="secondary"
          @click.stop
        />
      </div>
      <div class="prospect-item__avatar">
        <RouterLink
          target="_blank"
          :to="`/profile/${profile.handle}`"
        >
          <ProfileImage :profile="profile" />
        </RouterLink>
      </div>
      <div class="prospect-item__info">
        <div class="prospect-item__name">
          <RouterLink
            target="_blank"
            :to="`/profile/${profile.handle}`"
          >
            <span class="name link-unstyled">{{ `${profile.firstName} ${profile.lastName}` }}</span>
          </RouterLink>
        </div>
        <div
          v-if="primaryLocationString"
          class="prospect-item__address"
        >
          {{ primaryLocationString }}
        </div>
        <div
          v-if="profile.totals"
          class="prospect-item__metrics"
        >
          <div class="me-3">
            <FaIcon
              :icon="['fal', 'eye']"
              class="me-1"
            />
            {{ profile.totals.views }}
          </div>
          <div>
            <FaIcon
              :icon="['fal', 'calendar-circle-user']"
              class="me-1"
            />
            {{ profile.totals.invites }}
          </div>
        </div>
      </div>
      <div class="prospect-item__details">
        <template v-for="(item, index) of iconItems">
          <IconItem
            v-if="item.text"
            :key="`iconItem${index}`"
            :icon="item.icon"
            :item-text="item.text"
          />
        </template>
      </div>

      <ProfileOverlayMenu
        :profile="profile"
        class="more-menu"
      />
    </div>
  </BCard>
</template>

<script lang="ts">
import { computed,defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileImage from '@/components/Common/ProfileImage.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import { storeKey } from '@/store'
import type { Profile } from '@/types'
import { getActiveOrSinceNotation, getLocationDisplay } from '@/utils'

export default defineComponent({
  name: 'ProspectListItem',
  components: { ProfileImage, ProfileOverlayMenu },
  props: {
    profile: {
      required: true,
      type: Object as () => Profile
    },
    selectable: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useStore(storeKey)
    const { t } = useI18n()

    const profilesSelection = computed(() => store.state.search.profilesSelection)
    const selected = computed({
      get: () => profilesSelection.value[props.profile.id],
      set: (value: boolean) => {
        store.commit('search/SET_PROFILE_SELECTION', {
          [props.profile.id]: value
        })
      }
    })
    const primaryLocationString = computed(() => getLocationDisplay(props.profile.primaryLocation))
    const occupation = computed(() => {
      return props.profile.occupation || props.profile.uncuratedOccupation
    })
    const iconItems = computed(() => {
      const { dateActive, createdAt, religiousAffiliation, organization } = props.profile
      let dateString = getActiveOrSinceNotation(createdAt!, dateActive!)

      return [
        {
          icon: ['fal', 'user'],
          text: religiousAffiliation ? t(`profile-view.intro.affiliation-${religiousAffiliation}`) : ''
        },
        {
          icon: ['fal', 'briefcase'],
          text: occupation.value,
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

    return {
      selected,
      primaryLocationString,
      iconItems
    }
  }
})
</script>

<style lang="scss" scoped>
.prospect-item {
  padding: 1rem 1.5rem;
  margin-bottom: 10px;

  & > .card-body {
    padding: 0;
  }
}

.prospect-item__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prospect-item__checkbox {
  padding: 1rem;
}

.prospect-item__avatar {
  a {
    align-items: center;
    display: flex;
  }

  :deep(.avatar) {
    width: 60px;
    height: 60px;
    margin-right: 1rem;
  }

  :deep(.text-avatar) {
    .text {
      font-size: 32px;
    }
  }
}

.prospect-item__info {
  flex: 1;
  overflow: hidden;
  margin-right: 1rem;

  .prospect-item__name {
    font-size: 1.2rem;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    a {
      color: inherit;
    }
  }

  .prospect-item__address {
    font-size: 0.75rem;
    color: grey;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .prospect-item__metrics {
    display: flex;
    align-items: center;
    font-size: 0.6rem;
    margin-top: 0.25rem;
  }
}

.prospect-item__details {
  flex: 2;
  font-size: 0.8rem;
  overflow: hidden;

  :deep(.icon-item-detail) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>
