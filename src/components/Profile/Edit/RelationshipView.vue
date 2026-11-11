<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('profile-edit.relationship.relationship-status') }}
      </div>
      <div class="panel-body">
        <BFormGroup
          id="marital-status-group"
          class="form-group"
          :label="$t('profile-edit.relationship.marital-status-title')"
          label-for="marital-status-input"
          label-class="input-label"
        >
          <BFormSelect
            id="marital-status-input"
            :model-value="maritalStatus"
            :options="maritalStatusOptions"
            :class="{ 'is-invalid': maritalStatusErrors.length > 0 }"
            @change="handleMaritalStatusChange"
          />
          <div
            v-if="maritalStatusErrors.length > 0"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(maritalStatusErrors[0]) }}
          </div>
        </BFormGroup>
        <BFormGroup
          v-if="showSpouseFirstName"
          id="spouse-first-name-group"
          class="form-group"
          :label="$t('profile-edit.relationship.spouse-first-name')"
          label-for="spouse-first-name-input"
          label-class="input-label"
        >
          <DebounceInput
            id="spouse-first-name-input"
            v-model="spouseFirstName"
            type="text"
            :placeholder="$t('profile-edit.relationship.spouse-first-name')"
            @debounce="handleProfileUpdate('organization')"
            @blur="handleProfileUpdate('spouseFirstName')"
          />
        </BFormGroup>
        <BFormGroup
          v-if="showChildrenAtHome"
          id="children-at-home-group"
          class="form-group"
          :label="$t('profile-edit.relationship.children-at-home')"
          label-for="children-at-home-input"
          label-class="input-label"
        >
          <DebounceInput
            id="children-at-home-input"
            v-model.number="childrenAtHome"
            number
            type="number"
            :min="0"
            :placeholder="$t('profile-edit.relationship.children-at-home')"
            :class="{ 'is-invalid': childrenErrors.length > 0 }"
            @debounce="handleProfileUpdate('childrenAtHome', childrenErrors)"
            @blur="handleProfileUpdate('childrenAtHome', childrenErrors)"
          />
        </BFormGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import DebounceInput from '@/components/Common/Inputs/DebounceInput.vue'
import { useNumberRequiredRule, useStringRequiredRule } from '@/composables'
import type { IProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { InputOption } from '@/types'

export default defineComponent({
  name: 'RelationshipView',
  components: {
    DebounceInput
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
    const maritalStatusRules = useStringRequiredRule('martial status')
    const childrenAtHomeRules = useNumberRequiredRule('children at home')

    let initialMaritalStatus = ''
    initialMaritalStatus += props.profile.isMarried ? 'marital-status-married-' : 'marital-status-single-'
    initialMaritalStatus += props.profile.children ? 'with-children' : 'without-children'
    const { errors: maritalStatusErrors, value: maritalStatus }
      = useField<string | null>('maritalStatus', maritalStatusRules, {
        initialValue: initialMaritalStatus,
      })

    const spouseFirstName = ref<string | undefined>(undefined)
    const { errors: childrenErrors, value: childrenAtHome }
      = useField<number>('childrenAtHome', childrenAtHomeRules, {
        initialValue: props.profile.children || 0,
      })
    const maritalStatusOptions = computed((): InputOption[] => {
      return ([
        {
          value: null,
          text: t('profile-edit.relationship.marital-status-null').toString()
        },
        {
          value: 'marital-status-single-without-children',
          text: t('profile-edit.relationship.marital-status-single-without-children').toString()
        },
        {
          value: 'marital-status-single-with-children',
          text: t('profile-edit.relationship.marital-status-single-with-children').toString()
        },
        {
          value: 'marital-status-married-without-children',
          text: t('profile-edit.relationship.marital-status-married-without-children').toString()
        },
        {
          value: 'marital-status-married-with-children',
          text: t('profile-edit.relationship.marital-status-married-with-children').toString()
        },
      ])
    })

    const showSpouseFirstName = computed((): boolean => {
      return [
        'marital-status-married-without-children',
        'marital-status-married-with-children'
      ].includes(maritalStatus.value || '')
    })

    const showChildrenAtHome = computed((): boolean => {
      return [
        'marital-status-single-with-children',
        'marital-status-married-with-children'
      ].includes(maritalStatus.value || '')
    })

    const handleProfileUpdate = async (fieldName: string, errors: string[] = []) => {
      if (errors && errors.length) {
        return
      }

      const payload: any = {
        id: props.profile.id
      }

      switch (fieldName) {
      case 'maritalStatus':
        payload.isMarried = maritalStatus.value ? maritalStatus.value.includes('married') : false
        payload.spouse = spouseFirstName.value
        payload.children = childrenAtHome.value
        break

      case 'spouseFirstName':
        payload.spouse = spouseFirstName.value
        break

      case 'childrenAtHome':
        payload.children = childrenAtHome.value
        break

      default:
        return
      }
      await store.dispatch('profile/updateProfile', payload)
    }

    const handleMaritalStatusChange = (newMartialStatus: unknown) => {
      if (typeof newMartialStatus === 'string') {
        if (
          maritalStatus.value &&
          maritalStatus.value.includes('with') &&
          newMartialStatus.includes('without')
        ) {
          childrenAtHome.value = 0
        }
        if (
          maritalStatus.value &&
          maritalStatus.value.includes('married') &&
          newMartialStatus.includes('single')
        ) {
          spouseFirstName.value = ''
        }
      }

      maritalStatus.value = newMartialStatus as string | null
      handleProfileUpdate('maritalStatus')
    }

    onMounted(() => {
      spouseFirstName.value = props.profile.spouse || undefined
    })

    return {
      childrenAtHome,
      childrenErrors,
      handleMaritalStatusChange,
      handleProfileUpdate,
      maritalStatus,
      maritalStatusErrors,
      maritalStatusOptions,
      showChildrenAtHome,
      showSpouseFirstName,
      spouseFirstName,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
