<template>
  <BModal
    :id="upmid"
    v-model="isModalVisible"
    :title="title"
    :modal-class="{
      'upload-picture-modal': imgUrl || isProfilePicture,
      'upload-picture-modal tabbed': !imgUrl && !isProfilePicture
    }"
    centered
    size="lg"
    no-close-on-backdrop
    @hidden="$emit('hidden')"
    @show="onModalShow"
    @shown="onModalShown"
  >
    <div
      v-if="!loading"
      class="upm-container"
    >
      <input
        ref="photoInput"
        type="file"
        hidden
        accept="image/*"
        @change="onPictureChange"
      >
      <div v-if="!imgUrl">
        <BTabs
          v-model="tabIndex"
          :nav-class="isProfilePicture ? 'd-none' : 'link-nav'"
        >
          <BTab
            v-if="pictures.length"
            :title="$t('profile-view.modal.photos-title')"
          >
            <div class="upm-photos-container">
              <div class="upm-photos-grid">
                <div
                  v-for="(item, index) in pictures"
                  :key="index"
                  class="upm-photo-item"
                  @click="onClickPhotoItem(item)"
                >
                  <img
                    :src="pictureUrl(item.original)"
                    class="upm-photo"
                  >
                </div>
              </div>
            </div>
          </BTab>
          <BTab :title="$t('profile-view.modal.upload-title')">
            <div class="upm-upload-container">
              <upload-dropzone
                type="photo"
                @drop="handleDrop"
                @open-dialog="openPhotoSelect"
              />
            </div>
          </BTab>
        </BTabs>
      </div>
      <image-cropper
        v-if="imgUrl"
        :src="imgUrl"
        :ratio="ratio"
        @change="onCropChange"
      />
      <div
        v-if="isUploading"
        class="upm-progress-container"
      >
        <message-item-upload-progress
          v-if="mediaData"
          :sent-bytes="mediaData.sentBytes"
          :total-bytes="mediaData.totalBytes"
        />
        <span class="upm-progress-text">{{ uploadingText }}</span>
      </div>
    </div>
    <template
      v-if="!loading"
      #footer
    >
      <div class="upm-buttons">
        <BButton
          v-if="imgUrl && isProfilePicture"
          variant="secondary"
          :disabled="isUploading"
          @click.prevent="setAsAvatar"
        >
          {{
            isPictureAsAvatar
              ? $t('media.picture.cropping.remove-as-avatar')
              : $t('media.picture.cropping.set-as-avatar')
          }}
        </BButton>
        <BButton
          v-if="imgUrl && !isProfilePicture"
          variant="secondary"
          :disabled="isUploading"
          @click.prevent="init"
        >
          {{ $t('general.change') }}
        </BButton>
        <BButton
          v-if="imgUrl"
          variant="primary"
          :disabled="isUploading || loading"
          @click="uploadPicture"
        >
          {{ $t('general.save') }}
        </BButton>
        <BButton
          v-if="!imgUrl && !isProfilePicture"
          variant="secondary"
          @click.prevent="onCancel"
        >
          {{ $t('general.cancel') }}
        </BButton>
      </div>
    </template>
    <BModal
      :id="validationModalId"
      v-model="isValidationModalVisible"
      hide-header
      ok-only
    >
      {{ validationMessage }}
    </BModal>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ImageCropper from '@/components/Common/ImageCropper.vue'
import UploadDropzone from '@/components/Common/UploadDropzone.vue'
import MessageItemUploadProgress from '@/components/Messages/MessageItemUploadProgress.vue'
import { useModal, useRegisterModal } from '@/composables'
import { storeKey } from '@/store'
import type { MediaUrlInfo } from '@/store/media/types'
import { type Media, MediaSubType, type Picture, type Profile } from '@/types'
import { dataURLtoFile, getPublicMediaUrl, ImageRatio, ImageSize,validateImage } from '@/utils'

const validationModalId = 'validationModal'

