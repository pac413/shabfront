<template>
  <div class="register-section">
    <div class="d-flex flex-column align-items-center register-content">
      <!-- Facebook register -->
      <div class="row pt-3 px-5 social-btn facebook">
        <facebook-login-button :title="$t('login-view.facebook-sign-up-btn')" />
      </div>
      <div class="row pt-2 px-5 social-btn google">
        <google-login-button :title="$t('login-view.google-sign-up-btn')" />
      </div>
      <div class="row pt-2 px-5 social-btn apple">
        <apple-login-button :title="$t('login-view.apple-sign-up-btn')" />
      </div>

      <!-- Registration form -->
      <VeeForm
        id="contact-form"
        v-slot="{ meta }"
        class="col py-2 px-5 w-100"
        @submit="submit"
      >
        <BAlert
          :model-value="!!errorMessage"
          variant="danger"
        >
          {{ errorMessage }}
        </BAlert>
        <div class="col d-flex flex-column mb-2 mb-md-3">
          <Field
            v-slot="{ field, errors }"
            name="firstName"
            :rules="firstNameRules"
          >
            <input
              v-bind="field"
              id="firstName"
              name="firstName"
              type="text"
              class="form-control register-input"
              :class="{ 'is-invalid': errors[0] }"
              :placeholder="$t('landing.first-name-group.placemarker')"
            >
            <div
              v-if="errors[0]"
              class="invalid-feedback"
            >
              <span class="pull-if-rtl-label">
                {{ $t(errors[0]) }}
              </span>
            </div>
          </Field>
        </div>

        <div class="col d-flex flex-column mb-2 mb-md-3">
          <Field
            v-slot="{ field, errors }"
            name="lastName"
            :rules="lastNameRules"
          >
            <input
              v-bind="field"
              id="lastName"
              name="lastName"
              type="text"
              class="form-control register-input"
              :class="{ 'is-invalid': errors[0] }"
              :placeholder="$t('landing.last-name-group.placemarker')"
            >
            <div
              v-if="errors[0]"
              class="invalid-feedback"
            >
              <span class="pull-if-rtl-label">
                {{ $t(errors[0]) }}
              </span>
            </div>
          </Field>
        </div>

        <div class="col d-flex flex-column mb-2 mb-md-3">
          <Field
            v-slot="{ field, errors }"
            name="email"
            :rules="emailRules"
          >
            <input
              v-bind="field"
              id="email"
              name="email"
              type="email"
              class="form-control register-input"
              :class="{ 'is-invalid': errors[0] }"
              :placeholder="$t('landing.email-group.placemarker')"
            >
            <div
              v-if="errors[0]"
              class="invalid-feedback"
            >
              <span class="pull-if-rtl-label">
                {{ $t(errors[0]) }}
              </span>
            </div>
          </Field>
        </div>

        <div class="col d-flex flex-column mb-2 mb-md-3 register-input-item">
          <Field
            v-slot="{ field, errors }"
            name="password"
            :rules="passwordRules"
          >
            <input
              v-bind="field"
              id="password"
              name="password"
              :type="passwordInputType"
              class="form-control register-input"
              :class="{ 'is-invalid': errors[0] }"
              :placeholder="$t('landing.password-group.placemarker')"
            >
            <div
              v-if="errors[0]"
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

        <div
          id="error_div"
          class="row"
          :style="{ marginTop: '0px', marginBottom: '10px' }"
        />

        <div class="row d-flex justify-content-center">
          <BButton
            v-if="!loading"
            class="register-button"
            variant="primary"
            size="lg"
            type="submit"
          >
            {{ $t('landing.sign-up') }}
          </BButton>
          <BButton
            v-else
            class="register-button"
            variant="primary"
            :disabled="!meta.valid"
            size="lg"
            type="button"
          >
            {{ $t('landing.processing') }}
            <Spinner
              class="spinner"
              small
              variant="light"
            />
          </BButton>
        </div>
      </VeeForm>

      <div
        class="row"
        style="text-align: center; margin-top: 15px;"
      >
        <p class="terms-p">
          {{ $t('landing.terms-p') }}
          <br>
          <a href="/terms">{{ $t('landing.terms-conditions') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Field,Form as VeeForm } from 'vee-validate'
import { computed,defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import AppleLoginButton from '@/components/Common/Buttons/AppleLoginButton.vue'
import FacebookLoginButton from '@/components/Common/Buttons/FacebookLoginButton.vue'
import GoogleLoginButton from '@/components/Common/Buttons/GoogleLoginButton.vue'
import { useStringRequiredRule, useValidationRules } from '@/composables'
import { storeKey } from '@/store'
import { Modal, type RestoreAccountProps,useModalStore } from '@/stores/modal'
import { capitalizeFirstLetter } from '@/utils'

export default defineComponent({
  name: 'RegisterSection',
  components: {
    FacebookLoginButton,
    GoogleLoginButton,
    AppleLoginButton,
    Field,
    VeeForm,
  },
  setup() {
    const router = useRouter()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const loading = ref<boolean>(false)
    const passwordInputType = ref<'password' | 'text'>('password')
    const errorMessage = ref<string | null>(null)

    const { emailRules, passwordRules } = useValidationRules()
    const firstNameRules = useStringRequiredRule('first name')
    const lastNameRules = useStringRequiredRule('last name')

    const passwordInputIcon = computed(() => {
      return passwordInputType.value === 'password' ? ['fal', 'eye'] : ['fal', 'eye-slash']
    })

    const submit = async (values: Record<string, string>) => {
      loading.value = true
      errorMessage.value = null

      const response = await store.dispatch('auth/signup', {
        firstName: capitalizeFirstLetter(values.firstName),
        lastName: capitalizeFirstLetter(values.lastName),
        email: values.email,
        password: values.password,
      })
      loading.value = false

      if ('error' in response) {
        errorMessage.value = response.error.message

        if (response.error.errorCode === 'errors.auth.deleted') {
          const props: RestoreAccountProps = { email: values.email }
          showModal({
            modal: Modal.RESTORE_ACCOUNT,
            props,
          })
        }
        return {}
      }

      router.push({
        name: 'Register Complete'
      })

      return {}
    }

    const togglePassword = () => {
      passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password'
    }

    return {
      firstNameRules,
      lastNameRules,
      emailRules,
      errorMessage,
      loading,
      passwordRules,
      passwordInputType,
      passwordInputIcon,
      submit,
      togglePassword
    }
  }
})
</script>

<style lang="scss" scoped>
.register-section {
  background-color: #fff;
  width: 100%;
  border-radius: 10px;
  padding: 5px;
  animation: fadeInRight 1s;

  @media (max-width: $mobileMaxWidth) {
    background-color: transparent;
  }

  .alert {
    margin-left: 15px;
    margin-right: 15px;
  }

  .social-btn {
    width: 100%;

    .btn-login {
      width: 100%;
    }

    &.facebook {
      margin-top: 25px;
    }
    &.apple {
      margin-bottom: 10px;
    }
  }
}

.register-input-item {
  position: relative;
}

.register-input {
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
  right: 1.5rem;
  top: 10px;
  font-size: 14px;

  @media (min-width: $tabletMaxWidth) {
    top: 8px;
  }
  &.is-invalid {
    color: $colorRed;
  }
}

.register-button {
  width: 200px;
  background-color: $colorRed;
  border-color: $colorRed;
  text-transform: uppercase;
  font-family: $headerFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: .5rem;
}

.spinner {
  position: absolute;
  top: 1px;
  right: 7px;
}

.terms-p {
  font-size: 14px;
  color: #000;
  line-height: 1.6;
  font-weight: 400;

  a {
    color: $colorRed;
    text-decoration: none;
  }
}

.invalid-feedback {
  font-size: 12px;
  margin-bottom: 0;
}

.rtl-at-root {
  .register-button {
    .spinner {
      right: unset;
      left: -4px;
    }
  }
}
</style>
