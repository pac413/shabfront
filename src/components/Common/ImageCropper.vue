<template>
  <div class="image-cropper__container">
    <cropper
      ref="cropper"
      class="image-cropper"
      background-class="image-cropper__background"
      foreground-class="image-cropper__foreground"
      image-restriction="stencil"
      :stencil-props="{
        aspectRatio: ratio,
      }"
      :transitions="false"
      :canvas="true"
      :debounce="false"
      :default-size="defaultSize"
      :min-width="100"
      :min-height="100"
      :src="src"
      @ready="onReady"
      @change="(evt: any) => $emit('change', evt)"
    />
    <spinner v-if="!isReady" />
    <div v-if="isReady" class="vertical-buttons">
      <BButton
        v-b-tooltip.hover="$t('media.picture.cropping.zoom-out')"
        variant="primary"
        class="my-1"
        @click="zoom(0.5)"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'magnifying-glass-minus']"
        />
      </BButton>
      <BButton
        v-b-tooltip.hover="$t('media.picture.cropping.zoom-in')"
        variant="primary"
        class="my-1"
        @click="zoom(2)"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'magnifying-glass-plus']"
        />
      </BButton>
      <BButton
        v-b-tooltip.hover="$t('media.picture.cropping.flip-horizontal')"
        variant="primary"
        class="my-1"
        @click="flip(true, false)"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'arrow-right-arrow-left']"
        />
      </BButton>
      <BButton
        v-b-tooltip.hover="$t('media.picture.cropping.flip-vertical')"
        variant="primary"
        class="my-1"
        @click="flip(true, true)"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'arrow-up-arrow-down']"
        />
      </BButton>
      <BButton
        v-b-tooltip.hover="$t('media.picture.cropping.rotate-clockwise')"
        variant="primary"
        class="my-1"
        @click="rotate(90)"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'rotate-right']"
        />
      </BButton>
      <BButton
        v-b-tooltip.hover="$t('media.picture.cropping.rotate-counter-clockwise')"
        variant="primary"
        class="my-1"
        @click="rotate(-90)"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'rotate-left']"
        />
      </BButton>
    </div>
  </div>
</template>

<script lang="ts">
import 'vue-advanced-cropper/dist/style.css'

import { defineComponent, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'

import Spinner from './Spinner.vue'

export default defineComponent({
  name: 'ImageCropper',
  components: {
    Cropper,
    Spinner,
  },
  props: {
    src: {
      type: String,
      required: true
    },
    ratio: {
      type: Number,
      required: true
    },
  },
  emits: ['change'],
  setup() {
    const cropper = ref<typeof Cropper | null>(null)
    const isReady = ref(false)

    const defaultSize = ({ imageSize }: any) => {
      return {
        width: Math.min(imageSize.height, imageSize.width),
        height: Math.min(imageSize.height, imageSize.width),
      }
    }

    const zoom = (factor: number) => {
      cropper.value?.zoom(factor)
    }

    const flip = (x: boolean, y: boolean) => {
      const { image } = cropper.value?.getResult()
      if (image.transforms.rotate % 180 !== 0) {
        cropper.value?.flip(!x, !y)
      } else {
        cropper.value?.flip(x, y)
      }
    }

    const rotate = (angle: number) =>  {
      cropper.value?.rotate(angle)
    }

    const onReady = () => {
      isReady.value = true
    }

    return {
      cropper,
      isReady,
      defaultSize,
      zoom,
      flip,
      rotate,
      onReady
    }
  }
})
</script>

<style lang="scss" scoped>
.image-cropper {
  max-height: 60vh;

  &__container {
    position: relative;
  }
}

:deep(.image-cropper__stencil) {
  border: solid 2px $colorRed;
}

.vertical-buttons {
  position: absolute;
	left: 20px;
	top: 0%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
