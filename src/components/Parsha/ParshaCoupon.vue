<template>
  <div class="parsha-coupon">
    <div class="callout">
      <div class="mb-2" v-html="$t('parsha.coupon.callout-text')" />
      <BButton variant="primary" size="xl" href="https://storytymewithrabbijuravel.com" target="_blank">
        {{ $t('parsha.coupon.buy-now') }}
      </BButton>
    </div>
    <div class="discount-text">
      <FaIcon :icon="['fas', 'cut']" class="fa-rotate-270 scissor-icon" size="2x" />
      <div class="discount-headline">
        {{ $t('parsha.coupon.discount-headline') }}
      </div>
      {{ $t('parsha.coupon.discount-text') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ParshaCoupon',
})
</script>

<style lang="scss" scoped>
.parsha-coupon {
  background: url('../../assets/img/parsha/coupon-bg.png') center center,
    linear-gradient(87.09deg, #21d4fd -4.35%, #2ecafd 0.74%, #ca5aff 60.17%, #ff0505 97.2%);
  background-size: cover;
  border-radius: 12px;
  margin: 2rem;
  padding: 1.5rem 4rem;
  display: flex;
  color: white;
  font-weight: bold;
  .callout {
    flex: 2;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .discount-text {
    position: relative;
    flex: 1;
    border: dashed 4px white;
    border-radius: 10px;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 1.5rem;
    font-weight: normal;

    .discount-headline {
      text-transform: uppercase;
      font-size: 2rem;
      font-weight: bold;
    }

    .scissor-icon {
      position: absolute;
      left: -18px;
      bottom: 18px;
    }
  }
}
</style>
