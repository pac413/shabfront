<template>
  <ProfileCard v-if="activeProfile" id="at-a-glance__card">
    <div
      class="at-a-glance__wallpaper"
      :style="{
        'background-image': `url(${wallpaperUrl})`,
      }"
    />
    <div class="at-a-glance__content">
      <BLink
        :to="{
          name: 'Profile',
          params: { handle: activeProfile.handle },
        }"
        class="link-unstyled"
      >
        <ProfileAvatar class="at-a-glance__avatar" thumbnail="medium" :profile="activeProfile" />
        <div class="at-a-glance__name text-center">
          {{ $t('feed.profile-at-a-glance.welcome-name', { name: activeProfile.displayName }) }}
        </div>
        <div
          v-if="!activeProfile.avatar"
          v-b-modal.feed-page-upload-picture
          class="add-an-avatar-btn text-center d-block"
          @click.prevent
        >
          {{ $t('feed.profile-at-a-glance.add-an-avatar') }}
        </div>
      </BLink>
      <hr />
      <div v-if="activeProfile.totals" class="totals">
        <BLink class="total" :to="{ name: 'All Viewers' }">
          {{ $t('feed.profile-at-a-glance.views') }}
          <span>{{ activeProfile.totals.views }}</span>
        </BLink>
        <BLink class="total" :to="{ name: 'Friends' }">
          {{ $t('feed.profile-at-a-glance.connections') }}
          <span>{{ activeProfile.totals.connections }}</span>
        </BLink>
        <!-- <BLink :to="{ name: 'ShabbatPlanner' }" class="total">
          {{ $t('profile-view.intro.invites') }}
          <span>{{ activeProfile.totals.invites }}</span>
        </BLink> -->
        <div class="total">
          {{ $t('profile-view.intro.invites') }}
          <span>{{ activeProfile.totals.invites }}</span>
        </div>
      </div>
      <UploadPictureModal
        upmid="feed-page-upload-picture"
        :type="MediaSubType.AVATAR"
        :title="$t('feed.profile-at-a-glance.add-avatar')"
        @submit="onSuccess"
      />
    </div>
  </ProfileCard>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useProfileAtAGlanceCardQuery } from '@/composables/graphql/generated'
import { MediaSubType } from '@/types'
import { getPublicMediaUrl } from '@/utils'

export default defineComponent({
  name: 'ProfileAtAGlanceCard',
  components: {
    ProfileAvatar,
    ProfileCard,
    UploadPictureModal,
  },
  setup() {
    const { refetch, result } = useProfileAtAGlanceCardQuery({ fetchPolicy: 'cache-and-network' })
    const activeProfile = computed(() => result.value?.profile?.profile)

    const wallpaperUrl = computed(() => {
      if (!activeProfile.value) {
        return null
      }

      const { wallpaper } = activeProfile.value
      if (!wallpaper || !wallpaper.original) {
        return null
      }

      return getPublicMediaUrl(wallpaper.original)
    })

    const onSuccess = () => {
      refetch()
    }

    return {
      activeProfile,
      MediaSubType,
      onSuccess,
      wallpaperUrl,
    }
  },
})
</script>

<style lang="scss" scoped>
.card#at-a-glance__card {
  padding: 0;

  :deep(.card-content) {
    padding: 0;
    border-radius: inherit;
  }
}

.add-an-avatar-btn {
  color: $colorRed;
  cursor: pointer;
}

.at-a-glance__wallpaper {
  padding: 0;
  height: 75px;
  width: 100%;
  background: #eee;
  background-size: cover;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
}

.at-a-glance__content {
  padding: 45px 20px 20px;
  position: relative;

  .at-a-glance__avatar {
    position: absolute;
    top: -45px;
    left: calc(50% - 45px);
    right: 0;
  }

  .at-a-glance__name {
    font-weight: bold;
    font-size: 1rem;
    padding-top: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

.totals {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;

  :deep(a) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $colorSecondary;

    &:hover {
      color: inherit;
      text-decoration: none;

      span {
        color: $colorDarkRed;
      }
    }

    span {
      font-size: 1.2rem;
      font-weight: bold;
      color: $colorRed;
    }
  }
}

div.total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $colorSecondary;

  span {
    font-size: 1.2rem;
    font-weight: bold;
    color: $colorRed;
  }
}

.rtl-at-root {
  .at-a-glance__avatar {
    position: absolute;
    top: -45px;
    left: 0;
    right: calc(50% - 45px);
  }
}
</style>
