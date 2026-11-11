<template>
  <ConfirmationDialog
    :id="modalId"
    v-model="isModalVisible"
    :body="$t('modals.block-member.body')"
    :title="$t('modals.block-member.title', { firstName: profile.firstName})"
    @success="blockProfile"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import { useToast } from '@/composables'
import type { IProfileFragmentFragment } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'

const modalId = Modal.BLOCK_MEMBER

export default defineComponent({
  name: 'BlockMemberModal',
  components: {
    ConfirmationDialog
  },
  props: {
    profile: {
      type: Object as () => IProfileFragmentFragment,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const { showSuccessToast, showErrorToast } = useToast()
    const isModalVisible = ref<boolean>(true)

    const hideDialog = () => {
      isModalVisible.value = false
    }

    const blockProfile = async () => {
      try {
        await store.dispatch('profile/blockProfile', props.profile)
        showSuccessToast(
          t('modals.block-member.success.body').toString(),
          t('modals.block-member.success.title').toString()
        )
        if (route.name === 'Profile') {
          await router.replace('/feed')
        }
      } catch (error: any) {
        showErrorToast(error, t('modals.flag-content.success.title').toString())
      } finally {
        hideDialog()
      }
    }

    return {
      blockProfile,
      hideDialog,
      isModalVisible,
      modalId
    }
  }
})
</script>
