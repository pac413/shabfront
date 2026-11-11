<template>
  <div class="contact-page inner-container indent">
    <div class="row justify-content-md-center">
      <div
        v-if="status === 'submitted'"
        class="col py-5 text-center"
      >
        <h2
          class="shabbat-red-text fw-normal mb-5"
          v-html="$t('contact-view.success')"
        />
        <BButton
          variant="primary"
          @click="goBack"
        >
          {{ $t('contact-view.back') }}
        </BButton>
      </div>
      <div
        v-else
        class="col-xl-6 py-5"
      >
        <div class="text-center mb-9">
          <h2 class="shabbat-red-text fw-normal">
            {{ $t('contact-view.title') }}
            <span class="fw-bold">Shabbat.com</span>
          </h2>
          <p v-html="$t('contact-view.greeting')" />
        </div>

        <!-- Contact Us Form novalidate means dont allow bootstrap to validate instead we do in vue using vuelidate -->
        <VeeForm
          id="contact-form"
          @submit="submit"
        >
          <div class="controls">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label
                    for="form_name"
                    class="pull-if-rtl-label"
                  >
                    {{ $t('contact-view.full-name-group.title') }}
                  </label>
                  <span class="text-danger m-l pull-if-rtl-label">*</span>

                  <Field
                    v-slot="{ field, errors }"
                    name="fullName"
                    :rules="fullNameRules"
                  >
                    <input
                      v-bind="field"
                      id="fullName"
                      type="text"
                      name="fullName"
                      class="form-control"
                      :class="{
                        'is-invalid': errors[0]
                      }"
                      :placeholder="$t('contact-view.full-name-group.placemarker')"
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
              </div>
            </div>

            <!-- Email Group -->
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <!-- Your Email -->
                  <label
                    for="form_email"
                    class="pull-if-rtl-label"
                  >{{
                    $t('contact-view.email-group.title')
                  }}</label>
                  <span class="text-danger m-l pull-if-rtl-label">*</span>

                  <Field
                    v-slot="{ field, errors }"
                    name="email"
                    :rules="emailRules"
                  >
                    <input
                      v-bind="field"
                      id="email"
                      type="email"
                      name="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors[0] }"
                      :placeholder="$t('contact-view.email-group.placemarker')"
                    >
                    <!-- Validation for Email -->
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
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label
                    for="form_need"
                    class="pull-if-rtl-label"
                  >{{
                    $t('contact-view.reason-group.title')
                  }}</label>
                  <span class="text-danger m-l pull-if-rtl-label">*</span>

                  <BFormSelect
                    id="reason"
                    v-model="reason"
                    :options="reasonOptions"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label
                    for="form_message"
                    class="pull-if-rtl-label"
                  >{{
                    $t('contact-view.message-group.title')
                  }}</label>

                  <span class="text-danger m-l pull-if-rtl-label">*</span>

                  <Field
                    v-slot="{ value, errors, handleChange }"
                    name="message"
                    :rules="messageRules"
                  >
                    <textarea
                      id="message"
                      name="message"
                      class="form-control"
                      rows="4"
                      required
                      :class="{ 'is-invalid': errors[0] }"
                      :value="value"
                      :placeholder="$t('contact-view.message-group.placemarker')"
                      @change="handleChange"
                    />

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
              </div>

              <!-- Submit -->
              <div class="col-md-12">
                <div class="text-center">
                  <p
                    class="mb-4"
                    v-html="$t('contact-view.footer-line-1')"
                  />

                  <BButton
                    type="submit"
                    variant="primary"
                    class="mb-4"
                    :disabled="status === 'submitting'"
                  >
                    {{
                      status === 'submitting'
                        ? $t('contact-view.submit.submitting-text')
                        : $t('contact-view.submit.button-text')
                    }}
                  </BButton>
                  <p class="small mb-9">
                    {{ $t('contact-view.footer-line-2') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { Field, Form as VeeForm } from 'vee-validate'
import { computed, defineComponent, type Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChallengeV2, useRecaptchaProvider } from 'vue-recaptcha'

import { useAxios, useToast, useValidationRules } from '@/composables'

export default defineComponent({
  name: 'Contact',
  components: {
    Field,
    VeeForm,
  },
  setup() {
    const { rt, t, tm } = useI18n()
    const { showErrorToast } = useToast()
    const http = useAxios()
    const { emailRules, fullNameRules, messageRules } = useValidationRules()
    useRecaptchaProvider()
    const { reset: resetRecaptcha, execute, onError, onExpired, onVerify } = useChallengeV2({
      options: {
        // It's important to pass `size: 'invisible'` to render a invisible reCAPTCHA
        size: 'invisible',
      }
    })
    const reason = ref<string>('')
    const status: Ref<'init' | 'submitting' | 'submitted'> = ref('init')
    const payload = ref<{
      name: string
      email: string
      reason: string
      message: string
    } | null>(null)

    /**
     * Supply array of options for the reason select element (translated if necessary)
     */
    const reasonOptions = computed(() => {
      const optionsArr = tm('contact-view.reason-group.options') as string[]
      const optionsConverted: { text: string, value: string }[] = []

      optionsArr.forEach((value: string) => {
        optionsConverted.push({
          text: rt(value),
          value: rt(value)
        })
      })

      optionsConverted[0].value = ''

      return optionsConverted
    })

    const submit = (values: Record<string, string>) => {
      payload.value = {
        name: values.fullName,
        email: values.email,
        reason: reason.value,
        message: values.message,
      }

      // TODO: Remove this and replace with "execute"
      onRecaptchaVerified()
      // Verify the captcha and post
      execute()
    }

    const onRecaptchaVerified = () => {
      if (!import.meta.env.VITE_APP_CONTACT_API) {
        return
      }

      // quick hack to handle default reason select option
      if (reason.value === '') {
        const messages = tm('contact-view.reason-group') as { options: string[] }
        reason.value = rt(messages.options[0]).toString()
      }

      status.value = 'submitting'
      resetRecaptcha()

      http
        .post(import.meta.env.VITE_APP_CONTACT_API, payload.value)
        .then(() => {
          status.value='submitted'
        })
        .catch(() => {
          showErrorToast(
            t('contact-view.toasts.error-message-sent.message').toString(),
            t('contact-view.toasts.error-message-sent.title').toString(),
          )
          status.value='init'
        })
        .finally(() => {
          reset()
        })
    }

    const reset = () => {
      reason.value = ''
      payload.value = null
    }

    onError((error) => console.error(error))
    onExpired(() => resetRecaptcha())
    onVerify(onRecaptchaVerified)

    const goBack = () => {
      status.value = 'init'
      reset()
    }

    useHead({
      title: 'Contact Shabbat.com',
      meta: [
        {
          vmid: 'fb_title_meta',
          property: 'og:title',
          content: 'Contact Shabbat.com',
        },
        {
          vmid: 'fb_description_meta',
          property: 'og:description',
          content: t('contact-view.greeting').toString()
        }
      ]
    })

    return {
      emailRules,
      fullNameRules,
      messageRules,
      reason,
      reasonOptions,
      status,
      submit,
      goBack,
    }
  }
})
</script>

<style lang="scss" scoped>
.contact-page {
  background-color: white;
  font-size: 1rem;
  line-height: 1.5;
  color: $colorText;
}

.mb-9 {
  margin-bottom: 4rem;
}

.m-l {
  margin-left: 8px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 2rem;
}

.indigo li {
  color: indigo;
}

.float-end {
  float: right;
  padding-left: 3px;
}

.toast-header-right strong {
  float: right;
  text-align: right;
  width: 100%;
}

.hide {
  display: none;
}

.rtl-at-root {
  .m-l {
    margin-left: unset;
    margin-right: 8px;
  }
  .float-end {
    padding-left: unset;
    padding-right: 3px;
  }
}
</style>
