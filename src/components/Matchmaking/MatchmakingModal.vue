<template>
  <BModal
    :id="id"
    v-model="isVisible"
    size="lg"
    @show="onShow"
  >
    <div class="matchmaking-container">
      <div class="mb-5 pt-2">
        {{ $t('matchmaking-view.modal-description') }}
      </div>
      <div class="mb-3">
        <label for="matchmaking-suggestion">
          {{ $t('matchmaking-view.modal-suggestion-label') }}
        </label>
        <BFormSelect
          id="matchmaking-suggestion"
          v-model="suggestion"
          class="matchmaking-suggestion"
          :options="suggestionOptions"
        />
      </div>
      <div class="mb-3">
        <label for="matchmaking-note">
          {{ $t('matchmaking-view.modal-note-label') }}
        </label>
        <BFormTextarea
          id="matchmaking-note"
          v-model="note"
          rows="3"
        />
      </div>
    </div>

    <template #title>
      <div class="matchmaking-title">
        <FaIcon
          class="me-2"
          :icon="['fal', 'heart']"
        />
        {{ $t('matchmaking-view.modal-title') }}
      </div>
    </template>
    <template #footer>
      <BButton
        variant="secondary"
        @click="onCancel"
      >
        {{ $t('matchmaking-view.modal-close') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="completeMatchDisabled"
        @click="onOk"
      >
        {{ $t('matchmaking-view.modal-complete-match') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal } from '@/composables'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'MatchmakingModal',
  props: {
    id: {
      required: true,
      type: String
    },
    guy: {
      type: Object as () => Profile | null,
      default: null
    },
    girl: {
      type: Object as () => Profile | null,
      default: null
    }
  },
  emits: ['complete'],
  setup(props, { emit }) {
    const { id } = toRefs(props)
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(id)
    const suggestion: Ref<string | null> = ref(null)
    const note: Ref<string> = ref('')

    const suggestionOptions = computed(() => {
      if (props.guy && props.girl) {
        return [
          { value: null, text: t('matchmaking-view.modal-suggestion-placeholder').toString(), disabled: true },
          { value: 'GUY', text: `${props.guy.firstName} ${props.guy.lastName}` },
          { value: 'GIRL', text: `${props.girl.firstName} ${props.girl.lastName}` },
          { value: 'BOTH', text: t('matchmaking-view.modal-suggestion-both-prospects').toString() }
        ]
      }
      return [
        { value: null, text: 'Please select an option', disabled: true }
      ]
    })

    const completeMatchDisabled = computed(() => {
      return !suggestion.value || !note.value
    })

    const onShow = () => {
      suggestion.value = null
      note.value = ''
    }

    const onOk = () => {
      emit('complete', suggestion.value, note.value)
      isVisible.value = false
    }

    const onCancel = () => {
      isVisible.value = false
    }

    return {
      isVisible,
      suggestion,
      note,
      suggestionOptions,
      completeMatchDisabled,
      onShow,
      onOk,
      onCancel
    }
  }
})
</script>

<style lang="scss" scoped>

.matchmaking-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.matchmaking-container {
  font-family: Poppins;
  font-weight: 400;
  line-height: 1.5;
  color: #1e2022;

  .matchmaking-suggestion {
    height: 50px;
  }
}
</style>
