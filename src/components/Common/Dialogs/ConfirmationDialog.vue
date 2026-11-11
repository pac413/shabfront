<template>
  <BModal
    :id="id"
    v-model="isVisible"
    lazy
    centered
    modal-class="shabbat-sm-modal"
    hide-footer
    :title="title || $t('general.confirm-dialog-title')"
    @hidden="$emit('update:modelValue', false)"
    @shown="$emit('update:modelValue', true)"
  >
    <div class="w-100 pull-if-rtl-label" v-html="body" />
    <div class="modal-footer">
      <BButton variant="secondary" class="pull-if-rtl-label" @click="onCancel">
        {{ noText }}
      </BButton>
      <BButton variant="primary" class="pull-if-rtl-label" @click="onSuccess">
        {{ yesText }}
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { watch } from 'vue'
import { computed, defineComponent, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal } from '@/composables'

/**
 * Common Yes/No Dialog with title and description
 *
 * @param title Title of the dialog
 * @param body Description to show in the dialog
 * @param value Boolean value to sync the current dialog visible status
 *
 * Usage
 *  <ConfirmationDialog
 *    v-model="dlgVisible"
 *    title="Title"
 *    body="body"
 *    @cancel="onCancel"
 *    @success="onSuccess"
 *  />
 */
export default defineComponent({
  name: 'ConfirmationDialog',
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
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
    successArgs: {
      type: Object,
      default: null,
    },
  },
  emits: ['cancel', 'success', 'update:modelValue'],
  setup(props, context) {
    const { id, modelValue } = toRefs(props)
    const { t } = useI18n()
    const noText = computed(() => props.no || t('general.no').toString())
    const yesText = computed(() => props.yes || t('general.yes').toString())
    const { isVisible } = useRegisterModal(id)
    const onCancel = () => {
      isVisible.value = false
      context.emit('cancel')
    }
    const onSuccess = () => {
      isVisible.value = false
      context.emit('success', props.successArgs)
    }

    watch(modelValue, () => {
      isVisible.value = modelValue.value
    })

    return {
      isVisible,
      noText,
      onCancel,
      onSuccess,
      yesText,
    }
  },
})
</script>
