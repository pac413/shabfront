<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.matchmaker.title') }}
      </div>

      <div class="panel-body">
        <!-- I Handle my Dating Inquiries -->
        <div class="panel-item">
          <label
            for="handle-my-dating-inquiries"
            class="input-label"
          >
            {{ $t('dating-profile-edit.matchmaker.handle-my-dating-inquiries') }}
          </label>
          <BFormCheckbox
            id="handle-my-dating-inquiries"
            v-model="haveShadchan"
            name="handle-my-dating-inquiries-button"
            switch
            :value="false"
            :unchecked-value="true"
            @change="handleDatingProfileUpdate('haveShadchan')"
          />
        </div>

        <!-- matchmaker full name -->
        <BFormGroup
          id="matchmaker-full-name-group"
          class="form-group"
          :label="$t('dating-profile-edit.matchmaker.matchmaker-full-name')"
          label-for="matchmaker-full-name-input"
          label-class="input-label"
        >
          <DebounceInput
            id="matchmaker-full-name"
            v-model="shadchanName"
            type="text"
            :disabled="!haveShadchan"
            :timeout="500"
            @blur="handleDatingProfileUpdate('shadchanName')"
            @debounce="handleDatingProfileUpdate('shadchanName')"
          />
        </BFormGroup>

        <!-- matchmaker email -->
        <BFormGroup
          id="matchmaker-email-group"
          class="form-group"
          :label="$t('dating-profile-edit.matchmaker.matchmaker-email')"
          label-for="matchmaker-email-input"
          label-class="input-label"
        >
          <DebounceInput
            id="matchmaker-email-input"
            v-model="shadchanEmail"
            type="email"
            :timeout="500"
            :disabled="!haveShadchan"
            @blur="handleDatingProfileUpdate('shadchanEmail')"
            @debounce="handleDatingProfileUpdate('shadchanEmail')"
          />
          <div v-if="errors.length > 0" class="error-details pull-if-rtl-label">
            {{ $t(errors[0]) }}
          </div>
        </BFormGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import DebounceInput from '@/components/Common/Inputs/DebounceInput.vue'
import { useValidationRules } from '@/composables'
import { storeKey } from '@/store'
import type { DatingProfile, Profile } from '@/types'

export default defineComponent({
  name: 'MatchmakerView',
  components: {
    DebounceInput
  },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
    datingProfile: {
      type: Object as () => DatingProfile,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const haveShadchan = ref<boolean>(false)
    const shadchanName = ref<string>('')

    const { emailRules } = useValidationRules()
    const {
      errors,
      value: shadchanEmail,
    } = useField<string>('shadchanEmail', emailRules)

    const handleDatingProfileUpdate = async (key: string) => {
      if (errors.value.length > 0) {
        return
      }

      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'haveShadchan' ? { haveShadchan: haveShadchan.value } : {}),
        ...(key === 'shadchanName' ? { shadchanName: shadchanName.value } : {}),
        ...(key === 'shadchanEmail' ? { shadchanEmail: shadchanEmail.value } : {}),
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        haveShadchan.value = props.datingProfile.haveShadchan
        shadchanName.value = props.datingProfile.shadchanName
        shadchanEmail.value = props.datingProfile.shadchanEmail
      }
    })

    return {
      errors,
      handleDatingProfileUpdate,
      haveShadchan,
      shadchanName,
      shadchanEmail,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
