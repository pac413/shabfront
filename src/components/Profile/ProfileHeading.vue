<template>
  <div
    class="profile-heading"
    :class="{'is-connection': isConnection }"
  >
    <div class="profile-heading__backimg-container">
      <img
        class="profile-heading__backimg"
        :src="wallpaperUrl"
        @error="setImagUrlAlt"
      >
      <BButton
        v-if="isAdmin || viewingSelf"
        v-BModal.phb-upload-picture
        pill
        size="sm"
        variant="light"
        class="profile-heading__edit-wallpaper"
      >
        <FaIcon :icon="['fal', 'camera']" />
        <template v-if="!mq.mobile">
          &nbsp;{{ $t('profile-view.heading.edit-wallpaper') }}
        </template>
      </BButton>
    </div>
    <div class="profile-heading__avatar-container">
      <ProfileAvatar
        class="profile-heading__avatar"
        :class="{ 'has-avatar': profile?.avatar }"
        size="170px"
        thumbnail="large"
        :profile="profile"
        @click="goToAvatarUpdatedFeedItem"
      />
      <BButton
        v-if="isAdmin || viewingSelf"
        v-BModal.pha-upload-picture
        pill
        size="md"
        variant="light"
        class="profile-heading__edit-avatar"
        :class="{ 'with-text': !profile?.avatar }"
      >
        <FaIcon :icon="['fal', 'camera']" />
        <span
          v-if="!profile?.avatar"
          class="text"
        >
          {{ $t('profile-view.heading.add-avatar') }}
        </span>
      </BButton>
    </div>
    <div class="profile-heading__intro-container">
      <IntroCard />
    </div>

    <upload-picture-modal
      upmid="pha-upload-picture"
      :type="MediaSubType.AVATAR"
      :title="profile?.avatar? $t('profile-view.heading.edit-avatar') : $t('profile-view.heading.add-avatar')"
      @submit="editProfilePicture"
    />

    <upload-picture-modal
      upmid="phb-upload-picture"
      :type="MediaSubType.WALLPAPER"
      :title="$t('profile-view.heading.edit-wallpaper')"
      @submit="editWallpaper"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import IntroCard from '@/components/Profile/IntroCard.vue'
import { storeKey } from '@/store'
import { type getAvatarUpdatedFeedItem } from '@/store/feed/actions/getAvatarUpdatedFeedItem'
import type { StoreActionPayload } from '@/store/types'
import { Modal, useModalStore } from '@/stores/modal'
import { MediaSubType } from '@/types'
import { DEFAULT_SHABBAT_WALLPAPER_LINK, getPublicMediaUrl } from '@/utils'

export default defineComponent({
  name: 'ProfileHeading',
  components: {
    IntroCard,
    ProfileAvatar,
    UploadPictureModal
  },
  setup() {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const mq = useMq()
    const profile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const isConnection = computed<boolean>(() => store.getters['profile/isConnection'])
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const wallpaperUrl = computed(() => {
      const wallpaper = profile.value?.wallpaper
      if (hideAllMedia.value) {
        return DEFAULT_SHABBAT_WALLPAPER_LINK
      }
      if (!wallpaper || !wallpaper.original) {
        return ''
      }
      return getPublicMediaUrl(wallpaper.original)
    })

    const shouldHideMedia = computed(() => {
      return !viewingSelf.value && hideAllMedia.value
    })

    const editProfilePicture = () => {}
    const editWallpaper = () => {}

    const setImagUrlAlt = (event: any) => {
      event.target.src = DEFAULT_SHABBAT_WALLPAPER_LINK
    }

    const goToAvatarUpdatedFeedItem = async () => {
      if (!profile.value?.avatar?.original) {
        return
      }
      const payload: StoreActionPayload<typeof getAvatarUpdatedFeedItem> = profile.value?.id
      const { data } = await store.dispatch('feed/getAvatarUpdatedFeedItem', payload)
      if (data) {
        showModal({
          modal: Modal.FEED_ITEM,
          props: {
            modalFeedItemId: data.id,
          }
        })
      } else {
        showModal({
          modal: Modal.BASIC_PHOTO_MODAL,
          props: {
            originalMediaUrl: profile.value?.avatar?.original
          }
        })
      }
    }
    return {
      editProfilePicture,
      editWallpaper,
      goToAvatarUpdatedFeedItem,
      hideAllMedia,
      isAdmin,
      isConnection,
      MediaSubType,
      mq,
      profile,
      setImagUrlAlt,
      shouldHideMedia,
      viewingSelf,
      wallpaperUrl,
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-heading {
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 0;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px 12px 0 0;
  border: 1px solid #e4e4e4;
  border-bottom: none;

  &.is-connection {
    transition: margin-bottom 0s .4s; //delay margin-bottom until encourage-card slide out animation is complete
    margin-bottom: 20px;
    border-radius: 12px;
    border-bottom: 1px solid #e4e4e4;
  }
}

.profile-heading__backimg-container {
  position: relative;
  width: 100%;
  margin: 0 0 35px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  aspect-ratio: 2.701587301587302;
}

.profile-heading__backimg {
  width: 100%;
  border-radius: inherit;
}

.profile-heading__edit-wallpaper {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.profile-heading__avatar-container {
  position: absolute;
  left: 35px;
  margin-top: -174px;
  min-width: 275px; // to allow room for avatar button text
}

.profile-heading__avatar {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  border: 3px solid #fff;

  &.has-avatar {
    cursor: pointer;
  }
}

.profile-heading__edit-avatar {
  height: 40px;
  position: absolute;
  bottom: 5px;
  border-radius: 50%;
  left: 122px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

  .text {
    padding-left: 5px;
    font-size: .9rem;
    font-weight: bold;
  }
}

.profile-heading__intro-container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 50px 20px;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: $mobileMaxWidth) {
  .profile-heading__avatar-container {
    left: 50%;
    bottom: unset;

    -ms-transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .profile-heading__intro-container {
    justify-content: center;
    padding: 10px 2px;
  }
}

.rtl-at-root {
  .profile-heading__edit-wallpaper {
    left: 20px;
    right: unset;
  }
  .profile-heading__avatar-container {
    left: unset;
    right: 35px;
  }
  .profile-heading__edit-avatar {
    left: unset;
    right: 122px;

    .text {
      padding-left: unset;
      padding-right: 5px;
    }
  }
}
</style>
