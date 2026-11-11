<template>
  <div class="admin-data-wrapper">
    <IconItem
      v-b-toggle="'admin-data'"
      :icon="['fal', 'cog']"
      :item-text="$t('profile-view.admin.admin-data')"
    />

    <BCollapse :id="'admin-data'">
      <div
        v-if="profile"
        class="card card-body"
      >
        <div class="card-section-title">
          {{ $t('profile-view.admin.contact-info') }}
        </div>
        {{ profile.displayName }}
        <br>

        <template v-if="profile.location">
          {{ profile.location.address }}
          <br>
          <span>
            {{ profile.location.city }}, {{ profile.location.state }}, {{ profile.location.country }}
          </span>
          <br>
        </template>

        <span class="phone">{{ $t('profile-view.admin.phone') }} {{ profile.phone }}</span>
        <span class="email">{{ $t('profile-view.admin.email') }} {{ profile.email }}</span>

        <div class="pt-4 card-section-title">
          {{ $t('profile-view.admin.account-info') }}
        </div>
        {{ $t('profile-view.admin.roles') }} {{ profile.siteRoles && profile.siteRoles.join(', ') }}
        <span
          class="userId"
        >{{ $t('profile-view.admin.user-id') }} {{ profile.id }}</span>
        <span class="pass">{{ $t('login-view.password') }}: ****</span>
        <br>

        <div class="delete-avatar-btn">
          <BButton
            v-if="profile.avatar"
            variant="primary"
            @click="deleteAvatar"
          >
            {{ $t('profile-view.admin.delete-avatar') }}
          </BButton>
        </div>
        <div class="manage-user-btn">
          <RouterLink :to="'/admin/profile/' + profile.handle">
            <BButton variant="primary">
              {{ $t('profile-view.admin.manage-in-admin') }}
            </BButton>
          </RouterLink>
        </div>
      </div>
      <RestrictionsCard :profile-id="profile.id" />
    </BCollapse>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import RestrictionsCard from '@/components/Profile/RestrictionsCard.vue'
import { useToast } from '@/composables'
import { useAdminDeleteAvatarMutation } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'AdminData',
  components: {
    RestrictionsCard
  },
  setup() {
    const { showErrorToast } = useToast()
    const store = useStore(storeKey)
    const profile = computed((): Profile => store.state.profile.currentProfile!)
    const { mutate, onDone, onError } = useAdminDeleteAvatarMutation(() => ({
      variables: {
        input: { profileId: profile.value.id }
      }
    }))

    onDone((response) => {
      if (response.data?.adminDeleteAvatar.__typename === 'Error') {
        showErrorToast(response.data?.adminDeleteAvatar.message)
      } else if (response.data?.adminDeleteAvatar.__typename === 'Profile') {
        const updatedProfile = response.data?.adminDeleteAvatar
        if (profile.value.id === updatedProfile.id) {
          store.commit('profile/SET_CURRENT_PROFILE_AVATAR', null)
        }
      }
    })
    onError((error) => {
      showErrorToast(error)
    })
    const deleteAvatar = () => mutate()

    return {
      deleteAvatar,
      profile
    }
  }
})
</script>

<style lang="scss" scoped>
.admin-data-wrapper {
  .card {
    margin-bottom: 20px;
    background-color: #eee;
  }

  :deep(.icon-item) {
    cursor: pointer;
    padding-bottom: 15px;
  }

  .card-section-title {
    font-weight: bold;
    padding-bottom: 5px;
  }

  .delete-avatar-btn {
    margin: 10px auto 0;
  }

  .manage-user-btn {
    margin: 10px auto 0;
  }
}
</style>