export default defineComponent({
  name: 'UploadPictureModal',
  components: {
    UploadDropzone,
    ImageCropper,
    MessageItemUploadProgress
  },
  props: {
    upmid: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String as () => MediaSubType,
      required: true
    },
    editingItem: {
      type: Object as () => Picture,
      default: null,
    },
    member: {
      type: Object as () => Profile,
      default: null,
    },
  },
  emits: ['close', 'hidden', 'submit'],
  setup(props, context) {
    const { upmid } = toRefs(props)
    const modal = useModal()
    const { isVisible: isModalVisible } = useRegisterModal(upmid)
    const { isVisible: isValidationModalVisible } = useRegisterModal(validationModalId)
    const store = useStore(storeKey)
    const { t } = useI18n()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const photoInput = ref<HTMLInputElement | null>(null)
    const imgUrl = ref<string | null>(null)
    const resultURL = ref<string>('')
    const cropperCanvas = ref<HTMLCanvasElement | null>(null)
    const ratio = ref<number>(1)
    const tabIndex = ref<number>(0)
    const loading = ref<boolean>(true)
    const originalFile = ref<File | null>(null)
    const originalMedia = ref<Media | null>(null)
    const originalMediaId = ref<string | null>(null)
    const validationMessage = ref<string | null>(null)
    const uploadingId = ref<string>('')
    const uploadingStep = ref<number>(0)
    const uploadingText = ref<string>('')
    // returns which profile to refer in this modal
    const profile = computed(() => {
      if (props.member) {
        return props.member
      }
      const typesForActiveProfile = [
        MediaSubType.POST,
        MediaSubType.COMMENT,
        MediaSubType.COMMENT_REPLY,
        MediaSubType.MESSAGE
      ]
      if (typesForActiveProfile.includes(props.type)) {
        return activeProfile.value
      }
      return currentProfile.value || activeProfile.value
    })
    const avatar = computed(() => profile.value?.avatar)
    const wallpaper = computed(() => profile.value?.wallpaper)
    const pictures = computed(() => profile.value?.pictures || [])
    const mediaData = computed(() => store.getters['media/mediaDataById'](uploadingId.value))
    const isUploading = computed(() => uploadingStep.value !== 0)
    const isProfilePicture = computed(() => props.type === MediaSubType.PROFILE)
    const isPictureAsAvatar = computed(() =>
      props.editingItem && avatar.value && props.editingItem.id === avatar.value.originalMediaId
    )
    const pictureUrl = (url: string) => getPublicMediaUrl(url) ?? ''
    const init = () => {
      tabIndex.value = isProfilePicture.value && pictures.value.length > 0 ? 1 : 0
      imgUrl.value = ''
      resultURL.value = ''
      originalFile.value = null
      uploadingStep.value = 0
      originalMedia.value = null
    }

    const onModalShow = () => loading.value = true
    const onModalShown = async () => {
      loading.value = false
      init()

      if (props.type === MediaSubType.AVATAR) {
        ratio.value = ImageRatio.avatar
        if (avatar.value) {
          originalMediaId.value = avatar.value.originalMediaId || avatar.value.id
          imgUrl.value = avatar.value.original
          if (avatar.value.originalMediaId) {
            const res = await store.dispatch('media/getMediaById', originalMediaId.value)
            if (res.data.media) {
              imgUrl.value = getPublicMediaUrl(res.data.media.originalUrl)
            }
          }
        }
      } else if (props.type === MediaSubType.WALLPAPER) {
        ratio.value = ImageRatio.wallpaper
        if (wallpaper.value && !wallpaper.value.isPlaceholder) {
          originalMediaId.value = wallpaper.value.originalMediaId || wallpaper.value.id
          imgUrl.value = getPublicMediaUrl(wallpaper.value.original)
          if (wallpaper.value.originalMediaId) {
            const res = await store.dispatch('media/getMediaById', originalMediaId.value)
            if (res.data.media) {
              imgUrl.value = getPublicMediaUrl(res.data.media.originalUrl)
            }
          }
        }
      } else if (props.type === MediaSubType.PROFILE || props.type === MediaSubType.POST) {
        if (props.editingItem && (props.editingItem.originalMediaId || props.editingItem.id)) {
          originalMediaId.value = props.editingItem.originalMediaId || props.editingItem.id
          const res = await store.dispatch('media/getMediaWithFallback', props.editingItem)
          if (res.data.media) {
            originalMedia.value = res.data.media
            imgUrl.value = getPublicMediaUrl(originalMedia.value!.originalUrl)
          }
        }
      } else {
        // We shouldn't set width-height ratio if this is for other use-cases ie. post, comment
        ratio.value = 0
        if (props.editingItem) {
          originalMediaId.value = props.editingItem!.originalMediaId || props.editingItem!.id
          imgUrl.value = props.editingItem!.original
        }
      }
    }

    const onClickPhotoItem = async (item: Picture) => {
      originalMediaId.value = item.originalMediaId || item.id
      if (item.original) {
        imgUrl.value = getPublicMediaUrl(item.original)
      }
      if (item.originalMediaId) {
        loading.value = true
        const res = await store.dispatch('media/getMediaById', originalMediaId.value)
        loading.value = false
        if (res.data.media) {
          originalMedia.value = res.data.media
          imgUrl.value = getPublicMediaUrl(res.data.media.originalUrl)
        }
      }
    }

    const checkIfFileIsValid = async (file: File) => {
      validationMessage.value = ''
      if (!file.type.startsWith('image/')) {
        validationMessage.value = t('media.picture.validation.unsupported').toString()
      } else {
        const { minValidated, maxValidated } = await validateImage(file)
        if (!minValidated) {
          validationMessage.value
            = `${t('media.picture.validation.minimum')} ${ImageSize.minimum} x ${ImageSize.minimum}`
        } else if (!maxValidated) {
          validationMessage.value
            = `${t('media.picture.validation.maximum')} ${ImageSize.maximum} x ${ImageSize.maximum}`
        }
      }
      if (validationMessage.value) {
        throw new Error()
      }
    }

    const processInputFile = async (file: File) => {
      if (imgUrl.value) {
        URL.revokeObjectURL(imgUrl.value)
      }
      try {
        await checkIfFileIsValid(file)
        imgUrl.value = window.URL.createObjectURL(file)
        originalFile.value = file
      } catch (error: any) {
        modal.show(validationModalId)
        imgUrl.value = ''
        originalFile.value = null
      }
    }

    const handleDrop = (event: any) => {
      event.preventDefault()
      const files = event.dataTransfer.files
      const file = files[files.length - 1]
      processInputFile(file)
    }

    const openPhotoSelect = () => {
      photoInput.value?.click()
    }

    const onPictureChange = (event: any) => {
      const files = (event.target as HTMLInputElement).files
      if (files && files.length) {
        processInputFile(files[0])
      }
    }

    const onCropChange = (result: any) => {
      if (result && result.canvas) {
        cropperCanvas.value = result.canvas
      }
    }

    const onCancel = () => {
      modal.hide(props.upmid)
    }

    const setAsAvatar = async () => {
      if (!profile.value) {
        return
      }
      if (isPictureAsAvatar.value) {
        if (avatar.value) {
          const { error } = await store.dispatch('profile/deleteProfilePicture', {
            id: avatar.value.id,
            removePost: false
          })

          if (error) {
            throw error
          }

          store.dispatch('profile/removeAvatar', {
            profileId: profile.value.id
          })
        }
      } else {
        // set as avatar
        resultURL.value = cropperCanvas.value!.toDataURL('image/jpeg', 1)

        const { error } = await store.dispatch('profile/uploadProfileImage', {
          file: dataURLtoFile(resultURL.value, 'image.jpeg'),
          mediaSubType: MediaSubType.AVATAR,
          originalMediaId: originalMediaId.value,
          profileId: profile.value.id,
          onUrlGenerated: (params: MediaUrlInfo) => {
            uploadingId.value = params.id
            uploadingStep.value = 2
            uploadingText.value = `${t('media.picture.cropping.uploading')}`
          }
        })
        if (error) {
          throw error
        }
      }
      modal.hide(props.upmid)
    }

    const uploadPicture = async () => {
      if (!profile.value) {
        return
      }
      resultURL.value = cropperCanvas.value!.toDataURL('image/jpeg', 1)

      if (
        props.type === MediaSubType.POST ||
        props.type === MediaSubType.COMMENT ||
        props.type === MediaSubType.COMMENT_REPLY ||
        props.type === MediaSubType.MESSAGE
      ) {
        const file = dataURLtoFile(resultURL.value, 'image.jpeg')
        context.emit('submit', file, originalFile.value)
      } else {
        if (originalFile.value) {
          // save to profile pictures if user adds new image
          uploadingStep.value = 1
          uploadingText.value = `${t('media.picture.cropping.processing')}`
          const { error, data } = await store.dispatch('profile/uploadProfileImage', {
            file: originalFile.value,
            mediaSubType: MediaSubType.ORIGINAL,
            profileId: profile.value.id,
            onUrlGenerated: (params: MediaUrlInfo) => {
              uploadingId.value = params.id
            }
          })
          if (error) {
            throw error
          }
          originalMediaId.value = data.id
        } else if (originalMediaId.value && props.editingItem) {
          // This is the case when editting existing picture
          if (originalMedia.value && originalMedia.value.mediaSubType !== MediaSubType.ORIGINAL) {
            await store.dispatch('media/updateMedia', {
              id: originalMediaId.value,
              mediaSubType: MediaSubType.ORIGINAL
            })
          }
          if (originalMediaId.value !== props.editingItem.id) {
            // Need to keep original picture but delete the current picture to avoid 2 derived pictures existing
            await store.dispatch('media/deleteMedia', {
              id: props.editingItem.id,
              keepOriginal: true // Important
            })
          }
        }

        uploadingText.value = ''
        uploadingId.value = ''
        const { data, error } = await store.dispatch('profile/uploadProfileImage', {
          file: dataURLtoFile(resultURL.value, 'image.jpeg'),
          mediaSubType: props.type,
          originalMediaId: originalMediaId.value,
          profileId: profile.value.id,
          onUrlGenerated: (params: MediaUrlInfo) => {
            uploadingId.value = params.id
            uploadingStep.value = 2
            uploadingText.value = `${t('media.picture.cropping.uploading')}`
          }
        })
        if (error) {
          throw error
        }
        context.emit('submit')

        if (props.type === MediaSubType.PROFILE) {
          // need to update store after adding or updating profile pictures
          if (originalFile.value) {
            await store.dispatch('profile/addPictureToProfile', {
              profileId: profile.value.id,
              media: data
            })
          } else if (props.editingItem) {
            await store.dispatch('profile/updatePictureInProfile', {
              profileId: profile.value.id,
              oldMediaId: props.editingItem.id,
              updatedMedia: data
            })
          }
        }
      }

      modal.hide(props.upmid)
    }

    return {
      activeProfile,
      avatar,
      checkIfFileIsValid,
      currentProfile,
      handleDrop,
      imgUrl,
      isModalVisible,
      isPictureAsAvatar,
      isProfilePicture,
      isUploading,
      isValidationModalVisible,
      loading,
      mediaData,
      MediaSubType,
      onCancel,
      onClickPhotoItem,
      onModalShow,
      onModalShown,
      onPictureChange,
      onCropChange,
      openPhotoSelect,
      originalFile,
      originalMedia,
      originalMediaId,
      photoInput,
      pictures,
      pictureUrl,
      profile,
      setAsAvatar,
      ratio,
      resultURL,
      tabIndex,
      uploadingId,
      uploadingStep,
      uploadingText,
      uploadPicture,
      validationMessage,
      validationModalId,
      wallpaper,
      init
    }
  }
})
</script>

