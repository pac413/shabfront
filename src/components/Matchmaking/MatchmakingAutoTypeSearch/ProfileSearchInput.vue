<template>
  <div class="form-group auto-type-search-input">
    <FaIcon
      class="auto-type-search-input__search-icon"
      :icon="['fal', 'search']"
    />
    <input
      v-model="keyword"
      class="form-control"
      :class="{ 'form-control--opened': opened }"
      type="text"
      :placeholder="$t('outer-search.search')"
      @mousedown="$emit('open-popup')"
      @focus="$emit('input-focus')"
    >
    <FaIcon
      v-if="keyword"
      class="auto-type-search-input__close-icon"
      :icon="['fa', 'times']"
      @click="onReset"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'MatchmakingAutoTypeProfileSearchInput',
  props: {
    modelValue: {
      required: true,
      type: String
    },
    opened: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  emits: ['open-popup', 'input-focus', 'update:modelValue', 'close-popup'],
  setup(props, { emit }) {
    const keyword = computed({
      get: () => props.modelValue,
      set: (val: string) => emit('update:modelValue', val)
    })
    
    const onReset = () => {
      keyword.value = ''
      emit('close-popup')
    }

    return {
      keyword,
      onReset
    }
  }
})
</script>

<style scoped lang="scss">
.auto-type-search-input {
  position: relative;
  margin-bottom: 0;
}

.form-control {
  padding-left: 2.375rem;
  padding-right: 2rem;
  border: 1px solid #8e8e8e;
  border-radius: 25px;
  transition: all 200ms linear 0s;

  &:focus {
    box-shadow: 0 0 0 0 transparent;
  }
}

.form-control--opened {
  border-radius: 12px 12px 0 0;
  border-bottom: 0;
  border-color: rgb(235, 235, 235);
}

.auto-type-search-input__search-icon {
  position: absolute;
  text-align: center;
  pointer-events: none;
  color: #8e8e8e;
  top: 50%;
  bottom: 50%;
  left: 13px;
  margin: auto;
  pointer-events: auto;
  cursor: pointer;
}

.auto-type-search-input__close-icon {
  position: absolute;
  text-align: center;
  pointer-events: none;
  color: #8e8e8e;
  top: 50%;
  right: 13px;
  bottom: 50%;
  left: auto;
  margin: auto;
  pointer-events: auto;
  cursor: pointer;
}

.rtl-at-root {
  .form-control {
    padding-left: 2rem;
    padding-right: 2.375rem;
  }

  .form-control--opened {
    border-radius: 12px 0 0 12px;
  }

  .auto-type-search-input__search-icon {
    left: unset;
    right: 13px;
  }

  .auto-type-search-input__close-icon {
    right: auto;
    left: 13px;
  }
}
</style>

<style lang="scss">
.pac-container {
  z-index: 100000;
}
</style>
