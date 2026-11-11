<template>
  <div class="picture-item">
    <img
      class="picture-item-responsive"
      :src="pictureUrl"
      :class="{'no-hover': !data.original }"
      @click="openModal(data.original)"
    >
    <picture-item-hover-actions
      v-if="isAdmin || viewingSelf"
      class="picture-item__actions"
      @edit="$emit('edit')"
      @remove="$emit('remove')"
      @flag="$emit('flag')"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { getPublicMediaUrl } from '@/utils'

import PictureItemHoverActions from './PictureItemHoverActions.vue'

interface PictureItemPayload {
  id?: number
  [key: string]: any
}

export default defineComponent({
  name: 'PictureItem',
  components: { PictureItemHoverActions },
  props: {
    data: {
      type: Object as () => PictureItemPayload,
      required: true,
    },
  },
  emits: ['edit', 'remove', 'flag'],
  setup(props) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const viewingSelf = computed((): boolean => store.getters['profile/viewingSelf'])
    const pictureUrl = computed(() => getPublicMediaUrl(props.data.original))

    const openModal = (originalUrl: string) => {
      showModal({
        modal: Modal.BASIC_PHOTO_MODAL,
        props: {
          originalMediaUrl: originalUrl
        }
      })
    }

    return {
      isAdmin,
      openModal,
      pictureUrl,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.picture-item {
  border: none;
  text-align: center;
  padding: 10px;
  position: relative;

  &:hover {
    cursor: pointer;
    .picture-item__actions {
      display: block;
    }
  }

  @media (max-width: $mobileMaxWidth) {
    padding: 1vw;

    &:focus .picture-item__actions {
      display: block;
    }
  }
}

.picture-item-responsive {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.picture-item__actions {
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
  display: none;
}

.rtl-at-root {
  .picture-item__actions {
    right: unset;
    left: 25px;
  }
}
</style>
