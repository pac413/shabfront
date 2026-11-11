
<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    lazy
    centered
    hide-footer
    :title="$t('invites.private-invite-modal.title')"
  >
    <div class="text-align-center pull-if-rtl-label p-2">
      <div class="mb-2">
        {{ $t('invites.private-invite-modal.description', { name }) }}
      </div>
      <otp-input
        ref="otpInputRef"
        v-model:value="otp"
        input-classes="otp-input"
        separator="-"
        :num-inputs="4"
        :should-auto-focus="true"
        input-type="letter-numeric"
        :conditional-class="['one', 'two', 'three', 'four']"
        :placeholder="['*', '*', '*', '*']"
        class="justify-content-center"
        @on-complete="handleOnComplete"
      />
      <div v-if="wrongOtp" class="error-details pull-if-rtl-label mt-2">
        {{ $t('invites.private-invite-modal.wrong-passcode') }}
      </div>
    </div>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import OtpInput from 'vue3-otp-input'

import { useRegisterModal } from '@/composables'
import { Modal } from '@/stores/modal'

const modalId = Modal.PRIVATE_INVITE_PASSCODE

export default defineComponent({
  name: 'PrivateInvitePasscodeModal',
  components: {
    OtpInput
  },
  props: {
    name: {
      type: String,
      required: true
    },
    passcode: {
      type: String,
      required: true,
    },
    onCancel: {
      type: Function,
      default: null,
    },
    onSuccess: {
      type: Function,
      default: null,
    }
  },
  setup(props) {
    const { isVisible } = useRegisterModal(modalId)
    const otpInputRef = ref<InstanceType<typeof OtpInput> | null>(null)
    const otp = ref('')
    const wrongOtp = computed(() => otp.value.length === 4 && otp.value !== props.passcode)

    const handleOnComplete = (value: string) => {
      if (value === props.passcode) {
        props.onSuccess && props.onSuccess()
      }
    }

    return {
      isVisible,
      modalId,
      otpInputRef,
      otp,
      wrongOtp,
      handleOnComplete,
    }
  },
})
</script>

<style lang="scss">
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;

  input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
  }
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
