<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'user']"
          class="me-1"
        />
        {{ $t('profile-edit.about-me.title') }}
      </div>

      <div class="panel-body">
        <debounce-textarea
          id="about-me"
          v-model="aboutMe"
          type="text"
          :timeout="500"
          :placeholder="placeholder"
          rows="4"
          @blur="handleProfileUpdate"
          @debounce="handleProfileUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import DebounceTextarea from '@/components/Common/Inputs/DebounceTextarea.vue'
import type { IProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'AboutMeView',
  components: {
    DebounceTextarea
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
    const aboutMe = ref<string>(props.profile.about || '')
    const placeholder = computed(() => {
      return `${props.profile.firstName}, ${t('profile-view.intro.about-placeholder').toString()}`
    })

    const handleProfileUpdate = async () => {
      const payload = {
        id: props.profile.id,
        about: aboutMe.value
      }
      await store.dispatch('profile/updateProfile', payload)
    }

    return {
      aboutMe,
      handleProfileUpdate,
      placeholder,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
