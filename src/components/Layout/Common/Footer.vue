<template>
  <div class="footer-container">
    <div class="container px-4 pull-if-rtl">
      <div class="row align-items-center m-0 py-2">
        <div class="col-12 col-lg-6">
          <div class="row align-items-center justify-content-center justify-content-lg-start footer-page-links">
            <RouterLink to="/about">
              {{ $t('outer-footer.about') }}
            </RouterLink>
            <a :href="DONATE_SHABBAT_LINK">
              {{ $t('outer-footer.donate') }}
            </a>
            <a :href="BLOG_SHABBAT_LINK">{{ $t('outer-footer.blog') }}</a>
            <RouterLink to="/contact">
              {{ $t('outer-footer.contact') }}
            </RouterLink>
            <RouterLink to="/terms">
              {{ $t('outer-footer.terms') }}
            </RouterLink>
            <RouterLink to="/faq" class="me-0">
              {{ $t('outer-footer.faq') }}
            </RouterLink>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row align-items-center justify-content-center justify-content-lg-end footer-social-media-links">
            <a href="https://www.facebook.com/seeyouonshabbos" class="facebook">
              <FaIcon :icon="['fab', 'facebook-f']" />
            </a>
            <a href="https://twitter.com/shabbatcom" class="twitter">
              <FaIcon :icon="['fab', 'twitter']" />
            </a>
            <a href="https://www.youtube.com/channel/UCVTOg6RDu8Q4FK5lQaAhqqw" class="youtube">
              <FaIcon :icon="['fab', 'youtube']" />
            </a>
            <a href="https://www.instagram.com/shabbatapp/" class="instagram me-0">
              <FaIcon :icon="['fab', 'instagram']" />
            </a>
          </div>
        </div>
      </div>
      <div class="row footer-divider" />
      <div class="row justify-content-center footer-text">
        © {{ new Date().getFullYear() }} - Shabbat.com - All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { BLOG_SHABBAT_LINK, DONATE_SHABBAT_LINK } from '@/utils'

export default defineComponent({
  name: 'MainFooter',
  setup() {
    return {
      BLOG_SHABBAT_LINK,
      DONATE_SHABBAT_LINK,
    }
  },
})
</script>

<style scoped lang="scss">
.footer-container {
  min-height: 65px;
  background-color: #272b31;
  bottom: 0;
  z-index: 10;
}

.footer-page-links a {
  width: auto;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-right: 25px;
  text-decoration: none;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  -o-transitino: all 0.3s ease-in-out;

  &:hover {
    color: #f89406;
  }

  @media (max-width: $mobileMaxWidth) {
    margin-right: 15px;
  }
}

.footer-social-media-links a {
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  font-size: 18px;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  -o-transitino: all 0.3s ease-in-out;

  &:hover {
    color: #f89406;
  }

  @media (max-width: $mobileMaxWidth) {
    width: 40px;
    height: 40px;
  }
}

.facebook {
  &:hover,
  &:focus {
    background-color: #3b5998;
  }
}

.twitter {
  &:hover,
  &:focus {
    background-color: #39a9e0;
  }
}

.youtube {
  &:hover,
  &:focus {
    background-color: #cd332d;
  }
}

.instagram {
  &:hover,
  &:focus {
    background-color: #3f729b;
  }
}

.footer-divider {
  height: 1px;
  background-color: #aaa;
  margin: 0;
}

.footer-text {
  font-size: 14px;
  color: #aaa;
  margin: 10px 0;
  text-align: center;
}

.rtl-at-root {
  .footer-page-links a {
    margin-right: 0;
    margin-left: 25px;

    @media (max-width: $mobileMaxWidth) {
      margin-right: 0;
      margin-left: 15px;
    }
  }

  .footer-social-media-links a {
    margin-right: 0;
    margin-left: 25px;
  }
}
</style>
