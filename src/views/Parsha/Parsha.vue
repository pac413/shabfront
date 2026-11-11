<template>
  <div class="parsha-container">
    <parsha-header @scroll-to="scrollTo('allParshios')" />
    <div class="main-parsha-content">
      <parsha-content
        ref="parshaContentRef"
        class="py-2"
      />
      <parsha-coupon class="my-5" />
      <parsha-search
        ref="allParshiosRef"
        @scroll-to="scrollTo('parshaContent')"
      />
      <parsha-scroller @scroll-to="scrollTo('allParshios')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import ParshaContent from '@/components/Parsha/ParshaContent.vue'
import ParshaCoupon from '@/components/Parsha/ParshaCoupon.vue'
import ParshaHeader from '@/components/Parsha/ParshaHeader.vue'
import ParshaScroller from '@/components/Parsha/ParshaScroller.vue'
import ParshaSearch from '@/components/Parsha/ParshaSearch.vue'
import { useAxios, useToast } from '@/composables'
import { storeKey } from '@/store'
import type { ParshaAudio } from '@/types'

export default defineComponent({
  name: 'Parsha',
  components: {
    ParshaHeader,
    ParshaContent,
    ParshaCoupon,
    ParshaSearch,
    ParshaScroller
  },
  setup() {
    const store = useStore(storeKey)
    const http = useAxios()
    const { showErrorToast } = useToast()
    const parshaContentRef = ref<any>(null)
    const allParshiosRef = ref<any>(null)

    const scrollTo = (ref: 'parshaContent' | 'allParshios') => {
      if (ref === 'parshaContent' && parshaContentRef.value) {
        parshaContentRef.value.$el.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        })
      }
      if (ref === 'allParshios' && allParshiosRef.value) {
        allParshiosRef.value.$el.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        })
      }
    }

    onMounted(async () => {
      if (!import.meta.env.VITE_APP_PARSHA_API) {
        return
      }
      store.commit('parsha/SET_LOADING', true)
      try {
        const { data } = await http.get(import.meta.env.VITE_APP_PARSHA_API)
        const parshaList: ParshaAudio[] = data.Shiurs.map(
          (item: any) => ({
            album: item.Album,
            parsha: item.Comments,
            id: item.Id,
            image: item.Image,
            isThisWeek: item.IsThisWeek,
            title: item.Title,
            url: item.Url,
            bonusUrl: item.BonusUrl
          } as unknown) as ParshaAudio
        )
        store.commit('parsha/SET_PARSHA_LIST', parshaList)
        store.dispatch('parsha/setDefaultParsha')
      } catch (error) {
        console.error(error)
        showErrorToast(error)
      } finally {
        store.commit('parsha/SET_LOADING', false)
      }
    })

    return {
      allParshiosRef,
      parshaContentRef,
      scrollTo,
    }
  }
})
</script>

<style lang="scss" scoped>
.parsha-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-parsha-content {
  max-width: 1000px;
  margin: 0 auto;

  :deep(.parsha-headline) {
    color: #164796;
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin: 1rem auto;
  }
}
</style>
