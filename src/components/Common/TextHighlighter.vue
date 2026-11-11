<template>
  <span class="text-highlighter" v-html="output" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'TextHighlighter',
  props: {
    text: {
      type: String,
      default: '',
    },
    term: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const output = ref<string>('')

    const highlight = () => {
      output.value = ''
      // For now, we support up to 2 terms separted by space
      const [term1, term2] = props.term.split(' ')
      if (term1 && term2) {
        const regex = new RegExp(`(${term1})(.*)(\\s)(${term2})(.*)`, 'i')
        const execArray = regex.exec(props.text)
        if (execArray) {
          execArray.map((item, index) => {
            if (index === 0) {
              return
            }
            if (index === 1 || index === 4) {
              output.value += `<span>${item}</span>`
            } else {
              output.value += item
            }
          })
        } else {
          output.value = props.text
        }
      } else {
        const regex = new RegExp(`(.*)(${props.term})(.*)`, 'i')
        const execArray = regex.exec(props.text)
        if (execArray) {
          execArray.map((item, index) => {
            if (index === 0) {
              return
            }
            if (index === 2) {
              output.value += `<span>${item}</span>`
            } else {
              output.value += item
            }
          })
        } else {
          output.value = props.text
        }
      }
    }

    onMounted(() => highlight())
    watch(
      () => props.text,
      () => highlight(),
    )
    watch(
      () => props.term,
      () => highlight(),
    )
    return {
      output,
    }
  },
})
</script>

<style lang="scss">
.text-highlighter span {
  color: $colorRed;
  font-weight: 800;
}
</style>
