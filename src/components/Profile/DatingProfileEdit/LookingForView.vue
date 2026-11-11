<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.looking-for.title') }}
      </div>

      <div class="panel-body">
        <!-- looking for -->
        <BFormGroup
          id="looking-for-group"
          class="form-group"
          :label="$t('dating-profile-edit.looking-for.looking-for')"
          label-for="looking-for-textarea"
          label-class="looking-for-label"
        >
          <debounce-textarea
            id="looking-for-textarea"
            v-model="lookingFor"
            type="text"
            :placeholder="placeholder"
            rows="8"
            @blur="handleDatingProfileUpdate('lookingFor')"
            @debounce="handleDatingProfileUpdate('lookingFor')"
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

import DebounceTextarea from '@/components/Common/Inputs/DebounceTextarea.vue'
import { storeKey } from '@/store'
import type { DatingProfile, Profile } from '@/types'

export default defineComponent({
  name: 'LookingForView',
  components: {
    DebounceTextarea
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
    const { t } = useI18n()
    const store = useStore(storeKey)
    const lookingFor = ref<string>('')
    const placeholder = computed(() => {
      return t('dating-profile-edit.looking-for.placeholder').toString()
    })

    const handleDatingProfileUpdate = async (key: string) => {
      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'lookingFor' ? { lookingFor: lookingFor.value } : {})
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        lookingFor.value = props.datingProfile.lookingFor
      }
    })

    return {
      handleDatingProfileUpdate,
      lookingFor,
      placeholder,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
