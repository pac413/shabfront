<template>
  <BModal :id="modalId" v-model="isVisible" centered :title="$t('profile-view.modal.avatar-remind-title')">
    <div class="cam-container">
      {{ $t('profile-view.modal.avatar-remind-text') }}
    </div>
    <template #footer>
      <BButton variant="secondary" @click.prevent="onDontRemind">
        {{ $t('profile-view.modal.do-not-remind') }}
      </BButton>
      <BButton variant="primary" @click="onAddAvatar">
        {{ $t('profile-view.modal.continue') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useModal, useRegisterModal } from '@/composables'

const modalId = 'check-avatar-modal'

export default defineComponent({
  name: 'CheckAvatarModal',
  setup() {
    const modal = useModal()
    const { isVisible } = useRegisterModal(modalId)
    const onDontRemind = () => {
      localStorage.setItem('remind_add_avatar', 'no')
      isVisible.value = false
    }

    const onAddAvatar = () => {
      isVisible.value = false
      modal.show('pha-upload-picture')
    }

    return {
      isVisible,
      modalId,
      onAddAvatar,
      onDontRemind,
    }
  },
})
</script>

<style lang="scss" scoped>
.cam-container {
  width: 100%;
  background: white;
}
</style>
