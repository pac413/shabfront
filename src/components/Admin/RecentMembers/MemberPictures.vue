<template>
  <ProfileCard
    :icon="['fal', 'images']"
    title="Member Pictures"
    class="pictures"
  >
    <div class="pictures-grid">
      <picture-item
        v-for="(item, index) in member.pictures"
        :key="index"
        :data="item"
        class="pictures-grid__item"
        @edit="onEditPicture(item)"
        @remove="onRemovePicture(item)"
        @flag="onFlagPicture(item)"
      />
    </div>

    <div
      v-if="member.pictures.length === 0"
      class="text-muted"
    >
      No pictures
    </div>

    <UploadPictureModal
      v-if="member.pictures.length"
      :member="member"
      :upmid="member.id + 'apc-upload-picture'"
      :type="MediaSubType.PROFILE"
      :editing-item="editingItem"
      :title="$t('profile-view.general.upload-picture')"
    />

    <delete-picture-confirm-dialog
      v-if="member.pictures.length"
      :value="!!deletingItem"
      :picture="deletingItem"
      @closed="deletingItem = null"
    />
  </ProfileCard>
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from 'vue'

import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import DeletePictureConfirmDialog from '@/components/Profile/PicturesCard/DeletePictureConfirmDialog.vue'
import PictureItem from '@/components/Profile/PicturesCard/PictureItem.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useModal } from '@/composables'
import { type IAdminRecentMemberFragmentFragment, IFlaggedContentType } from '@/composables/graphql/generated'
import { Modal, useModalStore } from '@/stores/modal'
import { MediaSubType, type Picture } from '@/types'

export default defineComponent({
  name: 'MemberPictures',
  components: {
    PictureItem,
    DeletePictureConfirmDialog,
    ProfileCard,
    UploadPictureModal
  },
  props: {
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    }
  },
  setup(props) {
    const bvModal = useModal()
    const { showModal } = useModalStore()

    const count: Ref<number> = ref(0)
    const editingItem: Ref<Picture | null> = ref(null)
    const deletingItem: Ref<Picture | null> = ref(null)

    const onEditPicture = (item: Picture) => {
      editingItem.value = item
      bvModal.show(props.member.id + 'apc-upload-picture')
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

    return {
      MediaSubType,
      count,
      editingItem,
      deletingItem,
      onEditPicture,
      onRemovePicture,
      onFlagPicture
    }
  }
})
</script>

<style lang="scss" scoped>
.pictures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 15.5rem);
  grid-row-gap: 0.5rem;
  justify-content: space-between;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(auto-fit, 28vw);
  }

  &__item {
    width: 15.5rem;
    height: 15.5rem;

    @media (max-width: 1040px) {
      width: 28vw;
      height: 28vw;
    }
  }
}

.pictures :deep(.card-content) {
  padding: 0;
}
</style>
