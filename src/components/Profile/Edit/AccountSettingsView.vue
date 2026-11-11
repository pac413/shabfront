<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'envelope']"
          class="me-1"
        />
        {{ $t('profile-edit.account-settings.email') }}
      </div>
      <div class="panel-body">
        <BFormGroup
          id="email-group"
          class="form-group"
          :label="$t('profile-edit.account-settings.email-label')"
          label-for="email-input"
          label-class="input-label"
        >
          <BFormInput
            id="email-input"
            v-model="email"
            type="email"
            :disabled="isAdmin"
            :placeholder="profile.email"
          />
          <div v-if="emailErrors" class="error-details pull-if-rtl-label">
            {{ $t(emailErrors) }}
          </div>
        </BFormGroup>
        <BButton
          v-if="!isAdmin"
          variant="primary"
          size="sm"
          :disabled="!!emailErrors || email === profile.email"
          @click="updateEmail"
        >
          {{ $t('profile-edit.account-settings.update-email') }}
        </BButton>
      </div>
    </div>

    <template v-if="!isAdmin">
      <div class="panel">
        <div class="panel-header">
          <FaIcon
            :icon="['fal', 'lock']"
            class="me-1"
          />
          {{ $t('profile-edit.account-settings.password') }}
        </div>
        <div class="panel-body">
          <BFormGroup
            id="password-group"
            class="form-group"
            :label="$t('profile-edit.account-settings.password-label')"
            label-for="password-input"
            label-class="input-label"
          >
            <BFormInput
              id="password-input"
              v-model="password"
              type="password"
              placeholder="********"
            />
            <div v-if="passwordErrors" class="error-details pull-if-rtl-label">
              {{ $t(passwordErrors) }}
            </div>
          </BFormGroup>
          <BButton
            variant="primary"
            size="sm"
            :disabled="!!passwordErrors"
            @click="changePassword"
          >
            {{ $t('profile-edit.account-settings.change-password') }}
          </BButton>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <FaIcon
            :icon="['fal', 'trash']"
            class="me-1"
          />
          {{ $t('profile-edit.account-settings.delete-account-title') }}
        </div>
        <div class="panel-body">
          <div class="input-label mb-3">
            {{ $t('profile-edit.account-settings.delete-account-label') }}
          </div>
          <BButton
            variant="primary"
            size="sm"
            @click="openDeleteAccountDlg"
          >
            {{ $t('profile-edit.account-settings.delete-my-account') }}
          </BButton>
        </div>
      </div>
    </template>

    <ConfirmationDialog
      id="delete-account-confirm-dialog"
      v-model="deleteDlgVisible"
      :body="$t('profile-edit.account-settings.delete-account-confirmation-description')"
      :title="$t('profile-edit.account-settings.delete-account-confirmation-title')"
      @success="deleteAccount"
    />
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import { useToast, useValidationRules } from '@/composables'
import type { IProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'AccountSettingsView',
  components: {
    ConfirmationDialog,
  },
  props: {
    profile: {
      type: Object as () => IProfile,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const router = useRouter()
    const { showSuccessToast, showErrorToast } = useToast()
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const deleteDlgVisible = ref<boolean>(false)

    const { emailRules, passwordRules } = useValidationRules()
    const {
      errorMessage: emailErrors,
      value: email,
    } = useField<string>('email', emailRules, {
      initialValue: props.profile.email || ''
    })
    const {
      errorMessage: passwordErrors,
      value: password
    } = useField<string>('password', passwordRules)

    const logout = async () => {
      await store.dispatch('auth/logout', { router })
    }

    const updateEmail = async () => {
      try {
        const { success } = await store.dispatch('auth/updateEmail', { email: email.value })
        if (success) { // auto log out
          await logout()
          showSuccessToast(
            t('profile-edit.account-settings.update-email-success').toString(),
            t('profile-view.general.success').toString()
          )
        }
      } catch (error: any) {
        showErrorToast(error, t('profile-view.general.error').toString())
        console.error(error.message)
      }
    }

    const changePassword = async () => {
      try {
        const { success } = await store.dispatch('auth/changePassword', { password: password.value })
        if (success) { // auto log out
          await logout()
          showSuccessToast(
            t('profile-edit.account-settings.change-password-success').toString(),
            t('profile-view.general.success').toString()
          )
        }
      } catch (error: any) {
        showErrorToast(
          t('profile-edit.account-settings.change-password-failure').toString(),
          t('profile-view.general.error').toString()
        )
      }
    }

    const openDeleteAccountDlg = () => {
      deleteDlgVisible.value = true
    }

    const deleteAccount = async () => {
      try {
        const { success } = await store.dispatch('auth/deleteUserAccount')
        if (success) {
          showSuccessToast(
            t('profile-edit.account-settings.delete-account-success').toString(),
            t('profile-view.general.success').toString()
          )
          // auto log out
          await logout()
        }
      } catch (error: any) {
        showErrorToast(
          t('profile-edit.account-settings.delete-account-failure').toString(),
          t('profile-view.general.error').toString()
        )
      }
    }

    return {
      changePassword,
      deleteAccount,
      deleteDlgVisible,
      email,
      emailErrors,
      isAdmin,
      logout,
      openDeleteAccountDlg,
      password,
      passwordErrors,
      updateEmail,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
