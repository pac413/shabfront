<template>
  <div class="about-section">
    <h2 class="main-sentence pull-if-rtl-label">
      {{ $t('landing.main-sentence') }}
    </h2>

    <div class="highlights-points">
      <div class="highlights-point">
        <FaIcon :icon="['fal', 'glass-martini']" class="highlights-icon" />
        <h4 v-html="$t('landing.highlight-1')" />
      </div>
      <div class="highlights-point">
        <FaIcon :icon="['fal', 'heart']" class="highlights-icon" />
        <h4 v-html="$t('landing.highlight-2')" />
      </div>
      <div class="highlights-point">
        <FaIcon :icon="['fal', 'briefcase']" class="highlights-icon" />
        <h4 v-html="$t('landing.highlight-3')" />
      </div>
      <div class="highlights-point">
        <FaIcon :icon="['fal', 'thumbs-up']" class="highlights-icon" />
        <h4 v-html="$t('landing.highlight-4')" />
      </div>
    </div>

    <!-- Statistics line -->
    <h4 v-if="totalCities && locale === 'en'" class="statistics pull-if-rtl-label">
      Meet people in
      <b>{{ totalCities }}</b> cities and <b>{{ totalCountries }}</b> countries
    </h4>

    <!-- Link to mobile apps -->
    <div class="app-buttons-section">
      <app-store-button />
      <google-store-button />
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AppStoreButton from '@/components/Common/Buttons/AppStoreButton.vue'
import GoogleStoreButton from '@/components/Common/Buttons/GoogleStoreButton.vue'

export default defineComponent({
  name: 'AboutSection',
  components: { AppStoreButton, GoogleStoreButton },
  setup() {
    const { locale } = useI18n()
    const totalCities = ref<string>('')
    const totalCountries = ref<string>('')

    axios
      .get('/stats/shabbat-new-landing')
      .then((response) => {
        totalCities.value = response.data.TotalCities
        totalCountries.value = response.data.TotalCountries
      })
      .catch((error) => console.error(error))

    return {
      locale,
      totalCities,
      totalCountries,
    }
  },
})
</script>

<style lang="scss" scoped>
.about-section {
  display: flex;
  flex-direction: column;
}

.main-sentence {
  font-size: 38px;
  font-weight: 900;
  line-height: 1.1;
  max-width: 505px;
  animation: fadeInLeft 1s;
  font-family: 'Varela Round', Arial, sans-serif;
}

.highlights-points {
  padding-top: 20px;
  padding-bottom: 10px;
  animation: fadeInLeft 1s;

  .highlights-point {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 0;
    font-size: 24px;

    h4 {
      font-weight: 500;
      line-height: 1.1;
      margin: 0 20px;
    }

    .highlights-icon {
      color: $colorRed;
    }
  }
}

.statistics {
  font-size: 18px;
  animation: fadeIn 1s;
}

.app-buttons-section {
  padding-top: 1px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: row;
}
</style>
