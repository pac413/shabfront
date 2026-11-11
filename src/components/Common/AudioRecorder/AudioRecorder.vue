<template>
  <div
    v-if="isSupported"
    class="audio-recorder"
  >
    <button
      v-if="isRecording"
      v-b-tooltip.hover
      type="button"
      :title="discardTitle"
      class="btn btn-iconed audio-recorder__discard-button"
      @click="discard"
    >
      <FaIcon
        :icon="['fas', 'trash']"
        :style="{ color: '#6c757d' }"
      />
    </button>
    <button
      v-b-tooltip.hover
      type="button"
      :title="title"
      class="btn btn-iconed audio-recorder__record-button"
      :class="{ 'audio-recorder__record-button--active': isRecording }"
      @click="onClick"
    >
      <FaIcon
        :icon="['fas', isRecording ? 'stop' : 'microphone']"
        :style="{ color: '#f43838' }"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { v4 as uuid } from 'uuid'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useBrowserInfo } from '@/composables/useBrowserInfo'

export default defineComponent({
  name: 'AudioRecorder',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:active',
    'stream',
    'start',
    'discard',
    'stop',
    'completed',
    'permission-error',
    'error',
  ],
  setup(props, context) {
    const browserInfo = useBrowserInfo()
    const { t } = useI18n()
    const isSupported = ref<boolean>(false)
    const hasDiscarded = ref<boolean>(false)
    const chunks = ref<BlobPart[]>([])
    const $stream = ref<MediaStream | null>(null)
    const $mediaRecorder = ref<MediaRecorder | null>(null)
    const mimeType = computed(() => {
      if (browserInfo.name?.includes('Safari')) {
        return 'audio/mp4'
      } else {
        return 'audio/webm'
      }
    })
    const isRecording = computed<boolean>({
      get () {
        return props.active
      },
      set (val: boolean) {
        context.emit('update:active', val)
      }
    })
    const title = computed<string>(() =>
      isRecording.value
        ? t('messages.stop-recording').toString()
        : t('messages.start-recording').toString()
    )
    const discardTitle = computed<string>(() => t('messages.discard-recording').toString())

    onMounted(() => {
      if (!navigator.mediaDevices || !(navigator.mediaDevices.getUserMedia)) {
        console.warn('Media Devices are not supported from your browser.')
        return
      }
      isSupported.value = true
    })

    /**
     * Get the input stream based on constraints and emit the stream event
     * to the parent component so he can use it for processing or show a preview
     */
    const getStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      $stream.value = stream
      context.emit('stream', stream)
      return stream
    }

    /**
     * Create a new media recorder with the user media stream
     * and set some event listeners to update component data
     * and emit events to the parent component
     */
    const prepareRecorder = () => {
      if (!$stream.value) {
        return
      }

      $mediaRecorder.value = new MediaRecorder($stream.value, {
        mimeType: mimeType.value
      })

      $mediaRecorder.value.addEventListener('start', () => {
        isRecording.value = true
        context.emit('start')
      })

      // Collect the available data into chunks
      $mediaRecorder.value.addEventListener(
        'dataavailable',
        (e: any) => {
          if (e.data && e.data.size > 0) {
            chunks.value.push(e.data)
          }
        },
        true
      )

      // On recording stop get the data and emit the result
      // than clear all the recording chunks
      $mediaRecorder.value.addEventListener(
        'stop',
        () => {
          if (hasDiscarded.value) {
            context.emit('discard')
            chunks.value = []
            isRecording.value = false
            hasDiscarded.value = false
            return
          }
          context.emit('stop')

          const blobData = new File(chunks.value, `${uuid()}.mp3`, { type: mimeType.value })
          if (blobData.size > 0) {
            context.emit('completed', blobData)
          }
          chunks.value = []
          isRecording.value = false
        },
        true
      )
    }

    const start = async () => {
      if (isRecording.value) {
        return
      }

      hasDiscarded.value = false
      try {
        $stream.value = await getStream()
        prepareRecorder()
        if (!$mediaRecorder.value) { return }
        $mediaRecorder.value.start()
      } catch (e: any) {
        if (e.name === 'NotAllowedError') {
          context.emit('permission-error', e)
        } else {
          context.emit('error', e)
        }
        console.error(e)
      }
    }

    const stop = () => {
      hasDiscarded.value = false
      if (!isRecording.value) {return}
      if (!$mediaRecorder.value) { return }
      $mediaRecorder.value.stop()
      $stream.value!.getTracks().forEach(t => t.stop())
    }

    const onClick = () => {
      if (isRecording.value) {
        stop()
      } else {
        start()
      }
    }

    const discard = () => {
      hasDiscarded.value = true
      if (!isRecording.value) {return}
      if (!$mediaRecorder.value) { return }
      $mediaRecorder.value.stop()
      $stream.value!.getTracks().forEach(t => t.stop())
    }

    return {
      $mediaRecorder,
      $stream,
      chunks,
      discard,
      discardTitle,
      hasDiscarded,
      isRecording,
      isSupported,
      mimeType,
      onClick,
      start,
      stop,
      title,
    }
  }
})
</script>

<style lang="scss">
.audio-recorder {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.audio-recorder__discard-button,
.audio-recorder__record-button {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 0 lighten($colorRed, 50%);
  border: none;
}

.audio-recorder__discard-button {
  margin-right: 5px;
}

.audio-recorder__record-button--active {
  -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
}
</style>
