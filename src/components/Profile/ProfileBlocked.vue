<template>
  <div class="wrapper">
    <div class="subheading mb-4">
      {{ $t('profile-view.general.profile-blocked') }}
    </div>
    <div class="mb-4">
      {{ `${$t('profile-view.general.redirect-home')} ${redirectIn} ${$t('profile-view.general.sec')}` }}
    </div>
    <BButton pill variant="primary" class="px-4" @click="goBack">
      {{ $t('profile-view.general.go-back') }}
    </BButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ProfileBlocked',
  setup() {
    const router = useRouter()
    const intervalHandle = ref<number>(0)
    const redirectIn = ref<number>(15)

    const goBack = () => {
      if (intervalHandle.value) {
        window.clearInterval(intervalHandle.value)
      }
      router.replace('/feed')
    }

    onMounted(() => {
      intervalHandle.value = window.setInterval(() => {
        // clear interval, redirect to home
        if (redirectIn.value === 1) {
          goBack()
          return
        }
        redirectIn.value -= 1
      }, 1000)
    })

    return {
      goBack,
      intervalHandle,
      redirectIn,
    }
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.subheading {
  font-weight: 400;
  font-size: 1.25rem;
  color: $colorText;
}
</style>
