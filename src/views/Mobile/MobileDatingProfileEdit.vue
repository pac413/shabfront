<template>
  <ProfileCard v-if="datingProfile" :icon="[]" title="" class="edit-dating-ProfileCard__container">
    <div class="row">
      <div class="col-xs-12 col-md-9 col-lg-9">
        <RouterView
          v-slot="{ Component }" 
          :profile="activeProfile"
          :dating-profile="datingProfile" 
        >
          <transition name="slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </div>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useStore } from 'vuex'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'MobileDatingProfileEdit',
  components: {
    ProfileCard,
    RouterView,
  },
  setup() {
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const datingProfile = computed(() => activeProfile.value?.datingProfile)

    return {
      activeProfile,
      datingProfile,
    }
  },
})
</script>

<style lang="scss" scoped>
.edit-dating-ProfileCard__container {
  flex: 1;
  overflow: auto;
  margin-bottom: 0px !important;
  border-radius: 0px;
  border: none;
}
</style>
