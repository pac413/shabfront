<template>
  <ProfileCard
    v-if="viewingSelf || (pictures && pictures.length)"
    :icon="['fal', 'camera']"
    :title="$t('profile-view.general.pictures')"
    @title-clicked="swapContent"
  >
    <template #menu>
      <a
        v-if="viewingSelf"
        v-b-tooltip.hover.bottom="$t('profile-view.general.upload-picture')"
        class="edit-icon inline-icon-button text-secondary"
        @click="onUploadPicture"
      >
        <FaIcon :icon="['fal', 'plus']" />
      </a>
    </template>
    <picture-grid
      v-if="pictures && pictures.length"
      id="picture-cards"
      :items="pictures"
      :loading="!pictures"
      :max="5"
      @view-all="swapContent"
    >
      <template #item="{ item }">
        <div class="picture-card-item">
          <img
            class="img-responsive no-hover"
            :src="pictureUrl(item.original)"
            @click="openModal(item.original)"
          >
          <picture-item-hover-actions
            v-if="isAdmin || viewingSelf"
            class="picture-card-item__actions"
            @edit="onEditPicture(item)"
            @remove="onRemovePicture(item)"
            @flag="onFlagPicture(item)"
          />
        </div>
      </template>
    </picture-grid>
    <div
      v-else
      class="upload-pictures"
      @click="onUploadPicture"
    >
      <span class="link-style">{{ $t('profile-view.pictures.add-pictures') }}</span>
    </div>

    <upload-picture-modal
      upmid="pc-upload-picture"
      :type="MediaSubType.PROFILE"
      :editing-item="editingItem"
      :title="$t('profile-view.general.upload-picture')"
    />

    <delete-picture-confirm-dialog
      :value="!!deletingItem"
      :picture="deletingItem"
      @closed="deletingItem = null"
    />
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import PictureGrid from '@/components/Common/PictureGrid.vue'
import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useModal } from '@/composables'
import { IFlaggedContentType } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { MediaSubType, type Picture } from '@/types'
import { getPublicMediaUrl } from '@/utils'

import DeletePictureConfirmDialog from './DeletePictureConfirmDialog.vue'
import PictureItemHoverActions from './PictureItemHoverActions.vue'

export default defineComponent({
  name: 'PicturesCard',
  components: {
    DeletePictureConfirmDialog,
    PictureGrid,
    PictureItemHoverActions,
    ProfileCard,
    UploadPictureModal
  },
  emits: ['view-all'],
  setup(_, context) {
    const store = useStore(storeKey)
    const modal = useModal()
    const { showModal } = useModalStore()
    const profile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const pictures = computed(() => profile.value?.pictures)
    const editingItem = ref<Picture | null>(null)
    const deletingItem = ref<Picture | null>(null)

    const pictureUrl = (url: string) => {
      return getPublicMediaUrl(url)
    }

    const swapContent = () => {
      context.emit('view-all')
    }

    const onUploadPicture = () => {
      editingItem.value = null
      modal.show('pc-upload-picture')
    }

    const onEditPicture = (item: Picture) => {
      editingItem.value = item
      modal.show('pc-upload-picture')
    }

    const onRemovePicture = (item: Picture) => {
      deletingItem.value = item
    }

    const onFlagPicture = (item: Picture) => {
      showModal({
        modal: Modal.FLAG_CONTENT,
        props: {
          resourceId: item.id,
          type: IFlaggedContentType.MediaProfilePicture,
        }
      })
    }

    const openModal = (originalUrl: string) => {
      showModal({
        modal: Modal.BASIC_PHOTO_MODAL,
        props: {
          originalMediaUrl: originalUrl
        }
      })
    }

    return {
      deletingItem,
      editingItem,
      isAdmin,
      MediaSubType,
      onEditPicture,
      onFlagPicture,
      onRemovePicture,
      onUploadPicture,
      openModal,
      pictures,
      pictureUrl,
      profile,
      swapContent,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.picture-card-item {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;

  &:hover {
    .picture-card-item__actions {
      display: block;
    }
  }
}

.picture-card-item__actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: none;
}

.upload-pictures {
  &:active, &:focus {
    outline: none;
  }
  border: dashed 2px $colorLightGrey1;
  padding: 3em;
  text-align: center;
}

.rtl-at-root {
  .picture-card-item__actions {
    right: unset;
    left: 5px;
  }
}
</style>
