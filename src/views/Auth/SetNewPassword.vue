<template>
  <div class="pull-if-rtl inner-container indent">
    <div id="set-new-password">
      <div
        v-if="!submitted"
        class="reset-password"
      >
        <h1 class="shabbat-red-text">
          {{ $t('reset-password-view.set-new-password') }}
        </h1>
        <h4
          v-if="!isExpired"
          class="sub-title text-secondary"
        >
          {{ $t('reset-password-view.enter-new-password') }}
        </h4>
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
          <BAlert
            :model-value="!!isExpired"
            variant="danger"
          >
            <div v-html="$t(`reset-password-view.link-expired`)" />
          </BAlert>
          <form v-if="!isExpired" class="set-new-password-form">
            <div class="form-group">
              <Field
                v-slot="{ field, errors }"
                name="password"
                :rules="passwordRules"
              >
                <input
                  v-bind="field"
                  type="password"
                  class="form-control"
                  name="password"
                  :placeholder="'New Password'"
                  :class="{'is-invalid': errors[0]}"
                >
                <div v-if="errors.length > 0" class="error-details pull-if-rtl-label">
                  {{ $t(errors[0]) }}
                </div>
              </Field>
            </div>
            <div class="form-group">
              <Field
                v-slot="{ field, errors }"
                name="repeatPassword"
                :rules="passwordRules"
              >
                <input
                  v-bind="field"
                  type="password"
                  class="form-control"
                  name="repeatPassword"
                  :placeholder="'Repeat Password'"
                  :class="{'is-invalid': errors[0]}"
                >
                <div v-if="errors.length > 0" class="error-details pull-if-rtl-label">
                  {{ $t(errors[0]) }}
                </div>
              </Field>
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
        <h1 class="shabbat-red-text">
          {{ $t('reset-password-view.set-new-password') }}
        </h1>
        <div
          class="alert alert-warning"
          role="alert"
        >
          {{ $t('reset-password-view.reset-success') }}
          <br>
          <div v-html="$t('reset-password-view.go-to-login-message')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Field, Form as VeeForm } from 'vee-validate'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useValidationRules } from '@/composables'
import { storeKey } from '@/store'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'SetNewPassword',
  components: {
    Field,
    VeeForm,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()

    const { passwordRules } = useValidationRules()

    const currentUserId = computed(() => store.state.auth.profileId)
    const errorMessage = ref<string | null>(null)
    const loading = ref<boolean>(false)
    const isExpired = ref<boolean>(false)
    const submitted = ref<boolean>(false)

    const submit = async (values: Record<string, string>) => {
      if (values.password !== values.repeatPassword) {
        errorMessage.value = t('reset-password-view.password-mismatch').toString()
      }
      loading.value = true
      errorMessage.value = null
      const token = getSingleIdFromRouteParam(route.params.token)

      try {
        await store.dispatch('auth/setNewPassword', {
          password: values.password,
          token,
        })
        submitted.value = true
      } catch (err: any) {
        if (err.response && err.response.data.error) {
          errorMessage.value = t(`set-new-password.${err.response.data.error}`).toString()
        }
        loading.value = false
      }
    }

    const checkLink = async () => {
      const token = getSingleIdFromRouteParam(route.params.token)
      const { data } = await store.dispatch('auth/checkLink', {
        type: 'resetPassword',
        token,
      })
      if (!data.valid) {
        isExpired.value = true
        return
      }

      // if there is an active session
      if (currentUserId.value) {
        // if it's the same user - redirect to the change password page
        // otherwise, logout first
        if (data.userId === currentUserId.value) {
          await router.replace({
            name: 'edit.account-settings'
          })
        } else {
          await store.dispatch('auth/logout', {
            redirect: route.path,
            router,
          })
        }
      }
    }

    onMounted(() => {
      checkLink()
    })

    return {
      checkLink,
      currentUserId,
      errorMessage,
      isExpired,
      loading,
      passwordRules,
      submit,
      submitted,
    }
  }
})
</script>

<style lang="scss" scoped>
#set-new-password {
  text-align: center;
  max-width: 350px;
  margin: 3rem auto;
}

.sub-title {
  font-size: 1.2em;
}

.set-new-password-form {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;

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
