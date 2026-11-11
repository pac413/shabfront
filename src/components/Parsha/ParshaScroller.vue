<template>
  <transition name="scroll-to-top">
    <div
      v-if="show"
      class="scroll-to-top"
      @click.prevent="onClick"
    >
      <div class="scroll-to-top__button">
        <span v-if="parsha">
          {{ $t('parsha.this-weeks-parsha', {parsha: parsha} ) }}
        </span><br>
        {{ $t('parsha.scroll-to-bottom') }}
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { throttle } from 'lodash'
import { computed, defineComponent, onBeforeUnmount,onMounted, type Ref, ref } from 'vue'

import shabbatYomTovDates from '@/assets/js/dates'
import { upcomingShabbatOrYomTov } from '@/utils'

const SCROLL_BOUNDARY = 400
const THROTTLE_DELAY = 200

export default defineComponent({
  name: 'ParshaScroller',
  emits: ['scroll-to'],
  setup(_, { emit }) {
    const show: Ref<boolean> = ref(true)
    
    const handleScroll = () => {
      show.value = window.pageYOffset < SCROLL_BOUNDARY
    }
    const throttleScroll = throttle(handleScroll, THROTTLE_DELAY)

    const parsha = computed(() => {
      const upcomingShabbatOrYomTovDate = upcomingShabbatOrYomTov()
      const week = shabbatYomTovDates.find(item => item.date === upcomingShabbatOrYomTovDate)
      return week && week.parsha && week.parsha.en
    })

    onMounted(() => window.addEventListener('scroll', throttleScroll))

    onBeforeUnmount(() => window.removeEventListener('scroll', throttleScroll))

    const onClick = () => {
      emit('scroll-to')
    }

    return {
      show,
      parsha,
      onClick
    }
  }
})
</script>

<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  right: 50px;
  bottom: 50px;
  cursor: pointer;
  z-index: 12; //above overlay
}

.scroll-to-top__button {
  width: 300px;
  padding: 30px;
  background: url('../../assets/img/parsha/header-bg.png') top right, #fe9c5b;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  text-shadow: #ff8427 1px 1px 12px;
  font-size: 1rem;
  border-radius: 12px;
  color: #fff;
  z-index: 12;
  position: relative;

    &:after {
    content: '';
    position: absolute;
    left: 18px;
    bottom: -15px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #fe9c5b;
  }
}

.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition: opacity .3s, transform .3s;
}

.scroll-to-top-enter-from,
.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.rtl-at-root {
  .scroll-to-top {
    right: unset;
    left: 50px;
  }
}
</style>
