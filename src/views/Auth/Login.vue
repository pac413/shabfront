<template>
  <div class="pull-if-rtl d-flex justify-content-center">
    <div id="login-wrapper">
      <h1>{{ $t('login-view.title') }}</h1>
      <h4 class="sub-title text-secondary">
        <span
          v-if="action"
          class="text-advice"
          v-html="$t(
            'login-view.please-login-to-perform-action',
            {
              actionName: $t(`login-view.actions.${action.name}`),
              action: $t(`login-view.action-types.${action.action}`)
            }
          )"
        />
        <span v-else>{{ $t('login-view.sub-title') }}</span>
      </h4>
      <div
        v-if="loading"
        class="loading-msg"
      >
        <h3>Logging in...</h3>
        <Spinner />
      </div>
      <div v-else>
        <VeeForm
          id="login-form"
          v-slot="{ meta }"
          role="form"
          @submit="login"
        >
          <div class="mb-2 mb-md-3">
            <Field
              v-slot="{ field, errors, handleChange }"
              name="email"
              :rules="emailRules"
            >
              <input
                name="email"
                type="text"
                class="form-control login-input"
                :placeholder="$t('login-view.email')"
                :class="{ 'is-invalid': errors[0] }"
                :value="field.value"
                @change="handleChange"
              >
              <div
                v-if="errors.length > 0"
                class="invalid-feedback"
              >
                <span class="pull-if-rtl-label">
                  {{ $t(errors[0]) }}
                </span>
              </div>
            </Field>
          </div>
          <div class="login-input-item mb-2 mb-md-3">
            <Field
              v-slot="{ field, errors, handleChange }"
              name="password"
              :rules="passwordRules"
            >
              <input
                :type="passwordInputType"
                class="form-control login-input"
                name="password"
                :placeholder="$t('login-view.password')"
                :class="{ 'is-invalid': errors[0] }"
                :value="field.value"
                @change="handleChange"
              >
              <div
                v-if="errors.length > 0"
                class="invalid-feedback"
              >
                <span class="pull-if-rtl-label">
                  {{ $t(errors[0]) }}
                </span>
              </div>
              <FaIcon
                :icon="passwordInputIcon"
                class="password-view-icon"
                :class="{ 'is-invalid': errors[0] }"
                @click="togglePassword"
              />
            </Field>
          </div>
          <BButton
            variant="primary"
            type="submit"
            :disabled="!meta.valid"
          >
            {{ $t('login-view.login') }}
          </BButton>
          <div class="text-center pt-2 small">
            <a href="/reset-password">{{ $t('login-view.reset-link') }}</a>
          </div>
          <div class="pt-2">
            {{ $t('login-view.new-account-txt') }}
            <RouterLink
              :to="{ name: 'Landing' }"
              class="fw-bold"
            >
              {{ $t('login-view.new-account-link') }}
            </RouterLink>
          </div>
        </VeeForm>
        <div class="or">
          &mdash; {{ $t('login-view.or') }} &mdash;
        </div>
        <div class="alternate-logins">
          <google-login-button from-login />
          <facebook-login-button from-login />
          <apple-login-button from-login />
        </div>
      </div>
      <div
        class="privacy small text-secondary"
        v-html="$t('login-view.privacy-disclaimer')"
      />
      <div
        v-if="isIOS"
        class="app-download"
      >
        <app-store-button />
      </div>
      <div
        v-else-if="isAndroid"
        class="app-download"
      >
        <google-store-button />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { Field,Form as VeeForm } from 'vee-validate'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import AppleLoginButton from '@/components/Common/Buttons/AppleLoginButton.vue'
import AppStoreButton from '@/components/Common/Buttons/AppStoreButton.vue'
import FacebookLoginButton from '@/components/Common/Buttons/FacebookLoginButton.vue'
import GoogleLoginButton from '@/components/Common/Buttons/GoogleLoginButton.vue'
import GoogleStoreButton from '@/components/Common/Buttons/GoogleStoreButton.vue'
import { useToast, useValidationRules } from '@/composables'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { getMobileOS } from '@/utils'

