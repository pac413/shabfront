<template>
  <component :is="selectedModal" v-if="selectedModal" v-bind="selectedModalProps" />
</template>

<script lang="ts">
import { defineComponent, nextTick, watch } from 'vue'
import { computed } from 'vue'

import AdminMemberMessagesModal from '@/components/GlobalModals/AdminMemberMessagesModal.vue'
import BasicPhotoModal from '@/components/GlobalModals/BasicPhotoModal.vue'
import BlockMemberModal from '@/components/GlobalModals/BlockMemberModal.vue'
import BulkInviteModal from '@/components/GlobalModals/BulkInviteModal.vue'
import ConfirmAdminModal from '@/components/GlobalModals/ConfirmAdminModal.vue'
import ConfirmContentDeleteModal from '@/components/GlobalModals/ConfirmContentDeleteModal.vue'
import ConfirmHideAllPostsFromModal from '@/components/GlobalModals/ConfirmHideAllPostsFromModal.vue'
import ConfirmMemberDeleteModal from '@/components/GlobalModals/ConfirmMemberDeleteModal.vue'
import ConfirmMemberRestoreModal from '@/components/GlobalModals/ConfirmMemberRestoreModal.vue'
import ConfirmMemberUnreportModal from '@/components/GlobalModals/ConfirmMemberUnreportModal.vue'
import ConfirmMessageDeleteModal from '@/components/GlobalModals/ConfirmMessageDeleteModal.vue'
import ConfirmPostDeleteModal from '@/components/GlobalModals/ConfirmPostDeleteModal.vue'
import ConfirmPostHideFromFeedModal from '@/components/GlobalModals/ConfirmPostHideFromFeedModal.vue'
import ConfirmPostingRestrictModal from '@/components/GlobalModals/ConfirmPostingRestrictModal.vue'
import ConfirmUnfriendModal from '@/components/GlobalModals/ConfirmUnfriendModal.vue'
import ConfirmZealotModal from '@/components/GlobalModals/ConfirmZealotModal.vue'
import CreateBroadcastConversationModal from '@/components/GlobalModals/CreateBroadcastConversationModal/CreateBroadcastConversationModal.vue'
import CreateInviteModal from '@/components/GlobalModals/CreateInviteModal.vue'
import DatingProfileModal from '@/components/GlobalModals/DatingProfileModal.vue'
import EndorsementModal from '@/components/GlobalModals/EndorsementModal.vue'
import EndorsementTemplatesModal from '@/components/GlobalModals/EndorsementTemplatesModal.vue'
import FeedItemLikesModal from '@/components/GlobalModals/FeedItemLikesModal.vue'
import FeedItemModal from '@/components/GlobalModals/FeedItemModal.vue'
import FlagContentModal from '@/components/GlobalModals/FlagContentModal.vue'
import GlobalConfirmationDialog from '@/components/GlobalModals/GlobalConfirmationDialog.vue'
import MergeSocialLoginModal from '@/components/GlobalModals/MergeSocialLoginModal.vue'
import MessageImagePreviewModal from '@/components/GlobalModals/MessageImagePreviewModal.vue'
import MessageInfoModal from '@/components/GlobalModals/MessageInfoModal.vue'
import PrivateInvitePasscodeModal from '@/components/GlobalModals/PrivateInvitePasscodeModal.vue'
import ReportMemberModal from '@/components/GlobalModals/ReportMemberModal.vue'
import RestoreAccountModal from '@/components/GlobalModals/RestoreAccountModal.vue'
import ViewBlockingModal from '@/components/GlobalModals/ViewBlockingModal.vue'
import { useModal } from '@/composables'
import { useModalStore } from '@/stores/modal'
/**
 * HOW TO DISPLAY AN EXISTING GLOBAL MODAL
 * ===================================
 * From a component's method, dispatch an action to the store:
 *
 *   const { showModal } = useModalStore()
 *   showModal({ // This same action is used for all modals
 *     modal: Modal.DATING_PROFILE,             // Or, display another global modal, listed in the 'Modal' enum
 *     props: {                                 // You must send correct Props for the selected modal - see @/store/modal/types.ts
 *       profile: this.profile
 *     }
 *   })
 *
 * HOW TO ADD A NEW GLOBAL MODAL
 * =============================
 * 1. Create a component (place it in /GlobalModals folder - optional)
 * 2. Include it in the components section in this file (GlobalModals.vue) **important, as component will be created dynamically
 * 3. Add your component to 'Modal' enum in @/store/modal.ts
 * 4. Add an interface for your component's props, and add it to 'ModalProps' type (also in @/store/modal/types.ts)
 *
 * See existing modals for examples
 */
export default defineComponent({
  name: 'GlobalModals',
  components: {
    AdminMemberMessagesModal,
    CreateInviteModal,
    ConfirmUnfriendModal,
    DatingProfileModal,
    ConfirmPostDeleteModal,
    ConfirmPostHideFromFeedModal,
    ConfirmHideAllPostsFromModal,
    ConfirmPostingRestrictModal,
    ConfirmContentDeleteModal,
    FeedItemModal,
    FeedItemLikesModal,
    BasicPhotoModal,
    ConfirmMemberDeleteModal,
    ConfirmMemberRestoreModal,
    EndorsementModal,
    GlobalConfirmationDialog,
    EndorsementTemplatesModal,
    ReportMemberModal,
    FlagContentModal,
    BlockMemberModal,
    RestoreAccountModal,
    ConfirmZealotModal,
    ConfirmAdminModal,
    ViewBlockingModal,
    ConfirmMemberUnreportModal,
    MergeSocialLoginModal,
    MessageInfoModal,
    ConfirmMessageDeleteModal,
    MessageImagePreviewModal,
    BulkInviteModal,
    CreateBroadcastConversationModal,
    PrivateInvitePasscodeModal
  },
  setup() {
    const modal = useModal()
    const modalStore = useModalStore()
    const selectedModal = computed(() => modalStore.selectedModal)
    const selectedModalProps = computed(() => modalStore.selectedModalProps)

    watch(() => modalStore.selectedModal, (newValue, oldValue) => {
      if (!newValue) {
        if (oldValue) {
          nextTick(() => modal.hide(oldValue))
        }
        return
      }
      nextTick(() => modal.show(newValue))
    })

    return {
      selectedModal,
      selectedModalProps,
    }
  },
})
</script>
