<template>
  <div
    ref="editorTextarea"
    class="editor-textarea"
    :data-ph="placeholder"
    contenteditable="true"
    spellcheck="true"
    @input="onTyping"
  />
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'

import { focusToEnd } from '@/utils'

export default defineComponent({
  name: 'FeedItemTextarea',
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const content = ref<string>('')
    const editorTextarea = ref<HTMLDivElement | null>(null)

    const setTextareaHTML = (content: string) => {
      if (editorTextarea.value) {
        editorTextarea.value.innerHTML = content
      }
    }

    const onTyping = (event: any) => {
      if (event) {
        setContent(event.target.innerText)
      }
    }

    const setContent = (value: string) => {
      content.value = value
      context.emit('change', value)
    }

    const focusToEndWithDelay = () => {
      setTimeout(() => {
        if (editorTextarea.value) {
          focusToEnd(editorTextarea.value)
        }
      }, 300)
    }

    watch(() => props.value, () => {
      nextTick(() => {
        if (content.value !== props.value) {
          setTextareaHTML(props.value)
          setContent(props.value)
          focusToEndWithDelay()
        }

        if (!props.value || !content.value) {
          focusToEndWithDelay()
        }
      })
    }, { immediate: true })

    return {
      content,
      editorTextarea,
      focusToEndWithDelay,
      onTyping,
      setContent,
      setTextareaHTML,
    }
  }
})
</script>

<style lang="scss" scoped>
.editor-textarea {
  width: 100%;
  border: none;
  padding: 10px 20px;
  border-radius: 35px;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  &[contentEditable='true']:empty::before {
    content: attr(data-ph);
    color: grey;
  }
}
</style>
