<template>
  <button
    class="btn btn-login btn-apple"
    @click="$router.push(`/auth/apple/${fromLogin ? 'login' : 'start'}`)"
  >
    <FaIcon :icon="['fab', 'apple']" />
    {{ title || $t('login-view.apple-login-btn') }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppleLoginButton',
  props: {
    title: {
      type: String,
      default: null,
    },
    fromLogin: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
@import './login-btn-style.module.scss';

.btn-apple {
  background: black;
  color: white;

  svg {
    margin-left: 5px;
    margin-right: 27px;
  }
}

.rtl-at-root {
  .btn-apple {
    svg {
      margin-left: 27px;
      margin-right: 5px;
    }
  }
}
</style>
