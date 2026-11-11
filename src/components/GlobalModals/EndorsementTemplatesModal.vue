<template>
  <BModal
    :id="Modal.ENDORSEMENT_TEMPLATES"
    v-model="isVisible"
    centered
    size="lg"
    :title="$t('endorsement-templates.templates')"
    @hidden="onModalClosed"
  >
    <div class="panel-body">
      <BFormGroup class="mb-0">
        <BFormRadio
          v-for="(option, index) in templates"
          :key="index"
          v-model="template"
          class="template-text pull-if-rtl-label"
          :value="option"
          name="template"
          @change="onChangeTemplate"
        >
          {{ option }}
        </BFormRadio>
      </BFormGroup>
    </div>
    <template #footer>
      <BButton
        variant="secondary"
        @click="cancel"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="disabled"
        @click="select"
      >
        {{ $t('endorsement-templates.select') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal } from '@/composables'
import { IEndorsementSiteRole } from '@/composables/graphql/generated'
import { Modal, useModalStore } from '@/stores/modal'

const modalId = Modal.ENDORSEMENT_TEMPLATES

export default defineComponent({
  name: 'EndorsementTemplatesModal',
  props: {
    type: {
      type: String as () => IEndorsementSiteRole,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    onSelect: {
      type: Function,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const { closeAllModals } = useModalStore()
    const template = ref<string | null>(null)
    const templates = computed(() => {
      let count = 0
      const results: string[] = []
      if (props.type.toLowerCase() === IEndorsementSiteRole.Guest.toLowerCase()) {
        count = 8
      } else if (props.type.toLowerCase() === IEndorsementSiteRole.Host.toLowerCase()) {
        count = 10
      }
      if (count === 0) {
        return results
      }

      for (let i = 1; i <= count; i += 1) {
        const value = t(`endorsement-templates.${props.type.toLowerCase()}-template-${i}`, {
          firstName: props.firstName
        }).toString()
        results.push(value)
      }

      return results
    })
    const disabled = computed(() => !template.value)
    const cancel = (): void => {
      props.onSelect('')
      template.value = ''
    }
    const onModalClosed = (): void => {
      template.value = ''
      closeAllModals()
      props.onSelect('')
    }
    const select = (): void => {
      props.onSelect(template.value)
    }
    const onChangeTemplate = (value: string) => {
      template.value = value
    }

    return {
      template,
      templates,
      Modal,
      disabled,
      isVisible,
      onModalClosed,
      cancel,
      select,
      onChangeTemplate
    }
  }
})
</script>

<style lang="scss" scoped>
.template-text {
  font-size: 14px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}
</style>
