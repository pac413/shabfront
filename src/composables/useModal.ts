import { computed, onUnmounted, type Ref, ref, watch } from 'vue'

import { type Modal, useModalStore } from '@/stores/modal'

const modalsVisible = ref<{ [key: string]: boolean }>({})

export const useRegisterModal = (modalId: string | Ref<string>) => {
  const computedModalId = computed(() => (typeof modalId === 'string' ? modalId : modalId.value))
  const { hideModal } = useModalStore()
  const isVisible = computed({
    get() {
      return modalsVisible.value[computedModalId.value] || false
    },
    set(value: boolean) {
      modalsVisible.value = {
        ...modalsVisible.value,
        [computedModalId.value]: value,
      }
      if (!value) {
        hideModal(computedModalId.value as unknown as Modal)
      }
    },
  })

  onUnmounted(() => {
    delete modalsVisible.value[computedModalId.value]
  })

  watch(computedModalId, (value, oldValue) => {
    delete modalsVisible.value[oldValue]
    modalsVisible.value = {
      ...modalsVisible.value,
      [value]: isVisible.value,
    }
  })

  return {
    isVisible,
  }
}

export const useModal = () => {
  const { hideModal } = useModalStore()
  return {
    show(modalId: string) {
      modalsVisible.value = {
        ...modalsVisible.value,
        [modalId]: true,
      }
    },
    hide(modalId: string) {
      modalsVisible.value = {
        ...modalsVisible.value,
        [modalId]: false,
      }
      hideModal(modalId as unknown as Modal)
    },
  }
}
