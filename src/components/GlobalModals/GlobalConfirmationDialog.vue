
<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="title || $t('general.confirm-dialog-title')"
  >
    <div class="w-100 pull-if-rtl-label" v-html="body" />
    <div class="modal-footer">
      <BButton variant="secondary" class="pull-if-rtl-label" @click="onNoClick">
        {{ noText }}
      </BButton>
      <BButton variant="primary" class="pull-if-rtl-label" @click="onYesClick">
        {{ yesText }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal } from '@/composables'
import { Modal } from '@/stores/modal'

const modalId = Modal.GLOBAL_CONFIRMATION_DIALOG

export default defineComponent({
  name: 'GlobalConfirmationDialog',
  props: {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    yes: {
      type: String,
      default: null,
    },
    no: {
      type: String,
      default: null,
    },
    onCancel: {
      type: Function,
      default: null,
    },
    onSuccess: {
      type: Function,
      default: null,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const noText = computed(() => props.no || t('general.no').toString())
    const yesText = computed(() => props.yes || t('general.yes').toString())
    const { isVisible } = useRegisterModal(modalId)

    const onNoClick = () => {
      isVisible.value = false
      props.onCancel && props.onCancel()
    }
    const onYesClick = () => {
      isVisible.value = false
      props.onSuccess && props.onSuccess()
    }

    return {
      isVisible,
      modalId,
      noText,
      onNoClick,
      onYesClick,
      yesText,
    }
  },
})
</script>
