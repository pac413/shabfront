<template>
  <BModal
    :id="id"
    v-model="isVisible"
    size="lg"
    @show="initForm"
  >
    <div class="mb-3">
      <label
        class="label__required"
        for="reference-name"
      >
        {{ $t('profile-edit.references.name-label') }}
      </label>
      <BFormInput
        id="reference-name"
        v-model="name"
        type="text"
        :placeholder="$t('profile-edit.references.name-placeholder')"
      />
      <div
        v-if="nameErrors.length > 0"
        class="error-details pull-if-rtl-label"
      >
        {{ $t(nameErrors[0]) }}
      </div>
    </div>

    <div class="mb-3">
      <label for="reference-email">
        {{ $t('profile-edit.references.email-label') }}
      </label>
      <BFormInput
        id="reference-email"
        v-model="email"
        type="email"
        :placeholder="$t('profile-edit.references.email-placeholder')"
      />
      <div
        v-if="emailErrors.length > 0"
        class="error-details pull-if-rtl-label"
      >
        {{ $t(emailErrors[0]) }}
      </div>
    </div>

    <div class="mb-3">
      <label for="reference-phone">
        {{ $t('profile-edit.references.phone-label') }}
      </label>
      <VueTelInput
        v-bind="phoneInputProps"
        id="reference-phone"
        v-model="phone"
        class="phone-number"
        default-country="US"
        @validate="handlePhoneValidation"
      >
        <template #arrow-icon="{ open }">
          <FaIcon
            v-if="open"
            :icon="['fa', 'caret-up']"
          />
          <FaIcon
            v-else
            :icon="['fa', 'caret-down']"
          />
        </template>
      </VueTelInput>
      <div
        v-if="reference.phone && !phoneValid"
        class="error-details pull-if-rtl-label"
      >
        {{ $t('profile-edit.contact-info.phone-error') }}
      </div>
    </div>

    <div class="mb-3">
      <label class="label__required">
        {{ $t('profile-edit.references.email-phone-required') }}
      </label>
    </div>

    <div class="mb-3">
      <label for="reference-relationship">
        {{ $t('profile-edit.references.relationship-label') }}
      </label>
      <BFormSelect
        id="reference-relationship"
        v-model="relationship"
        :options="relationshipOptions"
        multiple
        :select-size="5"
      />
      <div
        v-if="relationshipErrors.length > 0"
        class="error-details pull-if-rtl-label"
      >
        {{ $t(relationshipErrors[0]) }}
      </div>
    </div>

    <div class="mb-3">
      <label
        class="label__required"
        for="reference-site-role"
      >
        {{ $t('profile-edit.references.site-role-label') }}
      </label>
      <BFormSelect
        id="reference-site-role"
        v-model="siteRole"
        :options="siteRoleOptions"
      />
      <div
        v-if="siteRoleErrors.length > 0"
        class="error-details pull-if-rtl-label"
      >
        {{ $t(siteRoleErrors[0]) }}
      </div>
    </div>

    <template #title>
      <div class="matchmaking-title">
        <FaIcon
          class="me-2"
          :icon="['fal', 'users']"
        />
        {{ title }}
      </div>
    </template>

    <template #footer>
      <BButton
        variant="secondary"
        @click="cancel"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="!isFormValid"
        @click="save"
      >
        {{ $t('general.save') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import 'vue3-resize/dist/vue3-resize.css'
import 'vue-tel-input/vue-tel-input.css'

import { useField } from 'vee-validate'
import { computed, defineComponent, nextTick, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueTelInput } from 'vue-tel-input'
import { array, string } from 'yup'

import { useRegisterModal, useStringRequiredRule, useValidationRules } from '@/composables'
import { type InputOption, type Reference, Relationship, SiteRole } from '@/types'
import { capitalizeFirstLetter } from '@/utils'

export default defineComponent({
  name: 'ReferenceModal',
  components: {
    VueTelInput,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    reference: {
      type: Object as () => Reference,
      required: true,
    },
  },
  emits: ['save'],
  setup(props, context) {
    const { id: modalId } = toRefs(props)
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)

    const nameRules = useStringRequiredRule('name')
    const phoneRules = useStringRequiredRule('phone')
    const siteRoleRules = useStringRequiredRule('siteRole')
    const { emailRules } = useValidationRules()
    const { errors: nameErrors, value: name, setValue: setName }
      = useField<string>('name', nameRules, {
        initialValue: props.reference.name || '',
        validateOnMount: !!props.reference.id
      })
    const { errors: emailErrors, value: email, setValue: setEmail }
      = useField<string>('email', emailRules, {
        initialValue: props.reference.email || '',
        validateOnMount: !!props.reference.id
      })
    const { value: phone, setValue: setPhone }
      = useField<string>('phone', phoneRules, {
        initialValue: props.reference.phone || '',
        validateOnMount: !!props.reference.id
      })
    const { errors: siteRoleErrors, value: siteRole, setValue: setSiteRole }
      = useField<string>('siteRole', siteRoleRules, {
        initialValue: props.reference.siteRole,
        validateOnMount: !!props.reference.id
      })
    const { errors: relationshipErrors, value: relationship, setValue: setRelationship }
      = useField<Relationship[]>(
        'relationship',
        array().of(string()).required(
          t(
            'validations.messages.required',
            { field: 'relationship' }
          )
        ),
        {
          initialValue: props.reference.relationship || [],
          validateOnMount: !!props.reference.id
        }
      )
    const phoneInputProps: any = {
      inputOptions: {
        placeholder: t('profile-edit.references.phone-placeholder').toString()
      },
      mode: 'international'
    }
    const phoneValid = ref(false)
    const title = computed(() => {
      return (
        props.reference.id
          ? t('profile-edit.references.edit-modal-title').toString()
          : t('profile-edit.references.add-modal-title').toString()
      )
    })

    const relationshipOptions = computed(() => {
      let options: InputOption[] = []
      for (let key in Relationship) {
        options.push({
          value: key, text: capitalizeFirstLetter(Relationship[key as keyof typeof Relationship])
        })
      }
      return options
    })

    const siteRoleOptions = computed(() => {
      let options: InputOption[] = []
      for (let key in SiteRole) {
        options.push({
          value: key, text: capitalizeFirstLetter(SiteRole[key as keyof typeof SiteRole])
        })
      }
      return options
    })

    const handlePhoneValidation = (phoneObject: any) => {
      phoneValid.value = props.reference.phone ? phoneObject.valid : true
    }

    const isFormValid = computed(() => {
      return !nameErrors.value.length &&
        !emailErrors.value.length &&
        !siteRoleErrors.value.length &&
        !relationshipErrors.value.length &&
        phoneValid.value
    })

    const cancel = () => {
      isVisible.value = false
      resetForm()
    }

    const resetForm = () => {
      name.value = ''
      email.value = ''
      phone.value = ''
      siteRole.value = ''
      relationship.value = []
    }

    const initForm = () => {
      setName(props.reference.name || '')
      setEmail(props.reference.email || '')
      setPhone(props.reference.phone || '')
      setSiteRole(props.reference.siteRole || '')
      setRelationship(props.reference.relationship || [])
    }

    const save = () => {
      if (!isFormValid.value) {
        return
      }

      context.emit('save', {
        name: name.value,
        email: email.value,
        phone: phone.value,
        relationship: relationship.value,
        siteRole: siteRole.value,
      })

      // Wait until the models are updated in the UI
      // Afer that, hide Modal
      nextTick(() => {
        isVisible.value = false
        resetForm()
      })
    }

    return {
      cancel,
      email,
      emailErrors,
      handlePhoneValidation,
      initForm,
      isFormValid,
      isVisible,
      name,
      nameErrors,
      phone,
      phoneInputProps,
      phoneValid,
      relationship,
      relationshipErrors,
      relationshipOptions,
      save,
      siteRole,
      siteRoleErrors,
      siteRoleOptions,
      title,
    }
  }
})
</script>

<style lang="scss" scoped>
  .label__required:after{
    content:"*" ;
    color:red
  }
</style>
