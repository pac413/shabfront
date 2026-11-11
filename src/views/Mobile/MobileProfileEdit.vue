<template>
  <ProfileCard v-if="activeProfile" :icon="[]" title="" class="edit-ProfileCard__container">
    <div class="row">
      <div class="col-xs-12 col-md-9 col-lg-9">
        <RouterView v-slot="{ Component, route }" :profile="activeProfile">
          <transition name="slide" mode="out-in">
            <component :is="Component" :route="route" />
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
  name: 'MobileProfileEdit',
  components: {
    ProfileCard,
    RouterView,
  },
  setup() {
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)

    return {
      activeProfile,
    }
  },
})
</script>

<style lang="scss" scoped>
.edit-ProfileCard__container {
  flex: 1;
  overflow: auto;
  margin-bottom: 0px !important;
  border-radius: 0px;
  border: none;
}
</style>
