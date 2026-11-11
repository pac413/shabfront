<template>
  <BCard class="my-1">
    <div class="report__section">
      <span class="report__label">Reported by:</span>
      <RouterLink
        target="_blank"
        :to="`/profile/${item.reporter.handle}`"
        class="report__profile-name"
      >
        <ProfileAvatar
          thumbnail="small"
          :profile="item.reporter"
        />
        <b>{{ item.reporter.displayName }}</b>
        <span v-if="item.reporter.isZealot"> (<i>Zealot Member</i>)</span>
      </RouterLink>
    </div>
    <div class="report__section">
      <span class="report__label">Reporter email:</span>
      <b>{{ item.reporter.email }}</b>
    </div>
    <div class="report__section">
      <span class="report__label">Reporter phone:</span>
      <b>{{ item.reporter.phone }}</b>
    </div>
    <div class="report__section">
      <span class="report__label">Reason:</span>
      <b>{{ item.reason }}</b>
    </div>
    <div class="report__section">
      <span class="report__label">Additional Details:</span>
      <b>{{ item.additionalDetails }}</b>
    </div>
    <div class="report__section">
      <span class="report__label">Reported at:</span>
      <b>{{ item.createdAt }}</b>
    </div>
  </BCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import type { Report } from '@/types'

export default defineComponent({
  name: 'MemberReport',
  components: { ProfileAvatar },
  props: {
    item: {
      required: true,
      type: Object as () => Report
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.report__section) {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  .report__label {
    display: inline-block;
    width: 100px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-right: 0.5rem;
  }

  .report__profile-name {
    a {
      align-items: center;
      display: flex;
    }

    .b-avatar {
      margin-right: 8px;
    }
  }
}

.rtl-at-root {
  :deep(.report__section) {
    .report__label {
      margin-left: 0.5rem;
      margin-right: unset;
    }

    .report__profile-name {
      .b-avatar {
        margin-left: 8px;
        margin-right: unset;
      }
    }
  }
}
</style>
