<template>
  <div class="parsha-header">
    <div class="parsha-title">
      {{ $t('parsha.title') }}
      <div class="sub-title">
        {{ $t('parsha.sub-title') }}
      </div>
    </div>
    <div class="parsha-nav my-2">
      <BNav>
        <BNavItem @click="navigateParsha(-1)">
          {{ $t('parsha.nav.prev') }}
        </BNavItem>
        <BNavItem @click="$emit('scroll-to')">
          {{ $t('parsha.nav.all-parshiyos') }}
        </BNavItem>
        <BNavItem @click="navigateParsha(1)">
          {{ $t('parsha.nav.next') }}
        </BNavItem>
      </BNav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'

export default defineComponent({
  name: 'ParshaHeader',
  emits: ['scroll-to'],
  setup() {
    const store = useStore(storeKey)
    
    const navigateParsha = (step: number) => {
      store.dispatch('parsha/navigateParsha', step)
    }

    return {
      navigateParsha
    }
  }
})
</script>

<style lang="scss" scoped>

.parsha-header {

  .parsha-title {
    background: url('../../assets/img/parsha/header-bg.png') center,
                linear-gradient(87.09deg, #21D4FD -4.35%, #2ECAFD 0.74%, #CA5AFF 60.17%, #FF0505 97.2%);
    background-size: cover;
    text-align: center;
    padding: 5rem;
    color: white;
    font-size: 72px;
    line-height: 72px;
    font-weight: bold;
    .sub-title {
      font-family: Shrikhand, Roboto, Arial;
      font-weight: normal;
    }
  }

  .nav {
    max-width: 900px;
    display: flex;
    margin: 1.5rem auto;

  }

  li.nav-item {
    flex: 1;
    border: solid 1px #DDD;
    text-align: center;

    &:not(:last-of-type) {
      border-right: none;
    }

    a {
      color: #666;
      &:hover {
        text-decoration: underline
      }
    }
  }

}
</style>
