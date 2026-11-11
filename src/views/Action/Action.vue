<template>
  <div class="d-flex flex align-items-center justify-content-center flex-grow-1">
    <Spinner />
    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'Action',
  components: {
    RouterView,
  },
})
</script>
