<template>
  <BModal
    v-model="show"
    lazy
    centered
    size="md"
    :title="$t('profile-view.pictures.delete-picture.title')"
  >
    <div
      class="w-100 pull-if-rtl-label"
      v-html="$t('profile-view.pictures.delete-picture.description')"
    />
    <template #footer>
      <BButton
        variant="link"
        class="pull-if-rtl-label"
        @click="close"
      >
        {{ $t('profile-view.pictures.delete-picture.cancel') }}
      </BButton>
      <BButton
        variant="secondary"
        class="pull-if-rtl-label"
        @click="deletePictureOnly"
      >
        {{ $t('profile-view.pictures.delete-picture.delete-picture-only') }}
      </BButton>
      <BButton
        variant="primary"
        class="pull-if-rtl-label"
        @click="deleteAll"
      >
        {{ $t('profile-view.pictures.delete-picture.delete-all') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import type { Picture } from '@/types'

export default defineComponent({
  name: 'DeletePictureConfirmDialog',
  props: {
    picture: {
      type: Object as () => Picture | null,
      default: null,
    },
    value: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['update:show', 'closed'],
  setup(props, context) {
    const store = useStore(storeKey)
    const show = computed({
      get () {
        return props.value
      },
      set (value: boolean) {
        context.emit('update:show', value)
      }
    })

    const close = () => {
      show.value = false
      context.emit('closed')
    }

    const deletePicture = async (removePost: boolean) => {
      if (!props.picture) { return }
      const { error } = await store.dispatch('profile/deleteProfilePicture', {
        id: props.picture.id,
        removePost
      })

      if (error) {
        throw error
      }
    }

    const deletePictureOnly = async () => {
      await deletePicture(false)
      close()
    }

    const deleteAll = async () => {
      await deletePicture(true)
      close()
    }

    return {
      close,
      deleteAll,
      deletePicture,
      deletePictureOnly,
      show,
    }
  }
})
</script>