<style lang='scss'>
.upm-container {
  width: 100%;
  // max-height: 50vh;
  background: transparent;
}

.upm-photos-container {
  width: 100%;
  height: 50vh;
  overflow-y: scroll;
}

.upm-photos-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 1em;
  padding-right: 0;
}

.upm-photo-item {
  width: 9.5em;
  height: 9.5em;
  text-align: center;
  padding: .5em;
  position: relative;
  cursor: pointer;

  .upm-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.upm-upload-container {
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.upm-progress-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);

  .upm-progress-text {
    margin-top: 20px;
    font-size: 24px;
    color: $colorRed;
  }
}

.upm-tools {
  flex: 2 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 5px 0;
  font-size: .9rem;
}

.upm-slider-container {
  flex: 0.45;
  display: flex;
  flex-direction: column;

  .upm-slider-texts {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}

.upm-range-slider {
  flex: 1;
}

.upm-buttons {
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: .5rem;
  }
}

input[type='range']::-webkit-slider-thumb {
  background: $colorRed;
  box-shadow: 0 0 0 1px $colorRed;
}

@keyframes spin {
  100% {
    transform: rotateZ(360deg)
  }
}

.upload-picture-modal.show {

  .modal-body {
    padding: 0;
    border-bottom: solid 1px $colorBorder;
  }

  .tab-content .upm-upload-container {
    padding: 1.5em;
  }

  .modal-header {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  &.tabbed {
    .modal-header {
      box-shadow: none;
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .nav-tabs.link-nav {
      border-bottom: none;
      padding: 1.5em;
      padding-bottom: 0;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

      .nav-link {
        color: $colorModalTitle;
        flex: 0 0 auto;
        border: none;
        padding: .5em;
        margin-right: 3em;

        &.active {
          border-bottom: $colorRed solid 3px;
          font-weight: bold;
        }
      }
    }
  }
}

.rtl-at-root {
  .upm-photos-grid {
    padding-right: 1em;
    padding-left: 0;
  }

  .upm-buttons {
    button {
      margin-left: 0;
      margin-right: .5rem;
    }
  }

  .upload-picture-modal.show {
    &.tabbed {
      .nav-tabs.link-nav {
        .nav-link {
          margin-left: 3em;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
