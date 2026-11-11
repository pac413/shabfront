<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'heart']"
          class="me-1"
        />
        {{ $t('profile-edit.dating-preferences.dating-role') }}
      </div>
      
      <div
        v-if="!birthdayAvailable"
        class="alert alert-warning"
        role="alert"
        v-html="$t('profile-edit.dating-preferences.dating-role-warning', { link: datingWarningLink })"
      />

      <div class="panel-body d-flex align-items-center">
        <label
          for="dating-role"
          class="input-label flex-grow-1"
        >
          {{ $t('profile-edit.dating-preferences.dating-role-label') }}
        </label>
        <BFormCheckbox
          id="dating-role"
          :disabled="!birthdayAvailable"
          :model-value="datingRole"
          name="dating-role-switch"
          switch
          @change="handleDatingRoleChange"
        />
      </div>
    </div>

    <div
      v-if="datingRole"
      class="panel"
    >
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'key']"
          class="me-1"
        />
        {{ $t('profile-edit.dating-preferences.privacy') }}
      </div>

      <div class="panel-body">
        <BFormSelect
          id="privacy-input"
          v-model="datingPrivacy"
          :options="datingPrivacyOptions"
          @change="updateDatingPrivacy"
        />
      </div>
    </div>

    <div v-if="datingRole && !isMobileRoute">
      <RouterLink
        :to="{ name: 'Edit Dating Profile' }"
        class="edit-dating-link"
      >
        {{ $t('profile-view.dating.edit-dating-profile') }}
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import { type IProfile,ISiteRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'DatingPreferenceView',
  props: {
    profile: {
      type: Object as () => IProfile,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const route = useRoute()
    const store = useStore(storeKey)
    const mq = useMq()
    const datingPrivacy = ref<string>('PUBLIC')

    const datingRole = computed(() => {
      return props.profile.siteRoles?.includes(ISiteRole.Dating)
    })
    const isMobileRoute = computed(() => {
      return route.name?.toString().includes('mobile.')
    })

    const birthdayAvailable = computed(() => {
      return !!props.profile.birthday
    })

    const datingWarningLink = computed(() => {
      return mq.mobile ? '/mobile/profile/edit/personal-info' : '/profile/edit/personal-info'
    })

    const datingPrivacyOptions = computed(() => {
      return ([
        { value: 'PRIVATE', text: t('profile-edit.dating-preferences.privacy-private').toString() },
        { value: 'PUBLIC', text: t('profile-edit.dating-preferences.privacy-public').toString() }
      ])
    })

    const handleDatingRoleChange = (value: boolean) => {
      const params = {
        profileId: props.profile.id,
        siteRole: ISiteRole.Dating,
      }
      if (value === false) {
        store.dispatch('profile/deleteSiteRole', params)
      } else {
        store.dispatch('profile/addSiteRole', params)
      }
    }

    const updateDatingPrivacy = (value: string) => {
      const isPrivate = value === 'PRIVATE'
      store.dispatch('profile/updateDatingProfile', {
        isPrivate,
        id: props.profile.datingProfile!.id,
        profileId: props.profile.id
      })
    }

    watch(() => props.profile, () => {
      const { datingProfile } = props.profile
      datingPrivacy.value = (datingProfile && datingProfile.isPrivate) ? 'PRIVATE' : 'PUBLIC'
    }, { immediate: true })

    return {
      birthdayAvailable,
      datingPrivacy,
      datingPrivacyOptions,
      datingRole,
      datingWarningLink,
      handleDatingRoleChange,
      isMobileRoute,
      updateDatingPrivacy,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';

.alert {
  border-radius: 0;
}
</style>
