<template>
  <BModal :id="modalId" v-model="isVisible" lazy centered size="md" :title="$t('modals.restore-account.title')">
    <p>{{ $t('modals.restore-account.subtitle') }}</p>
    <BFormGroup
      id="restore-account-group"
      class="form-group"
      :label="$t('modals.restore-account.body')"
      label-for="restore-account-textarea"
      label-class="restore-account-label"
    >
      <BFormInput
        id="restore-account-input"
        v-model="passwordInput"
        autofocus
        type="password"
        rows="8"
        :class="{ 'is-invalid': errors.length > 0 }"
      />
      <div v-if="errors.length > 0" class="error-details pull-if-rtl-label">
        {{ $t(errors[0]) }}
      </div>
    </BFormGroup>
    <div v-if="loading">
      <Spinner small />
    </div>
    <template #footer>
      <BButton variant="secondary" @click="hideDialog">
        {{ $t('general.cancel') }}
      </BButton>
      <BButton variant="primary" :disabled="!meta.dirty || errors.length > 0" @click="restoreMember">
        {{ $t('modals.restore-account.button') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useRegisterModal, useToast,useValidationRules } from '@/composables'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'

const modalId = Modal.RESTORE_ACCOUNT

export default defineComponent({
  name: 'RestoreAccountModal',
  props: {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    redirect: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const store = useStore(storeKey)
    const { showSuccessToast, showErrorToast } = useToast()
    const router = useRouter()

    const loading = ref<boolean>(false)
    const { passwordRules } = useValidationRules()
    const { errors, meta, value: passwordInput } = useField<string>('password', passwordRules)

    const hideDialog = () => {
      isVisible.value = false
    }

    const restoreMember = async () => {
      loading.value = true

      const { success, errorCode } = await store.dispatch('auth/restoreAccount', {
        email: props.email,
        password: passwordInput.value,
      })

      if (success) {
        showSuccessToast(
          t('modals.restore-account.success.body').toString(),
          t('modals.restore-account.success.title').toString(),
        )

        await store.dispatch('auth/login', {
          email: props.email,
          password: passwordInput.value,
        })

        router.push(props.redirect || '/feed')

        hideDialog()
      } else if (errorCode === 'errors.auth.invalid-credentials') {
        errors.value = ['modals.restore-account.error.password']
      } else {
        showErrorToast(
          t('modals.restore-account.error.unknown.body').toString(),
          t('modals.restore-account.error.unknown.title').toString(),
        )
      }
      loading.value = false
    }

    onMounted(() => {
      if (props.password) {
        passwordInput.value = props.password
      }
      loading.value = false
    })

    return {
      errors,
      hideDialog,
      isVisible,
      loading,
      meta,
      modalId,
      passwordInput,
      restoreMember,
    }
  },
})
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
