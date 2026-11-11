<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'user']"
          class="me-1"
        />
        {{ $t('profile-edit.contact-info.full-name') }}
      </div>

      <div class="panel-body">
        <BFormGroup
          id="first-name-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.first-name')"
          label-for="first-name"
          label-class="input-label"
        >
          <DebounceInput
            id="first-name"
            v-model="firstName"
            type="text"
            required
            :placeholder="$t('profile-edit.contact-info.first-name')"
            :timeout="500"
            @blur="handleProfileUpdate('firstName', firstNameErrors)"
            @debounce="handleProfileUpdate('firstName', firstNameErrors)"
          />
          <div
            v-if="firstNameErrors"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(firstNameErrors) }}
          </div>
        </BFormGroup>

        <BFormGroup
          id="last-name-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.last-name')"
          label-for="last-name"
          label-class="input-label"
        >
          <DebounceInput
            id="last-name"
            v-model="lastName"
            type="text"
            required
            :placeholder="$t('profile-edit.contact-info.last-name')"
            :timeout="500"
            @blur="handleProfileUpdate('lastName', lastNameErrors)"
            @debounce="handleProfileUpdate('lastName', lastNameErrors)"
          />
          <div
            v-if="lastNameErrors"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(lastNameErrors) }}
          </div>
        </BFormGroup>
        <div class="mb-1">
          <strong>{{ $t('profile-edit.contact-info.display-name-label') }}</strong> {{ displayName }}
        </div>
        <div class="mb-3">
          {{ $t('profile-edit.contact-info.display-name-description') }}
        </div>

        <BFormGroup
          id="display-name-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.display-name')"
          label-for="display-name"
          label-class="input-label"
        >
          <DebounceInput
            id="display-name"
            v-model="displayName"
            type="text"
            required
            :timeout="500"
            :placeholder="$t('profile-edit.contact-info.display-name')"
            @blur="handleProfileUpdate('displayName')"
            @debounce="handleProfileUpdate('displayName')"
          />
        </BFormGroup>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'phone']"
          class="me-1"
        />
        {{ $t('profile-edit.contact-info.phone-number') }}
      </div>
      <div class="panel-body">
        <BFormGroup
          id="phone-number-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.phone-number')"
          label-for="phone-number"
          label-class="input-label"
        >
          <VueTelInput
            v-bind="phoneInputProps"
            id="phone-number"
            v-model="phone"
            class="phone-number"
            default-country="US"
            @validate="handlePhoneValidation"
            @blur="handleProfileUpdate('phone')"
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
            v-if="phone && !phoneValid"
            class="error-details pull-if-rtl-label"
          >
            {{ $t('profile-edit.contact-info.phone-error') }}
          </div>
        </BFormGroup>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'edit']"
          class="me-1"
        />
        {{ $t('profile-edit.contact-info.title') }}
      </div>
      <div class="panel-body">
        <BFormGroup
          id="title-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.user-title')"
          label-for="title"
          label-class="input-label"
        >
          <BFormSelect
            id="title"
            v-model="title"
            :options="titleOptions"
            @change="handleProfileUpdate('title', titleErrors)"
          />
          <div
            v-if="titleErrors"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(titleErrors) }}
          </div>
        </BFormGroup>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'globe-americas']"
          class="me-1"
        />
        {{ $t('profile-edit.contact-info.location') }}
      </div>
      <div class="panel-body">
        <BFormGroup
          id="address-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.address')"
          label-for="address-input"
          label-class="input-label"
        >
          <DebounceInput
            id="address-input"
            v-model="address"
            type="text"
            required
            :timeout="1000"
            :placeholder="$t('profile-edit.contact-info.address')"
            @blur="handleProfileUpdate('address')"
            @debounce="handleProfileUpdate('address')"
          />
        </BFormGroup>
        <BFormGroup
          id="city-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.city')"
          label-for="city-input"
          label-class="input-label"
        >
          <DebounceInput
            id="city-input"
            v-model="city"
            type="text"
            required
            :timeout="1000"
            :placeholder="$t('profile-edit.contact-info.city')"
            @blur="handleProfileUpdate('city', cityErrors)"
            @debounce="handleProfileUpdate('city', cityErrors)"
          />
          <div
            v-if="cityErrors"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(cityErrors) }}
          </div>
        </BFormGroup>
        <BFormGroup
          v-if="stateOptions && stateOptions.length && isUSorCanada"
          id="state-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.state')"
          label-for="state-input"
          label-class="input-label"
        >
          <BFormSelect
            id="state-input"
            v-model="state"
            :options="stateOptions"
            @change="handleProfileUpdate('state', stateErrors)"
          />
          <div
            v-if="stateErrors"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(stateErrors) }}
          </div>
        </BFormGroup>
        <BFormGroup
          id="zipcode-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.zipcode')"
          label-for="zipcode-input"
          label-class="input-label"
        >
          <DebounceInput
            id="zipcode-input"
            v-model="zipcode"
            type="text"
            required
            :timeout="1000"
            :placeholder="$t('profile-edit.contact-info.zipcode')"
            @blur="handleProfileUpdate('zipcode')"
            @debounce="handleProfileUpdate('zipcode')"
          />
        </BFormGroup>
        <BFormGroup
          id="country-group"
          class="form-group"
          :label="$t('profile-edit.contact-info.country')"
          label-for="country-input"
          label-class="input-label"
        >
          <BFormSelect
            id="country-input"
            v-model="country"
            :options="countryOptions"
            @change="handleProfileUpdate('country')"
          />
          <div
            v-if="countryErrors"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(countryErrors) }}
          </div>
        </BFormGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'vue3-resize/dist/vue3-resize.css'
