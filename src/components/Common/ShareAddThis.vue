<template>
  <div
    v-bind="$attrs"
    class="a2a_kit a2a_kit_size_32 a2a_default_style"
  >
    <a class="a2a_button_facebook" />
    <a class="a2a_button_twitter" />
    <a class="a2a_button_email" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'ShareAddThis',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    onMounted(() => {
      if (document.getElementById('a2a-layer') !== null) {
        if (window.a2a) {
          window.a2a.init_all()
        }
        return
      }
      const el = document.createElement('script')
      el.setAttribute('id', 'a2a-layer')
      el.setAttribute(
        'src',
        'https://static.addtoany.com/menu/page.js',
      )
      document.body.appendChild(el)
    })
  },
})
</script>
