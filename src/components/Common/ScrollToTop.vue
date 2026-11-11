<template>
  <transition name="scroll-to-top">
    <div v-if="show" class="scroll-to-top" :class="position" @click.prevent="onClick">
      <div id="scroll-to-top__button" class="scroll-to-top__button">
        <FaIcon :icon="['fas', 'arrow-up']" />
      </div>
      <BTooltip variant="danger" target="scroll-to-top__button" triggers="hover">
        {{ $t('general.scroll-to-top-tooltip') }}
      </BTooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { throttle } from 'lodash'
import SweetScroll from 'sweet-scroll'
import { defineComponent, onBeforeUnmount, ref } from 'vue'

const SCROLL_DURATION = 100
const SCROLL_BOUNDARY = 200
const THROTTLE_DELAY = 200

/**
 * Component that scrolls the window to the top.
 *
 * This components show the Up Arrow when pageYOffset is greater than SCROLL_BOUNDARY pixels
 * If you click on it, the window will be scrolled to the top and the button will disappear slightly.
 */
export default defineComponent({
  name: 'ScrollToTop',
  props: {
    position: {
      type: String,
      default: 'right',
    },
  },
  setup() {
    const show = ref<boolean>(false)
    const scroller = ref<SweetScroll>(new SweetScroll({ duration: SCROLL_DURATION, easing: 'linear' }))
    const handleScroll = () => {
      show.value = window.pageYOffset > SCROLL_BOUNDARY
    }
    const throttleScroll = throttle(handleScroll, THROTTLE_DELAY)
    const onClick = () => {
      scroller.value.to(0)
    }

    window.addEventListener('scroll', throttleScroll)
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', throttleScroll)
    })

    return {
      onClick,
      scroller,
      show,
    }
  },
})
</script>

<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  right: 50px;
  bottom: 50px;
  overflow: hidden;
  cursor: pointer;

  &.right {
    right: calc((100% - 1040px) / 2 - 100px);
    @media (max-width: 1300px) {
      right: 50px;
    }
  }

  &.left {
    left: calc((100% - 1040px) / 2 - 100px);
    @media (max-width: 1300px) {
      left: 50px;
    }
  }
}

.scroll-to-top__button {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  background-color: $colorRed;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.scroll-to-top-enter-from,
.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.rtl-at-root {
  .scroll-to-top {
    right: auto;
    left: 50px;

    &.right {
      left: calc((100% - 1040px) / 2 - 100px);
      right: auto;
      @media (max-width: 1300px) {
        left: 50px;
        right: auto;
      }
    }
  }
}
</style>