import 'vue-tel-input/vue-tel-input.css'

import { useField } from 'vee-validate'
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueTelInput } from 'vue-tel-input'
import { useStore } from 'vuex'

import DebounceInput from '@/components/Common/Inputs/DebounceInput.vue'
import { useStringRequiredRule } from '@/composables'
import { type IProfile, ITitle,useCountriesQuery, useStatesQuery } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type InputOption } from '@/types'
import { capitalizeFirstLetter } from '@/utils'

export default defineComponent({
  name: 'ContactInfoView',
  components: {
    DebounceInput,
    VueTelInput,
  },
  props: {
    profile: {
      type: Object as () => IProfile,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { dispatch } = useStore(storeKey)

    const firstNameRules = useStringRequiredRule('first name')
    const lastNameRules = useStringRequiredRule('last name')
    const titleRules = useStringRequiredRule('title')
    const cityRules = useStringRequiredRule('city')
    const countryRules = useStringRequiredRule('country')
    const stateRules = useStringRequiredRule('state')

    const { errorMessage: firstNameErrors, value: firstName }
      = useField<string>('firstName', firstNameRules, { initialValue: props.profile.firstName })
    const { errorMessage: lastNameErrors, value: lastName }
      = useField<string>('lastName', lastNameRules, { initialValue: props.profile.lastName })
    const displayName = ref<string>(props.profile.displayName)
    const phone = ref<string | undefined>(props.profile.phone || undefined)
    const { errorMessage: titleErrors, value: title }
      = useField<ITitle | null>('title', titleRules, { initialValue: props.profile.title })
    const address = ref<string | undefined>(props.profile.primaryLocation?.address || undefined)
    const { errorMessage: cityErrors, value: city }
      = useField<string>('city', cityRules, { initialValue: props.profile.primaryLocation?.city })
    const { errorMessage: countryErrors, value: country }
      = useField<string>('country', countryRules, { initialValue: props.profile.primaryLocation?.country })
    const { errorMessage: stateErrors, value: state }
      = useField<string | null>('state', stateRules, { initialValue: props.profile.primaryLocation?.state })
    const zipcode = ref<string | undefined>(props.profile.primaryLocation?.zipcode || undefined)
    const phoneValid = ref<boolean>(false)

    const phoneInputProps = computed<any>(() => ({
      inputOptions: {
        placeholder: t('profile-edit.contact-info.phone-number').toString()
      },
      mode: 'international'
    }))
    const titleOptions = computed<InputOption[]>(() => {
      const options: InputOption[] = [
        { value: null, text: 'Title:' }
      ]
      for (const item in ITitle) {
        options.push({
          value: item.toUpperCase(),
          text: t(`profile-edit.contact-info.title-${item.toLowerCase()}`).toString()
        })
      }
      return options
    })
    const isUSorCanada = computed<boolean>(() => ['231', '38'].includes(country.value || ''))

    const { result: countriesResult } = useCountriesQuery()
    const countryOptions = computed<InputOption[]>(() => {
      const countries = countriesResult.value?.countries?.countries || []
      return [
        { value: null, text: t('profile-edit.contact-info.select-country').toString() },
        ...countries.map((item => ({
          value: item.id,
          text: item.name
        })))
      ]
    })
    
    const stateVariables = computed<{ countryId: string }>(() => {
      const countryIndex = countryOptions.value.findIndex(item => item.value === country.value)
      let countryId = '231'
      if (countryIndex > -1) {
        const val = countryOptions.value[countryIndex].value
        if (typeof val === 'string') {
          countryId = val
        }
      }
      return { countryId }
    })
    const { result: statesResult } = useStatesQuery(stateVariables)
    const stateOptions = computed<InputOption[]>(() => {
      const states = statesResult.value?.states?.states || []
      return states.map((item => ({
        value: item.name,
        text: item.name
      })))
    })
    
    watch(stateOptions, value => {
      if (value.length === 0) {
        state.value = null
        return
      }
      const stateIndex = value.findIndex(item => item.text === props.profile.primaryLocation?.state)
      if (stateIndex > -1) {
        state.value = value[stateIndex].value as string
      } else {
        state.value = value[0].value as string
      }
    }, { immediate: true })

    watch(countryOptions, value => {
      if (value.length === 0) {
        return
      }
      const stateIndex = value.findIndex(item => item.text === props.profile.primaryLocation?.country)
      if (stateIndex > -1) {
        country.value = value[stateIndex].value as string
      } else {
        country.value = value[0].value as string
      }
    }, { immediate: true })

    const handlePhoneValidation = (phoneObject: any): void => {
      phoneValid.value = phoneObject.valid
    }

    const handleProfileUpdate = (fieldName: string, errors?: any): void => {
      switch (fieldName) {
      case 'title':
        if (!title.value) {return}
        break
      case 'state':
        if (!state.value) {return}
        break
      case 'country':
        if (!country.value) {return}
        break
      case 'phone':
        if (phone.value && !phoneValid.value) {return}
        break
      default:
        if (errors) {
          return
        }
        break
      }

      const payload: any = { id: props.profile.id }

      switch (fieldName) {
      case 'firstName':
        firstName.value = capitalizeFirstLetter(firstName.value)
        payload.firstName = firstName.value
        break
      case 'lastName':
        lastName.value = capitalizeFirstLetter(lastName.value)
        payload.lastName = lastName.value
        break
      case 'displayName':
        if (!displayName.value) {
          displayName.value = `${props.profile.firstName} ${props.profile.lastName}`
        }
        payload.displayName = displayName.value
        break
      case 'phone':
        payload.phone = phone.value || undefined
        break
      case 'title':
        payload.title = title.value || undefined
        break
      case 'address': {
        if (address.value === props.profile.primaryLocation?.address) {
          return
        }
        payload.primaryLocation = { address: address.value }
        break
      }
      case 'city': {
        if (city.value === props.profile.primaryLocation?.city) {
          return
        }
        payload.primaryLocation = { city: city.value || '' }
        break
      }
      case 'state': {
        const index = stateOptions.value.findIndex(option => option.value === state.value)
        if (index > -1) {
          payload.primaryLocation = {
            state: stateOptions.value[index].text
          }
        }
        break
      }
      case 'zipcode': {
        if (zipcode.value === props.profile.primaryLocation?.zipcode) {
          return
        }
        payload.primaryLocation = { zipcode: zipcode.value }
        break
      }
      case 'country': {
        const index = countryOptions.value.findIndex(option => option.value === country.value)
        if (index > -1) {
          payload.primaryLocation = {
            country: countryOptions.value[index].text,
            ...(!isUSorCanada.value && { state: '' })
          }
        }
        break
      }
      default:
        console.error('Invalid field', fieldName)
        return
      }
      dispatch('profile/updateProfile', payload)
    }

    return {
      firstName,
      firstNameErrors,
      lastName,
      lastNameErrors,
      displayName,
      phone,
      title,
      titleErrors,
      address,
      city,
      cityErrors,
      state,
      stateErrors,
      zipcode,
      country,
      countryErrors,
      phoneValid,
      phoneInputProps,
      titleOptions,
      isUSorCanada,
      countryOptions,
      stateOptions,
      handlePhoneValidation,
      handleProfileUpdate
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
