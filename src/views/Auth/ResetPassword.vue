<template>
  <div class="pull-if-rtl inner-container indent">
    <div id="set-new-password">
      <div
        v-if="!submitted"
        class="reset-password"
      >
        <h1 class="shabbat-red-text">
          {{ $t('reset-password-view.title') }}
        </h1>
        <p v-html="$t('reset-password-view.message')" />
        <VeeForm
          v-slot="{ meta }"
          as="div"
          @submit="submit"
        >
          <BAlert
            :model-value="!!errorMessage"
            variant="danger"
          >
            {{ errorMessage }}
          </BAlert>
          <form class="reset-form">
            <div class="form-group">
              <Field
                v-slot="{ field, errors }"
                name="email"
                :rules="emailRules"
              >
                <input
                  v-bind="field"
                  type="text"
                  class="form-control"
                  :name="$t('login-view.email')"
                  :placeholder="$t('login-view.email')"
                  :class="{'is-invalid': errors.length > 0}"
                >
                <div v-if="errors.length > 0" class="error-details pull-if-rtl-label">
                  {{ $t(errors[0]) }}
                </div>
              </field>
            </div>
            <BButton
              type="submit"
              variant="primary"
              :disabled="!meta.valid || loading"
            >
              {{ $t('reset-password-view.button-txt') }}
              <BSpinner
                v-if="loading"
                small
                variant="light"
                class="spinner"
              />
            </BButton>
          </form>
        </VeeForm>
        <div
          class="pt-4"
          v-html="$t('reset-password-view.support-message')"
        />
      </div>
      <div
        v-else
        class="reset-password"
      >
        <h1>{{ $t('reset-password-view.title') }}</h1>
        <div
          v-if="successMessage"
          class="alert alert-warning"
          role="alert"
        >
          {{ successMessage }}
        </div>
        <div
          v-else
          class="alert alert-warning"
          role="alert"
        >
          {{ $t('reset-password-view.reset-link-sent') }} <br>
          {{ $t('reset-password-view.click-link-to-reset') }}
        </div>

        <div class="actions">
          <div>
            {{ $t('reset-password-view.resend-text') }} <a
              href="#"
              @click.prevent="resend"
            >{{ $t('reset-password-view.resend') }}.</a>
          </div>
          <hr>
          <div>
            <a
              href="#"
              @click.prevent="changeEmail"
            >{{ $t('reset-password-view.change-email') }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Field,Form as VeeForm } from 'vee-validate'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { useToast, useValidationRules } from '@/composables'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'ResetPassword',
  components: {
    Field,
    VeeForm,
  },
  setup() {
    const { showSuccessToast } = useToast()
    const { t } = useI18n()
    const store = useStore(storeKey)

    const email = ref<string>('')
    const loading = ref<boolean>(false)
    const errorMessage = ref<string | null>(null)
    const submitted = ref<boolean>(false)
    const successMessage = ref<string | null>(null)

    const { emailRules } = useValidationRules()

    const resend = async () => {
      loading.value = true
      const success = await submit({ email: email.value })

      if (success) {
        showSuccessToast(t('reset-password-view.email-resend').toString())
      }
    }

    const changeEmail = () => {
      submitted.value = false
      loading.value = false
    }

    const submit = async (values: Record<string, string>) => {
      loading.value = true
      errorMessage.value = null
      successMessage.value = null

      try {
        const res = await store.dispatch('auth/resetPassword', {
          email: values.email
        })
        if (res.data.success && res.data.message) {
          successMessage.value = res.data.message
        }
        submitted.value = true
        email.value = values.email

        return true
      } catch (err: any) {
        if (err.response && err.response.data.errorCode) {
          errorMessage.value = err.response.data.message
        }
        loading.value = false
      }

      return false
    }

    return {
      changeEmail,
      emailRules,
      errorMessage,
      loading,
      resend,
      submit,
      submitted,
      successMessage,
    }
  }
})
</script>

<style lang="scss" scoped>
#set-new-password {
  text-align: center;
  max-width: 400px;
  margin: 3rem auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.reset-form {
  display: flex;
  flex-direction: column;

  button[type=submit] {
    position: relative;

    .spinner {
      margin-left: 0.5rem;
    }
  }
}

.error-details {
  padding: 4px 10px;
}
</style>
