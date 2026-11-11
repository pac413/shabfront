<template>
  <div class="landing-content">
    <img
      class="landing-image"
      src="@/assets/img/outer/new-outer-main-image-1-2.jpg"
    >

    <logo
      v-if="mq.mobile"
      theme="crimson"
    />

    <div class="landing-main">
      <div class="landing-main__container container">
        <div class="about-section">
          <about-section />
        </div>
        <div class="register-section">
          <register-section />
        </div>
      </div>
    </div>

    <vue-bottom-sheet
      v-if="mq.mobile"
      ref="bottomSheet"
      effect="fx-default"
      max-height="90%"
      :background-scrollable="true"
      :background-clickable="true"
    >
      <div class="p-4">
        <h4 class="mb-4">
          {{ $t("landing.bottom-sheet.title") }}
        </h4>
        <p class="mb-4">
          {{ $t("landing.bottom-sheet.description") }}
        </p>
        <div class="text-center">
          <BButton
            v-if="shabbatMobilAppLink"
            variant="primary"
            :href="shabbatMobilAppLink"
            target="_blank"
          >
            {{ $t("landing.bottom-sheet.button") }}
          </BButton>
        </div>
      </div>
    </vue-bottom-sheet>
  </div>
</template>

<script lang="ts">
import  '@webzlodimir/vue-bottom-sheet/dist/style.css'

import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import { useMq } from 'vue3-mq'

import AboutSection from '@/components/LandingPage/AboutSection.vue'
import RegisterSection from '@/components/LandingPage/RegisterSection.vue'
import Logo from '@/components/Layout/Common/Logo.vue'
import { SHABBAT_MOBILE_APP_LINK } from '@/utils'

export default defineComponent({
  name: 'Landing',
  components: { VueBottomSheet, Logo, AboutSection, RegisterSection },
  setup() {
    const mq = useMq()
    const bottomSheet = ref(null)
    const shabbatMobilAppLink = computed(() => {
      if(navigator.userAgent.toLowerCase().indexOf('android') > - 1) {
        return SHABBAT_MOBILE_APP_LINK.android
      }
      if(navigator.userAgent.toLowerCase().indexOf('iphone') > - 1) {
        return SHABBAT_MOBILE_APP_LINK.ios
      }
      return ''
    })

    onMounted(() => {
      nextTick(() => {
        if (bottomSheet.value) {
          (bottomSheet.value as any).open()
        }
      })
    })

    return {
      bottomSheet,
      mq,
      shabbatMobilAppLink
    }
  }
})
</script>

<style lang="scss" scoped>
.landing-content {
  width: 100%;
}

.landing-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  object-fit: cover;

  @media (max-width: $mobileMaxWidth) {
    display: none;
  }
}

.logo {
  width: 100%;
  text-align: center;
  display: block;
  margin-top: 3rem;
}

.landing-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 1400px;
  width: 100%;
  position: relative;
  margin: auto;
}

.landing-main__container {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 100px;
  color: #333333;

  @media (max-width: $mobileMaxWidth) {
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    max-width: 100%;
  }
}

.about-section {
  flex: 1;

  @media (max-width: $tabletMaxWidth) {
    display: none;
  }
}

.register-section {
  flex: 1;

  @media (min-width: $tabletMaxWidth) {
    width: 400px;
  }
}

.locale-russian {
  .landing-main__container {
    font-family: 'Source Sans Pro';
  }
}

.rtl-at-root {
  .landing-image {
    transform: scaleX(-1);
  }
}
</style>
