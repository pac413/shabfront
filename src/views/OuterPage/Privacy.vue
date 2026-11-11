<template>
  <div class="privacy-page container indent">
    <div class="outer">
      <h1>
        {{ $route.name == 'Privacy' ? $t('privacy-view.title') : $t('privacy-view.terms-title') }}
      </h1>
      <div class="border">
        <div v-if="locale === 'en'" class="overflow">
          <div class="item" v-html="SHABBAT_PRIVACY_RAW_HTML" />
        </div>
        <div v-else>
          <div v-html="$t('privacy-view.message')" />
        </div>
      </div>
      <!--/border-->
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { SHABBAT_PRIVACY_RAW_HTML } from '@/utils'

export default defineComponent({
  name: 'Privacy',
  setup() {
    const { locale } = useI18n()
    useHead({
      title: 'Shabbat.com Terms and Conditions',
      meta: [
        { vmid: 'fb_title_meta', property: 'og:title', content: 'Shabbat.com Terms and Conditions' },
        { vmid: 'fb_description_meta', property: 'og:description', content: 'Terms and Conditions' },
      ],
    })

    return {
      locale,
      SHABBAT_PRIVACY_RAW_HTML,
    }
  },
})
</script>

<style lang="scss" scoped>
.privacy-page {
  margin: 0 auto;
  padding: 3em 0;
}

h1 {
  padding-left: 20px;
}

.item a {
  color: #0094c5;
  text-decoration: underline;
}

.border {
  border: 1px solid #c7c5c5;
  padding: 20px;
}

.outer {
  .item p {
    margin-bottom: 15px;
  }

  .last {
    padding-bottom: 0;
  }
}
</style>
