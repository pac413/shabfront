<template>
  <ProfileCard :icon="['fal', 'binoculars']" :title="$t('profile-view.general.profile-views')">
    <div v-if="anonymousBrowsing" class="gray-text">
      {{ $t('profile-view.anonymous-browse.card-prompt') }}
    </div>
    <picture-grid
      v-else-if="totalViewers !== 0"
      id="viewers-card"
      :items="profileViews"
      :total="totalViewers"
      :loading="loading"
      :max="5"
      @view-all="$emit('view-all')"
    >
      <template #item="{ item }">
        <ProfileAvatar
          :profile="item.viewer"
          :square="true"
          size="100%"
          style="font-size: 5rem"
          class="img-responsive"
          linkable
          thumbnail="medium"
        />
        <div class="name link-unstyled">
          <span class="viewer-item__title">{{ item.viewer.displayName }}</span>
          <span class="viewer-item__subtitle">{{ getAgoString(item.lastVisited) }}</span>
        </div>
      </template>
    </picture-grid>
    <div v-else class="text-secondary pb-3">
      {{ $t('profile-view.anonymous-browse.no-viewers') }}
    </div>
    <template #footer>
      <div class="card-footer toggle-anonymous">
        <BLink @click.prevent="changeAnonymousStatus">
          {{ anonymousTitle }}
        </BLink>
        <FaIcon id="anonymous-popover" :icon="['fal', 'question-circle']" />
        <BPopover
          target="anonymous-popover"
          click
          placement="right"
          container="body"
          custom-class="anonymous-popover"
        >
          <template #title>
            {{ anonymousTitle }}
          </template>
          {{ anonymousDescription }}
        </BPopover>
      </div>
    </template>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import PictureGrid from '@/components/Common/PictureGrid.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useProfileViews } from '@/composables/useProfileViews'
import { storeKey } from '@/store'
import { getAgoString,PROFILE_LIST_PAGE_SIZE } from '@/utils'

export default defineComponent({
  name: 'ViewersCard',
  components: { PictureGrid, ProfileCard, ProfileAvatar },
  emits: ['view-all'],
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const currentProfileId = computed(() => store.state.profile.currentProfile?.id)
    const currentSettings = computed(() => store.state.profileSettings.currentSettings)
    const anonymousBrowsing = computed(() => currentSettings.value?.anonymousBrowsing || false)
    const anonymousStatus = computed(() => anonymousBrowsing.value ? 'disable' : 'enable')
    const anonymousTitle = computed(() =>
      t(`profile-view.anonymous-browse.${anonymousStatus.value}-title`).toString()
    )
    const anonymousDescription = computed(() =>
      t(`profile-view.anonymous-browse.${anonymousStatus.value}-content`).toString()
    )

    const variables = computed(() => {
      const currentProfile = store.state.profile.currentProfile
      const activeProfile = store.state.profile.activeProfile
      return {
        limit: PROFILE_LIST_PAGE_SIZE,
        profileId: currentProfile ? currentProfile.id : activeProfile!.id,
      }
    })
    const {
      loading,
      fetchMoreProfileViews,
      profileViews,
      total,
    } = useProfileViews(variables)

    const changeAnonymousStatus = () => {
      if (!currentProfileId.value) {
        return
      }
      store.dispatch('profileSettings/updateProfileSettings', {
        profileId: currentProfileId.value,
        setting: 'anonymousBrowsing',
        value: !anonymousBrowsing.value,
      })
    }

    return {
      anonymousBrowsing,
      anonymousDescription,
      anonymousStatus,
      anonymousTitle,
      changeAnonymousStatus,
      currentProfileId,
      getAgoString,
      loading,
      loadViews: fetchMoreProfileViews,
      profileViews,
      totalViewers: total,
    }
  },
})
</script>

<style lang="scss" scoped>
.toggle-anonymous {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;

  a {
    color: $colorText;
    padding-right: 5px;
  }
  svg {
    cursor: pointer;
  }
}
.gray-text {
  color: gray;
  padding: 10px;
}

.viewer-item__title {
  width: 100%;
  display: block;
}

.viewer-item__subtitle {
  width: 100%;
  display: block;
}

.rtl-at-root {
  .toggle-anonymous {
    a {
      padding-right: unset;
      padding-left: 5px;
    }
  }
}
</style>

<style lang="scss">
/* popovers need unscoped styles because they're injected into the html body, not within #app */
.anonymous-popover {
  max-width: 400px;
  font-size: 0.9rem;

  .popover-header {
    font-size: 0.9rem;
    font-weight: bold;
  }
}
</style>
