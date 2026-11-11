<template>
  <ProfileCard
    :icon="['fal', 'images']"
    :title="$t('profile-view.pictures.title')"
    class="pictures"
  >
    <template #menu>
      <BButton
        v-if="viewingSelf"
        size="sm"
        variant="primary"
        @click="onUploadPicture"
      >
        {{ $t('profile-view.general.upload-picture') }}
      </BButton>
    </template>

    <div class="pictures-grid">
      <picture-item
        v-for="(item, index) in pictures"
        :key="index"
        :data="item"
        class="pictures-grid__item"
        @edit="onEditPicture(item)"
        @remove="onRemovePicture(item)"
        @flag="onFlagPicture(item)"
      />
    </div>

    <upload-picture-modal
      upmid="apc-upload-picture"
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

import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useModal } from '@/composables'
import { IFlaggedContentType } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { MediaSubType, type Picture } from '@/types'

import DeletePictureConfirmDialog from './DeletePictureConfirmDialog.vue'
import PictureItem from './PictureItem.vue'

export default defineComponent({
  name: 'AllPicturesCard',
  components: {
    DeletePictureConfirmDialog,
    PictureItem,
    ProfileCard,
    UploadPictureModal
  },
  setup() {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const modal = useModal()
    const pictures = computed(() => store.state.profile.currentProfile!.pictures)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const count = ref<number>(0)
    const editingItem = ref<Picture | null>(null)
    const deletingItem = ref<Picture | null>(null)

    const onUploadPicture = () => {
      editingItem.value = null
      modal.show('apc-upload-picture')
    }

    const onEditPicture = (item: Picture) => {
      editingItem.value = item
      modal.show('apc-upload-picture')
    }

    const onRemovePicture = (item: Picture) => {
      deletingItem.value = item
    }

    const onFlagPicture = (item: Picture) => {
      showModal({
        modal: Modal.FLAG_CONTENT,
        props: {
          resourceId: item.id,
          type: IFlaggedContentType.MediaProfilePicture
        }
      })
    }
    return {
      count,
      deletingItem,
      editingItem,
      MediaSubType,
      onEditPicture,
      onFlagPicture,
      onRemovePicture,
      onUploadPicture,
      pictures,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.pictures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 15.5rem);
  grid-row-gap: 0.5rem;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(auto-fit, 28vw);
  }
}

.pictures-grid__item {
  width: 15.5rem;
  height: 15.5rem;

  @media (max-width: 1040px) {
    width: 28vw;
    height: 28vw;
  }
}

.pictures :deep(.card-content) {
  padding: 0;
}
</style>
