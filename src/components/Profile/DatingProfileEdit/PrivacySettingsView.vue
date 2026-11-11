<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.privacy-settings.title') }}
      </div>

      <div class="panel-body">
        <!-- dating profile visibility -->
        <BFormGroup
          id="dating-profile-visibility-group"
          class="form-group"
          :label="$t('dating-profile-edit.privacy-settings.dating-profile-visibility')"
          label-for="dating-profile-visibility-input"
          label-class="input-label"
        >
          <BFormSelect
            id="dating-profile-visibility-input"
            v-model="isPrivate"
            :options="visibilityOptions"
            @change="handleDatingProfileUpdate('isPrivate')"
          />
        </BFormGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import type { DatingProfile, InputOption, Profile } from '@/types'

export default defineComponent({
  name: 'PrivacySettingsView',
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
    const { t } = useI18n()
    const store = useStore(storeKey)
    const isPrivate = ref<boolean>(false)
    const visibilityOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: false, text: t('dating-profile-edit.privacy-settings.to-everyone').toString() },
        { value: true, text: t('dating-profile-edit.privacy-settings.available-upon-request').toString() }
      ]
      return options
    })

    const handleDatingProfileUpdate = async (key: string) => {
      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'isPrivate' ? { isPrivate: isPrivate.value } : {})
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        isPrivate.value = props.datingProfile.isPrivate
      }
    })

    return {
      handleDatingProfileUpdate,
      isPrivate,
      visibilityOptions,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
