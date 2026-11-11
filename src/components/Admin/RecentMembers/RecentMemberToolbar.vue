<template>
  <div
    class="d-flex align-items-center"
  >
    <div class="me-2">
      <BFormCheckbox
        name="toggleAll"
        button-variant="secondary"
        :indeterminate="partiallySelected"
        :model-value="allSelected"
        @change="$emit('toggle-all', !allSelected)"
      >
        {{ allSelected ? $t('sticky-subheader.unselect-all') : $t('sticky-subheader.select-all') }}
      </BFormCheckbox>
    </div>
    <BButton
      v-if="hasAnySelected"
      class="me-2"
      variant="primary"
      size="sm"
      @click="suspendSelected"
    >
      Suspend Selected
    </BButton>
    <BButton
      v-if="hasAnySelected"
      class="me-2"
      variant="primary"
      size="sm"
      @click="deleteSelected"
    >
      Delete Selected
    </BButton>

    <ConfirmationDialog
      id="recent-members-delete-confirm-dlg"
      v-model="showDeleteConfirmationDlg"
      :body="`Are you sure to ${shouldSuspend ? 'suspend' : 'delete'} selected profiles?`"
      title="Confirmation"
      @success="onDeleteConfirmed"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref } from 'vue'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import { type IAdminRecentMemberFragmentFragment } from '@/composables/graphql/generated'

export default defineComponent({
  name: 'RecentMembersToolbar',
  components: {
    ConfirmationDialog,
  },
  props: {
    profiles: {
      type: Array as () => IAdminRecentMemberFragmentFragment[],
      required: true,
    },
    profilesSelection: {
      type: Object as () => { [key:string]: boolean },
      required: true,
    }
  },
  emits: ['toggle-all', 'delete-selected'],
  setup(props, { emit }) {
    const showDeleteConfirmationDlg: Ref<boolean> = ref(false)
    const shouldSuspend: Ref<boolean> = ref(false)

    const hasAnySelected = computed(() => Object.values(props.profilesSelection).some(item => item))
    const allSelected = computed(() => (
      hasAnySelected.value && 
      Object.values(props.profilesSelection).filter(item => item).length === props.profiles.length
    ))
    const partiallySelected = computed(() => (
      hasAnySelected.value && 
      Object.values(props.profilesSelection).filter(item => item).length !== props.profiles.length
    ))

    const onDeleteConfirmed = () => emit('delete-selected', shouldSuspend.value)
      
    const suspendSelected = () => {
      shouldSuspend.value = true
      showDeleteConfirmationDlg.value = true
      
    }

    const deleteSelected = () => {
      shouldSuspend.value = false
      showDeleteConfirmationDlg.value = true
    }

    return {
      allSelected,
      hasAnySelected,
      partiallySelected,
      suspendSelected,
      deleteSelected,
      shouldSuspend,
      showDeleteConfirmationDlg,
      onDeleteConfirmed
    }
  }
})
</script>
