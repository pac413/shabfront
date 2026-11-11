<template>
  <div class="editor-buttons-wrapper">
    <div class="editor-buttons">
      <button class="btn btn-photo" @click="$emit('add-picture')">
        <FaIcon class="icon" :icon="['fal', 'camera']" /> {{ $t('feed.editor-buttons.photo') }}
      </button>
      <button class="btn btn-video" @click="$emit('add-video')">
        <FaIcon class="icon" :icon="['fal', 'video']" /> {{ $t('feed.editor-buttons.video') }}
      </button>
      <!-- <button class="btn btn-job" @click="$emit('add-job')">
        <FaIcon class="icon" :icon="['fal', 'briefcase']" /> {{ $t('feed.editor-buttons.job') }}
      </button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditorButtons',
  emits: ['add-picture', 'add-video', 'add-job'],
})
</script>

<style lang="scss" scoped>
.editor-buttons-wrapper {
  display: flex;
  margin-top: 10px;
  align-items: center;
}

.editor-buttons {
  flex-grow: 1;
  display: flex;
  justify-content: space-evenly;

  .btn {
    font-weight: 600;
    font-size: 15px;
    color: #65676b;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    svg {
      margin-right: 8px;
      font-size: 18px;
    }
    &.btn-photo {
      svg {
        color: #46be62;
      }
    }
    &.btn-video {
      svg {
        color: #e7a33e;
      }
    }
    &.btn-job {
      svg {
        color: #cea2cc;
      }
    }
    &.btn-submit {
      svg {
        color: $colorRed;
      }
    }

    &.active {
      color: $colorRed;
      font-weight: 600;
    }
    &:hover(:not(.active)) {
      color: #65676b;
    }
  }
}

.rtl-at-root {
  .editor-buttons {
    .btn {
      svg {
        margin-left: 8px;
        margin-right: 0;
      }
    }
  }
}
</style>
