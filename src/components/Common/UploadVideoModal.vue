<template>
  <BModal
    :id="id"
    v-model="isVisible"
    centered
    size="lg"
    :title="title"
    no-close-on-backdrop
    :hide-footer="!videoUrl"
    @show="init"
    @hidden="$emit('hidden')"
  >
    <div v-if="videoUrl">
      <video controls>
        <source :src="videoUrl" />
      </video>
    </div>
    <div
      v-else
      class="uvm-upload-container"
    >
      <input
        ref="videoInput"
        type="file"
        hidden
        :accept="mimetype"
        @change="onVideoChange"
      >
      <upload-dropzone
        type="video"
        @drop="handleDrop"
        @open-dialog="openVideoInputDialog"
      />
    </div>
    <template #footer>
      <BButton
        variant="secondary"
        @click.prevent="init"
      >
        {{ $t('general.change') }}
      </BButton>
      <BButton
        variant="primary"
        @click="uploadVideo"
      >
        {{ $t('general.save') }}
      </BButton>
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
import { computed, defineComponent, ref } from 'vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import UploadDropzone from '@/components/Common/UploadDropzone.vue'
import { useModal, useRegisterModal } from '@/composables'
import { useBrowserInfo } from '@/composables/useBrowserInfo'
import { VideoSize } from '@/utils'

const NON_SAFARI_SUPPORTING_TYPES = ['video/webm', 'video/mp4', 'video/ogg']
const validationModalId = 'validationModal'

export default defineComponent({
  name: 'UploadVideoModal',
  components: {
    UploadDropzone,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    }
  },
  emits: ['hidden', 'submit'],
  setup(props, context) {
    const { id } = toRefs(props)
    const { t } = useI18n()
    const browserInfo = useBrowserInfo()
    const { isVisible } = useRegisterModal(id)
    const { isVisible: isValidationModalVisible } = useRegisterModal(validationModalId)
    const modal = useModal()
    const videoInput = ref<HTMLInputElement | null>(null)
    const videoUrl = ref<string | null>(null)
    const originalFile = ref<File | null>(null)
    const validationMessage = ref<string>('')
    const mimetype = computed(() => {
      if (browserInfo.name?.includes('Safari')) {
        return 'video/*'
      } else {
        return NON_SAFARI_SUPPORTING_TYPES.join(',')
      }
    })

    const init = () => {
      videoUrl.value = ''
      originalFile.value = null
    }

    const openVideoInputDialog = () => {
      videoInput.value?.click()
    }

    const processInputFile = (file: File) => {
      if (videoUrl.value) {URL.revokeObjectURL(videoUrl.value)}
      try {
        checkIfFileIsValid(file)
        videoUrl.value = window.URL.createObjectURL(file)
        originalFile.value = file
      } catch (error: any) {
        modal.show('validationModal')
        init()
      }
    }

    const checkIfFileIsValid = (file: File) => {
      validationMessage.value = ''
      // Check if file is video type
      if (!file.type.startsWith('video/')) {
        validationMessage.value = `${t('media.video.validation.unsupported')}`
      } else {
        // Check if video type is supported by browser
        if (!browserInfo.name?.includes('Safari') && !NON_SAFARI_SUPPORTING_TYPES.includes(file.type)) {
          validationMessage.value = `${t('media.video.validation.unsupported')}`
        }
        // File size should be less than 10GB
        const sizeInGb = file.size / 1e+9
        if (sizeInGb >= 10) {
          validationMessage.value =
            `${t('media.video.validation.maximum')} ${VideoSize.maximum} ${t('media.video.validation.gb')}`
        }
      }
      if (validationMessage.value) {
        throw new Error()
      }
    }

    const handleDrop = (event: any) => {
      event.preventDefault()
      const files = event.dataTransfer.files
      const file = files[files.length - 1]
      processInputFile(file)
    }

    const onVideoChange = (event: Event) => {
      const files = (event.target as HTMLInputElement).files
      if (files && files.length) {
        processInputFile(files[0])
      }
    }

    const uploadVideo = () => {
      context.emit('submit', {
        url: videoUrl.value,
        file: originalFile.value
      })
      modal.hide(props.id)
    }

    return {
      checkIfFileIsValid,
      handleDrop,
      init,
      isVisible,
      isValidationModalVisible,
      mimetype,
      onVideoChange,
      openVideoInputDialog,
      originalFile,
      processInputFile,
      uploadVideo,
      validationMessage,
      validationModalId,
      videoInput,
      videoUrl,
    }
  }
})
</script>

<style lang="scss" scoped>
.uvm-upload-container {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 1.5rem;
}

video {
  width: 100%;
  max-height: 60vh;
  object-fit: cover;
}
</style>
