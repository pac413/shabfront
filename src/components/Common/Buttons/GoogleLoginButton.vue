<template>
  <button
    class="btn btn-login btn-google"
    @click="$router.push(`/auth/google/${fromLogin ? 'login' : 'start'}`)"
  >
    <img src="@/assets/img/outer/g-logo.png" alt="G" />
    {{ title || $t('login-view.google-login-btn') }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GoogleLoginButton',
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

.btn-google {
  background: white;
  color: $colorGrey;
  border: 1px solid #ccc;

  img {
    width: 18px;
    margin-right: 24px;
  }
}

.rtl-at-root {
  .btn-google {
    img {
      margin-left: 0;
      margin-right: 24px;
    }
  }
}
</style>