export default defineComponent({
  name: 'Login',
  components: {
    AppStoreButton,
    GoogleStoreButton,
    GoogleLoginButton,
    FacebookLoginButton,
    AppleLoginButton,
    Field,
    VeeForm
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const { showErrorToast } = useToast()
    const { emailRules, passwordRules } = useValidationRules()

    const loading = ref<boolean>(false)
    const passwordInputType = ref<'password' | 'text'>('password')
    const redirect = computed(() =>
      route.query ? (route.query.redirect as string | null) : null
    )
    const action = computed(() => {
      if (redirect.value) {
        if (redirect.value.startsWith('/planner')) {
          const matches = redirect.value.match('/planner/(.+?)/.+?/.*')
          if (matches) {
            return {
              name: matches[1],
              action: 'respond'
            }
          }
        }
        const matches = redirect.value.match('/action/(.+?)/(.+?)/.*')
        if (matches) {
          return {
            name: matches[1],
            action: matches[2]
          }
        }
      }
      return null
    })
    const passwordInputIcon = computed(() => {
      return passwordInputType.value === 'password' ? ['fal', 'eye'] : ['fal', 'eye-slash']
    })

    const togglePassword = () => {
      passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password'
    }

    const login = async (values: Record<string, string>) => {
      loading.value = true

      const response = await store.dispatch('auth/login', {
        email: values.email,
        password: values.password,
      })
      loading.value = false

      if ('error' in response) {
        if (response.error.errorCode === 'errors.auth.deleted') {
          return showModal({
            modal: Modal.RESTORE_ACCOUNT,
            props: {
              email: values.email,
              password: values.password,
              redirect: redirect.value
            }
          })
        }
        return showErrorToast(response)
      }
      router.push(redirect.value || '/feed')
    }

    const isIOS = computed(() => getMobileOS() === 'iOS')
    const isAndroid = computed(() => getMobileOS() === 'Android')

    useHead({
      title: 'Login to Shabbat.com'
    })

    return {
      action,
      emailRules,
      isAndroid,
      isIOS,
      loading,
      passwordInputType,
      passwordInputIcon,
      login,
      passwordRules,
      redirect,
      togglePassword
    }
  }
})
</script>

<style lang="scss" scoped>
#login-form {
  padding-top: 1rem;
  font-size: 1em;
}

#login-wrapper {
  padding: 3rem 0;
  width: 350px;
  text-align: center;
}

.login-input-item {
  position: relative;
}

.login-input {
  font-size: 14px;

  @media (min-width: $tabletMaxWidth) {
    height: 30px;
    color: #555;
  }
  
  &[name="password"] {
    padding-right: 32px;
  }

  &[name="password"].is-invalid{
    background-image: none;
  }
}

.password-view-icon {
  position: absolute;
  right: 0.5rem;
  top: 10px;
  font-size: 14px;

  @media (min-width: $tabletMaxWidth) {
    top: 8px;
  }
  &.is-invalid {
    color: $colorRed;
  }
}

.sub-title {
  font-size: 1.2em;
}

.text-advice {
  font-size: 21px;
  font-weight: 600;
  color: indigo;

  :deep(.highlighted) {
    color: #f43838;
  }
}

.loading-msg {
  margin: 3rem auto;
  color: #ccc;
}

.form-check {
  display: flex;
  justify-items: flex-start;
}

button[type='submit'] {
  width: 100%;
  margin-top: 10px;
}

.or {
  text-align: center;
  font-weight: bold;
  padding: 2rem;
}

.alternate-logins {
  display: flex;
  flex-direction: column;

  > button:not(:first-child) {
    margin-top: 20px;
  }
}

.app-download {
  display: block;
  margin: 2em;
}

.privacy {
  padding-top: 2em;
}

.invalid-feedback {
  font-size: 12px;
  text-align: left;
}
</style>
