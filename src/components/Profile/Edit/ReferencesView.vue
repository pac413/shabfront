<template>
  <div>
    <BButton
      size="sm"
      variant="primary"
      class="reference-add-btn"
      @click="handleAddClick"
    >
      <FaIcon
        :icon="['fal', 'plus']"
        class="me-1"
      />
      {{ $t('profile-edit.references.add') }}
    </BButton>
    <div class="reference-list">
      <div
        v-for="reference in profile.references"
        :key="reference.id"
        class="reference-card"
      >
        <ReferenceCard
          :reference="reference"
          @edit="handleEditClick"
          @delete="handleDeleteClick"
        />
      </div>
    </div>

    <ReferenceModal
      :id="referenceModalId"
      :reference="currentReference"
      @save="saveReference"
    />

    <ConfirmationDialog
      id="delete-reference-confirmation-dialog"
      v-model="deleteDlgVisible"
      :body="$t('general.confirm-delete')"
      :title="$t('profile-edit.references.delete-modal-title')"
      @success="deleteReference"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import ReferenceCard from '@/components/Reference/ReferenceCard.vue'
import ReferenceModal from '@/components/Reference/ReferenceModal.vue'
import { useModal } from '@/composables'
import { type IProfile,ISiteRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type Reference } from '@/types'

const referenceModalId = 'reference-modal'

export default defineComponent({
  name: 'ReferencesView',
  components: {
    ReferenceCard,
    ReferenceModal,
    ConfirmationDialog
  },
  props: {
    profile: {
      type: Object as () => IProfile,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const modal = useModal()
    const deleteDlgVisible = ref<boolean>(false)
    const currentReference = ref<Reference>({
      id: '',
      name: '',
      phone: '',
      email: '',
      relationship: [],
      siteRole: ISiteRole.Guest,
    })

    const handleAddClick = () => {
      currentReference.value = Object.assign({}, currentReference.value, {
        id: '',
        name: '',
        phone: '',
        email: '',
        relationship: [],
        siteRole: ISiteRole.Guest
      })
      modal.show(referenceModalId)
    }

    const handleEditClick = (reference: Reference) => {
      currentReference.value = Object.assign({}, currentReference.value, reference)
      modal.show(referenceModalId)
    }

    const handleDeleteClick = (reference: Reference) => {
      currentReference.value = reference
      deleteDlgVisible.value = true
    }

    const saveReference = (params: Reference) => {
      const referenceParam = {
        ...params,
        profileId: props.profile.id
      }
      if (currentReference.value.id) {
        // update reference
        store.dispatch('profile/updateReference', {
          ...referenceParam,
          id: currentReference.value.id,
        })
      } else {
        // add reference
        store.dispatch('profile/addReference', referenceParam)
      }
    }

    const deleteReference = () => {
      store.dispatch('profile/deleteReference', {
        id: currentReference.value.id,
        profileId: props.profile.id
      })
    }

    return {
      currentReference,
      deleteDlgVisible,
      deleteReference,
      handleAddClick,
      handleDeleteClick,
      handleEditClick,
      referenceModalId,
      saveReference,
    }
  }
})
</script>

<style lang="scss" scoped>
.reference-add-btn {
  margin: 10px;
}

.reference-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  max-height: 1500px;
  overflow-y: auto;

  .reference-card {
    width: 100%;
    margin: 10px;
    display: flex;
    flex-direction: column;
  }
}
</style>
