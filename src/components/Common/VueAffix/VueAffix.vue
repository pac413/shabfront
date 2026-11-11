<template>
  <div ref="root" class="vue-affix">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, toRefs } from 'vue'

interface Offset {
  top: number;
  bottom: number;
}

type AffixState = 'affix' | 'scroll-activated' | 'affix-top' | 'affix-bottom'
type ScrollAffixState = 'scrollaffix-scrolling'
  | 'scrollaffix-up'
  | 'scrollaffix-top'
  | 'scrollaffix-bottom'
  | 'scrollaffix-down'

export default defineComponent({
  name: 'VueAffix',
  props: {
    relativeElementSelector: {
      type: String,
      required: true,
    },
    offset: {
      type: Object as () => Offset,
      default() {
        return {
          top: 40,
          bottom: 40,
        }
      },
      validator(offset: Offset) {
        if (typeof offset !== 'object') {
          return false
        }
        const keys = Object.keys(offset)
        return keys.includes('top') && keys.includes('bottom')
      },
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    scrollAffix: {
      type: Boolean,
      default: false,
    },
    scrollContainerSelector: {
      type: String,
      default: null,
    },
  },
  emits: [
    'affix',
    'scroll-activated',
    'affix-top',
    'affix-bottom',
    'scrollaffix-scrolling',
    'scrollaffix-up',
    'scrollaffix-top',
    'scrollaffix-bottom',
    'scrollaffix-down',
  ],
  setup(props, context) {
    const { relativeElementSelector, offset, enabled, scrollAffix, scrollContainerSelector } = toRefs(props)
    const relativeElement = computed<HTMLElement | null>(() =>
      document.querySelector(relativeElementSelector.value)
    )
    const scrollContainer = computed(() => {
      if (scrollContainerSelector.value) {
        return document.querySelector(scrollContainerSelector.value) as HTMLElement | null
      }
      return null
    })
    const root = ref<HTMLElement | null>(null)
    const frameId = ref<number | null>(null)
    const affixHeight = ref<number>(0)
    const affixRect = ref<DOMRect>({
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      toJSON: () => '{}',
    })
    const affixInitialTop = ref<number>(0)
    const relativeElmOffsetTop = ref<number>(0)
    const topPadding = ref<number>(0)
    const lastState = ref<AffixState | null>(null)
    const currentState = ref<AffixState | null>(null)
    const currentScrollAffix = ref<ScrollAffixState | null>(null)
    const lastScrollAffixState = ref<ScrollAffixState | null>(null)
    const topOfScreen = ref<number>(0)
    const lastDistanceFromTop = ref<number>(0)
    const scrollingUp = ref<boolean>(false)
    const scrollingDown = ref<boolean>(false)
    const affixTopPos = computed(() => {
      return affixRect.value.top + topOfScreen.value - offset.value.top - topPadding.value
    })
    const affixBottomPos = computed(() => {
      return affixRect.value.bottom + topOfScreen.value + offset.value.bottom
    })
    const bottomOfScreen = computed(() => {
      return topOfScreen.value + (scrollContainer.value?.clientHeight || window.innerHeight)
    })
    const relativeElmTopPos = computed(() => {
      if (!relativeElement.value) {
        return 0
      }
      return topOfScreen.value + relativeElement.value.getBoundingClientRect().top
    })
    const relativeElmBottomPos = computed(() => {
      if (!relativeElement.value) {
        return 0
      }
      return topOfScreen.value + relativeElement.value.getBoundingClientRect().bottom
    })
    const screenIsPastAffix = computed(() => {
      return bottomOfScreen.value >= affixBottomPos.value
    })
    const screenIsBeforeAffix = computed(() => {
      return topOfScreen.value <= affixTopPos.value
    })
    const screenIsBeforeRelativeElm = computed(() => {
      return topOfScreen.value <= relativeElmTopPos.value - offset.value.top
    })
    const screenIsPastRelativeElm = computed(() => {
      return bottomOfScreen.value >= relativeElmBottomPos.value + offset.value.bottom
    })
    const screenIsInsideRelativeElm = computed(() => {
      return !screenIsBeforeRelativeElm.value && !screenIsPastRelativeElm.value
    })

    const updateData = () => {
      if (!root.value || !relativeElement.value) {
        return
      }
      topOfScreen.value = scrollContainer.value?.scrollTop || window.scrollY
      affixRect.value = root.value.getBoundingClientRect()
      affixHeight.value = root.value.offsetHeight
      relativeElmOffsetTop.value = getOffsetTop(relativeElement.value)
    }

    const handleScroll = () => {
      if (frameId.value) {
        return
      }
      frameId.value = window.requestAnimationFrame(() => {
        onScroll()
        frameId.value = null
      })
    }

    /**
     * Gets the top offset position of an element in the document.
     *
     * @param  {Element} element
     * @return {Number}
     */
    const getOffsetTop = (el: HTMLElement) => {
      let yPosition = 0
      let nextElement: HTMLElement | null = el
      while (nextElement) {
        yPosition += (nextElement.offsetTop)
        nextElement = nextElement.offsetParent as HTMLElement
      }
      return yPosition
    }

    const onScroll = () => {
      if (!enabled.value) {
        removeClasses()
        return
      }

      updateData()

      const affixIsBiggerThanRelativeElement = affixHeight.value + offset.value.top
        >= (relativeElement.value?.offsetHeight || 0)
      if (affixIsBiggerThanRelativeElement) {
        if (scrollAffix.value && currentScrollAffix.value !== 'scrollaffix-top') {
          setScrollAffixTop()
        } else if (currentState.value !== 'affix-top') {
          setAffixTop()
        }
        return
      }
      const affixTotalHeight = affixHeight.value + offset.value.bottom + offset.value.top
      const shouldUseScrollAffix = scrollAffix.value
        && affixTotalHeight > (scrollContainer.value?.clientHeight || window.innerHeight)
      if (shouldUseScrollAffix) {
        handleScrollAffix()
        return
      }
      handleAffix()
    }

    const handleAffix = () => {
      if (topOfScreen.value < relativeElmOffsetTop.value - offset.value.top) {
        setAffixTop()
      }
      if (topOfScreen.value >= relativeElmOffsetTop.value - offset.value.top
        && relativeElmBottomPos.value - offset.value.bottom
        >= topOfScreen.value + topPadding.value + affixHeight.value + offset.value.top) {
        setAffix()
      }
      if (relativeElmBottomPos.value - offset.value.bottom < topOfScreen.value
        + topPadding.value + affixHeight.value + offset.value.top) {
        setAffixBottom()
      }
      lastState.value = currentState.value
    }

    const handleScrollAffix = () => {
      setScrollingDirection()
      if (screenIsBeforeRelativeElm.value) {
        setScrollAffixTop()
      } else if (screenIsPastRelativeElm.value) {
        setScrollAffixBottom()
      } else if (screenIsInsideRelativeElm.value) {
        const shouldSetAffixScrolling = (currentScrollAffix.value === 'scrollaffix-top')
          || (currentScrollAffix.value === 'scrollaffix-bottom')
          || (currentScrollAffix.value === 'scrollaffix-up' && scrollingDown.value)
          || (currentScrollAffix.value === 'scrollaffix-down' && scrollingUp.value)
        if (screenIsBeforeAffix.value && scrollingUp.value) {
          setScrollAffixUp()
        } else if (screenIsPastAffix.value && scrollingDown.value) {
          setScrollAffixDown()
        } else if (shouldSetAffixScrolling) {
          setScrollAffixScrolling()
        }
      }
      lastScrollAffixState.value = currentScrollAffix.value
      lastDistanceFromTop.value = topOfScreen.value
    }

    /**
     * Sets the initial position of the affixed element
     * when scrollAffix is set to true.
     */
    const initScrollAffix = () => {
      if (bottomOfScreen.value < affixBottomPos.value) {
        setScrollAffixTop()
      } else if (screenIsInsideRelativeElm.value) {
        setScrollAffixDown()
      } else if (screenIsPastRelativeElm.value) {
        setScrollAffixBottom()
      } else {
        setScrollAffixScrolling()
      }
    }

    /**
     * Sets te currentScrollAffix to 'scrolling' to indicate that
     * the window is scrolling inside the affixed element.
     */
    const setScrollAffixScrolling = () => {
      if (!root.value) {
        return
      }
      currentScrollAffix.value = 'scrollaffix-scrolling'
      root.value.style.top = `${(Math.floor(affixRect.value.top) + topOfScreen.value) - affixInitialTop.value}px`
      root.value.style.bottom = 'auto'
      removeClasses()
      emitEvent()
    }

    /**
     * Sets the position of the affixed element to be fixed
     * at the top of the screen, as you are scrolling UP.
     */
    const setScrollAffixUp = () => {
      if (!root.value) {
        return
      }
      currentScrollAffix.value = 'scrollaffix-up'
      if (currentScrollAffix.value !== lastScrollAffixState.value) {
        root.value.style.top = `${topPadding.value + offset.value.top}px`
        root.value.style.bottom = 'auto'
        removeClasses()
        emitEvent()
        root.value.classList.add('affix')
      }
    }

    /**
     * Sets the position of the affixed element to be fixed
     * at the bottom of the screen, as you are scrolling DOWN.
     */
    const setScrollAffixDown = () => {
      if (!root.value) {
        return
      }
      currentScrollAffix.value = 'scrollaffix-down'
      if (currentScrollAffix.value !== lastScrollAffixState.value) {
        root.value.style.bottom = `${offset.value.bottom}px`
        root.value.style.top = 'auto'
        removeClasses()
        emitEvent()
        root.value.classList.add('affix')
      }
    }

    /**
     * Sets the position of the affixed element to be at the
     * most top.
     */
    const setScrollAffixTop = () => {
      if (!root.value) {
        return
      }

      currentScrollAffix.value = 'scrollaffix-top'
      root.value.style.top = '0px'
      root.value.style.bottom = 'auto'
      removeClasses()
      emitEvent()
    }

    /**
     * Sets the position of the affixed element to be at the
     * most bottom.
     */
    const setScrollAffixBottom = () => {
      if (!root.value) {
        return
      }

      currentScrollAffix.value = 'scrollaffix-bottom'
      root.value.style.top = `${relativeElmBottomPos.value - affixInitialTop.value - affixHeight.value}px`
      root.value.style.bottom = 'auto'
      removeClasses()
      emitEvent()
    }

    /**
     * Sets the direction the window is being scrolled.
     */
    const setScrollingDirection = () => {
      if (topOfScreen.value > lastDistanceFromTop.value) {
        scrollingDown.value = true
        scrollingUp.value = false
      } else {
        scrollingUp.value = true
        scrollingDown.value = false
      }
    }

    /**
     * Sets the affix-top class to indicate that the element is
     * above the relative element.
     */
    const setAffixTop = () => {
      if (!root.value) {
        return
      }

      currentState.value = 'affix-top'
      if (currentState.value !== lastState.value) {
        emitEvent()
        removeClasses()
        root.value.classList.remove('affix')
        root.value.classList.add('affix-top')
        root.value.style.top = 'unset'
      }
    }

    /**
     * Sets the affix class to indicate that the element is
     * fixed to the top of the relative element.
     */
    const setAffix = () => {
      if (!root.value) {
        return
      }
      currentState.value = 'affix'
      root.value.style.top = `${topPadding.value + offset.value.top}px`
      if (currentState.value !== lastState.value) {
        emitEvent()
        removeClasses()
        root.value.classList.add('affix')
      }
    }

    /**
     * Sets the affix-bottom class to indicate that the element is
     * below the relative element.
     */
    const setAffixBottom = () => {
      if (!root.value || !relativeElement.value) {
        return
      }
      currentState.value = 'affix-bottom'
      root.value.style.top = `${relativeElement.value.offsetHeight - affixHeight.value
        - offset.value.bottom - topPadding.value}px`
      if (currentState.value !== lastState.value) {
        emitEvent()
        removeClasses()
        root.value.classList.add('affix-bottom')
      }
    }

    /**
     * Removes all three affix classes.
     */
    const removeClasses = () => {
      if (!root.value) {
        return
      }
      root.value.classList.remove('affix-top')
      root.value.classList.remove('affix')
      root.value.classList.remove('affix-bottom')
    }

    /**
     * Emits the events based on the current state of the affix.
     */
    const emitEvent = () => {
      if (!currentScrollAffix.value || !currentState.value) {
        return
      }
      if (scrollAffix.value && lastScrollAffixState.value
        && currentScrollAffix.value !== lastScrollAffixState.value) {
        context.emit(currentScrollAffix.value)
      }
      if (lastState.value) {
        context.emit(currentState.value)
      }
    }

    onMounted(() => {
      if (!root.value || !relativeElement.value) {
        return
      }

      root.value.classList.add('vue-affix')
      affixInitialTop.value = getOffsetTop(root.value)
      topPadding.value = affixInitialTop.value - getOffsetTop(relativeElement.value)

      updateData()

      if (scrollAffix.value) {
        const affixTotalHeight = affixHeight.value + offset.value.bottom + offset.value.top
        const shouldUseScrollAffix = scrollAffix.value
          && affixTotalHeight > (scrollContainer.value?.clientHeight || window.innerHeight)
        if (shouldUseScrollAffix) {
          initScrollAffix()
        }
      }

      onScroll()
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      root,
    }
  }
})
</script>

<style lang="scss">
.vue-affix {
  position: relative;
  z-index: 1;
}
.affix {
  position: fixed;
}
.affix-bottom {
  position: relative;
}
</style>
