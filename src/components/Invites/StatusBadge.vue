<template>
  <div
    v-if="!isExpired"
    class="status-message"
  >
    <BAlert
      :model-value="true"
      :variant="statusVariant"
    >
      <IconItem
        v-if="isPending && !isRecipient"
        :icon="['fas', 'hourglass']"
        :item-text="$t(`invites.modal.${type.toLowerCase()}-pending-status`)"
      />
      <IconItem
        v-else
        :icon="statusIcon"
        :item-text="$t(`invites.modal.${inviteStatus}-status`)"
      />
    </BAlert>
  </div>
  <div v-else>
    <BAlert
      :model-value="true"
      variant="danger"
    >
      <IconItem
        :icon="['fal', 'exclamation-circle']"
        :item-text="$t('invites.modal.expired-date-past')"
      />
    </BAlert>
    <IconItem
      v-if="!isPending"
      :class="statusVariant"
      :icon="statusIcon"
      :item-text="$t('invites.modal.status') + ' ' + $t(`invites.modal.${inviteStatus}-status`)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { InviteStatus, type InviteType } from '@/types'
import { statusIcon as statusIconFn, statusVariant as statusVariantFn } from '@/utils'

export default defineComponent({
  name: 'StatusBadge',
  props: {
    status: {
      type: String as () => InviteStatus,
      required: true,
    },
    type: {
      type: String as () => InviteType,
      required: true,
    },
    isExpired: {
      type: Boolean,
      required: true,
    },
    isRecipient: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const statusIcon = computed(() => {
      return statusIconFn(props.status, props.isRecipient)
    })

    const statusVariant = computed(() => {
      return statusVariantFn(props.status)
    })

    const isPending = computed(() => {
      return props.status === InviteStatus.PENDING
    })

    const inviteStatus = computed(() => {
      return props.status.toLowerCase()
    })

    return {
      inviteStatus,
      isPending,
      statusIcon,
      statusVariant,
    }
  }
})
</script>

<style lang="scss" scoped>
.danger {
  color: #dc3545
}

.success {
  color: #28a745;
}

.alert .icon-item {
  padding-bottom: 0;
}

.icon-item {
  padding-bottom: 8px;
}

.status-message .icon-item {
  padding-bottom: 0;
}

</style>
