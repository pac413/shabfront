<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.personal-description.title') }}
      </div>

      <div class="panel-body">
        <!-- about me -->
        <BFormGroup
          id="about-me-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-description.about-me')"
          label-for="about-me-textarea"
          label-class="about-me-label"
        >
          <debounce-textarea
            id="about-me"
            v-model="aboutMe"
            type="text"
            :placeholder="placeholder"
            rows="8"
            @blur="handleDatingProfileUpdate('aboutMe')"
            @debounce="handleDatingProfileUpdate('aboutMe')"
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
  name: 'PersonalDescriptionView',
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
    const aboutMe = ref<string>('')
    const placeholder = computed(() => {
      return t('dating-profile-edit.personal-description.placeholder').toString()
    })

    const handleDatingProfileUpdate = async (key: string) => {
      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'aboutMe' ? { aboutMe: aboutMe.value } : {})
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        aboutMe.value = props.datingProfile.aboutMe
      }
    })

    return {
      aboutMe,
      handleDatingProfileUpdate,
      placeholder,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
