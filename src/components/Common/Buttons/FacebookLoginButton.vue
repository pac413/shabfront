<template>
  <button
    class="btn btn-login btn-facebook"
    @click="$router.push(`/auth/facebook/${fromLogin ? 'login' : 'start'}`)"
  >
    <FaIcon :icon="['fab', 'facebook-f']" />
    {{ title || $t('login-view.facebook-login-btn') }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FacebookLoginButton',
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

.btn-facebook {
  background-color: #5890ff;

  svg {
    margin-left: 5px;
    margin-right: 27px;
  }
}

.rtl-at-facebook {
  .btn-apple {
    svg {
      margin-left: 27px;
      margin-right: 5px;
    }
  }
}
</style>
