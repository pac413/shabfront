<template>
  <div v-if="activeProfile" class="feed-item-editor-wrapper">
    <div class="feed-item-editor-header">
      <div class="post-owner-avatar">
        <ProfileAvatar
          v-if="activeProfile"
          linkable
          class="avatar"
          size="3em"
          thumbnail="medium"
          :profile="activeProfile"
        />
      </div>
      <div class="post-content" @click="openFeedItemPreviewModal">
        {{ placeholder }}
      </div>
    </div>
    <hr />
    <editor-buttons @add-picture="openUploadPictureModal" @add-video="openUploadVideoModal" @add-job="openJobModal" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import EditorButtons from '@/components/Feed/FeedItemEditor/EditorButtons.vue'
import { useModal } from '@/composables'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'FeedItemEditor',
  components: { EditorButtons, ProfileAvatar },
  setup() {
    const { t } = useI18n()
    const modal = useModal()
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const attachment = ref<File | null>(null)
    const loading = ref<boolean>(false)
    const placeholder = computed(() =>
      t('feed.editor-textarea.placeholder', { firstName: activeProfile.value?.firstName }).toString(),
    )
    const openFeedItemPreviewModal = () => {
      modal.show('feed-item-preview-modal')
    }

    const openUploadPictureModal = () => {
      openFeedItemPreviewModal()
      modal.show('feed-item-preview-upload-picture-modal')
    }

    const openUploadVideoModal = () => {
      openFeedItemPreviewModal()
      modal.show('feed-item-preview-upload-video-modal')
    }

    const openJobModal = () => {
      openFeedItemPreviewModal()
    }

    return {
      activeProfile,
      attachment,
      loading,
      openFeedItemPreviewModal,
      openJobModal,
      openUploadPictureModal,
      openUploadVideoModal,
      placeholder,
    }
  },
})
</script>

<style lang="scss" scoped>
.feed-item-editor-wrapper {
  .feed-item-editor-header {
    display: flex;
    margin-bottom: 12px;

    .post-content {
      padding: 10px 20px;
      border-radius: 20px;
      flex-grow: 1;
      background: $colorLightGrey3;
      font-size: 1rem;
      color: grey;

      &:hover,
      &:active {
        background: $colorLightGrey2;
      }

      @media (max-width: $mobileMaxWidth) {
        font-size: 0.9rem;
      }
    }
  }
}

.post-owner-avatar {
  margin-right: 0.5rem;
}

.rtl-at-root {
  .post-owner-avatar {
    margin-left: 0.5rem;
    margin-right: 0;
  }
}
</style>
