<template>
  <div class="search-box">
    <FaIcon class="search-box__icon" :icon="['fa', 'search']" />
    <input
      ref="searchTermInput"
      v-model="search"
      type="text"
      class="form-control pull-if-rtl-label"
      :placeholder="inputPlaceholder"
      @blur="$emit('blur')"
      @keydown.enter.prevent="$emit('enter')"
    />
    <FaIcon v-if="search" class="search-box__icon search-box__icon--close" :icon="['fa', 'times']" @click="reset" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: null,
    },
  },
  emits: ['blur', 'enter', 'reset', 'input', 'change'],
  setup(props, context) {
    const { t } = useI18n()
    const search = ref<string>('')
    const inputPlaceholder = computed<string>(() => {
      return props.placeholder || t('outer-search.search').toString()
    })
    const reset = () => {
      search.value = ''
      nextTick(() => {
        context.emit('reset')
      })
    }

    watch(search, () => {
      context.emit('input', search.value)
      context.emit('change', search.value)
    })

    return {
      inputPlaceholder,
      search,
      reset,
    }
  },
})
</script>

<style lang="scss" scoped>
.search-box {
  position: relative;
  margin-bottom: 0;
  border: 1px solid rgb(214, 217, 222);
  border-radius: 5px;
}

.form-control {
  padding-left: 2.375rem;
  padding-right: 2rem;
  border: 0;
  transition: all 200ms linear 0s;

  &:focus {
    box-shadow: 0 0 0 0 transparent;
  }
}

.search-box__icon {
  position: absolute;
  text-align: center;
  pointer-events: none;
  color: #aaa;
  top: 50%;
  left: 13px;
  bottom: 50%;
  margin: auto;
}

.search-box__icon--close {
  pointer-events: auto;
  right: 13px;
  left: auto;
  cursor: pointer;
}

.rtl-at-root {
  .form-control {
    padding-left: 2rem;
    padding-right: 2.375rem;
  }

  .search-box__icon {
    left: auto;
    right: 13px;
  }

  .search-box__icon--close {
    right: auto;
    left: 13px;
  }
}
</style>
