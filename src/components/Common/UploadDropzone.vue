<template>
  <div
    class="um-dropzone"
    :class="{'dragging': active}"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setActive"
    @drop.prevent="onDrop"
  >
    <FaIcon
      :icon="['fas', 'cloud-upload-alt']"
      class="um-drop-image"
    />
    <span class="um-drop-text">{{ $t(`media.upload.${type}-drop-text`) }}</span>
    <span class="um-drop-span">{{ $t('media.video.or') }}</span>
    <BButton
      class="mt-4"
      size="sm"
      variant="primary"
      @click="$emit('open-dialog')"
    >
      {{ $t(`media.upload.upload-${type}-button`) }}
    </BButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted,ref } from 'vue'

export default defineComponent({
  name: 'UploadDropzone',
  props: {
    type: {
      type: String as () => 'photo' | 'video',
      required: true
    }
  },
  emits: ['drop', 'open-dialog'],
  setup(_, { emit }) {
    const active = ref(false)
    let inActiveTimeout = null
    
    // setActive and setInactive use timeouts, so that when you drag an item over a child element,
    // the dragleave event that is fired won't cause a flicker. A few ms should be plenty of
    // time to wait for the next dragenter event to clear the timeout and set it back to active.
    function setActive() {
      active.value = true
      clearTimeout(inActiveTimeout)
    }
    function setInactive() {
      inActiveTimeout = setTimeout(() => {
        active.value = false
      }, 50)
    }

    function onDrop(evt: any) {
      setInactive()
      emit('drop', evt)
    }

    function preventDefaults(e) {
      e.preventDefault()
    }

    const events = ['dragenter', 'dragover', 'dragleave', 'drop']

    onMounted(() => {
      events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults)
      })
    })

    onUnmounted(() => {
      events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults)
      })
    })

    return {
      active,
      setActive,
      onDrop
    }
  }
})
</script>

<style lang="scss" scoped>
  .um-dropzone {
    position: relative;
    width: 100%;
    border-radius: 5px;
    background-color: #F2FAFF;
    border: 2px dashed #C4C4C4;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    color: $colorGrey;

    &.dragging {
      color: $colorRed;
      border-color: $colorRed;
      background: rgba(255, 0, 0, 0.2);
      transition: all 0.5s;
    }

    .um-drop-image {
      width: 50px;
      height: 50px;
    }

    .um-drop-text {
      width: 150px;
      text-align: center;
      margin-bottom: 15px;
      font-weight: bold;
      color: $colorModalTitle;
    }

    .um-drop-span {
      color: $colorModalTitle;
    }
  }
</style>
