<template>
  <div class="profile-contact-card">
    <IconItem
      v-if="phone"
      :icon="['fal', 'phone']"
      :item-text="phone"
    />

    <div
      v-if="location"
      class="address-wrapper"
    >
      <FaIcon
        :icon="['fa', 'map-marker-alt']"
        class="m-0 me-3"
      />
      <div class="address-details">
        <BLink
          v-if="location"
          :href="buildDirectionsUrl(location)"
          target="_blank"
        >
          {{ location.address }}<br v-if="location.address">
          {{ getLocationDisplay(location) }}
        </BLink>
      </div>
    </div>
    <IconItem
      v-if="email"
      :icon="['fal', 'envelope']"
      :item-text="email"
      :item-link="`mailto:${email}`"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import type { IHostingRole } from '@/composables/graphql/generated'
import type { Profile } from '@/types'
import { buildDirectionsUrl, getLocationDisplay } from '@/utils'

export default defineComponent({
  name: 'ContactCard',
  props: {
    profile: {
      // This is from the invites/currentInvite getter.
      // Therefore, it can be different from the role profile from the hosting in the planner/hostingList state.
      type: Object as () => Profile,
      required: true,
    },
    role: {
      type: String as () => IHostingRole,
      required: true,
    },
    inviteId: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const phone = computed(() => props.profile.phone)
    const email = computed(() => props.profile.email)
    const location = computed(() => props.profile.primaryLocation)

    return {
      buildDirectionsUrl,
      email,
      getLocationDisplay,
      location,
      phone,
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.icon-item) {
  padding: 1rem 0;
  font-size: .9rem;
  svg {
    width: 20px;
    margin-right: 1rem;
  }
}
.address-wrapper {
  display: flex;
  align-items: center;
  font-size: .9rem;
  svg {
    width: 20px;
  }
  .address-details {
    flex: 1;
    padding-left: 10px;
  }
}

.rtl-at-root {
  :deep(.icon-item) {
    svg {
      margin-left: 1rem;
      margin-right: unset;
    }
  }

  .address-wrapper {
    .address-details {
      padding-left: unset;
      padding-right: 10px;
    }
  }
}
</style>
