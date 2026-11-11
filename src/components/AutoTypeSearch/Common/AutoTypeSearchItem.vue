<template>
  <li
    class="result-item"
    :class="{ 'result-item--active': active }"
  >
    <RouterLink
      class="result-item-link"
      :to="!typeaheadMode ? url : ''"
      @click="onClicked"
    >
      <span class="result-item-avatar">
        <slot name="avatar" />
      </span>
      <span class="result-item-title">
        <text-highlighter
          :text="title"
          :term="keyword"
        />
      </span>
    </RouterLink>
  </li>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount,onMounted } from 'vue'
import { useRouter } from 'vue-router'

import TextHighlighter from '@/components/Common/TextHighlighter.vue'

export default defineComponent({
  name: 'AutoTypeSearchItem',
  components: { TextHighlighter },
  props: {
    url: {
      required: true, type: String
    },
    title: {
      required: true, type: String
    },
    keyword: {
      required: true, type: String 
    },
    typeaheadMode: {
      required: false, type: Boolean, default: false
    },
    active: {
      required: false, type: Boolean, default: false
    }
  },
  emits: ['close-popup', 'selected'],
  setup(props, { emit }) {
    const router = useRouter()

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown)
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !props.typeaheadMode) {
        router.push(props.url)
        emit('close-popup')
      }
    }

    const onClicked = () => {
      emit('close-popup')
      if (props.typeaheadMode) {
        emit('selected')
      }
    }

    return {
      onClicked
    }
  }
})
</script>

<style lang="scss" scoped>
.result-item {
  margin-left: -8px;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: #f6f6f6;
  }
}

.result-item--active {
  background: #f6f6f6;
}

.result-item-link {
  padding: 8px 8px 8px 8px;
  font-size: 14px;
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.result-item-title {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.result-item-avatar {
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
}

.result-item-avatar-icon {
  font-size: 16px;
  color: $colorRed;
}

.rtl-at-root {
  .result-item {
    margin-left: 0;
    margin-right: -8px;
  }

  .result-item-title {
    margin-left: 0;
    margin-right: 10px;
  }
}
</style>
