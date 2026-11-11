<template>

  <div
    v-if="member.riskAssessment"
    class="risk-assessment"
  >
    <div class="member__item__prop">
      <b>IP Address:</b> {{ member.riskAssessment.ipAddress }}
    </div>
    <div class="member__item__prop">
      <b>IP Risk Score:</b> {{ member.riskAssessment.ipRiskScore }}
    </div>
    <div class="member__item__prop">
      <b>User Agent:</b> {{ member.riskAssessment.userAgent }}
    </div>
    <div class="member__item__prop">
      <b>Min Fraud Risk Score:</b> {{ member.riskAssessment.minFraudRiskScore }}
    </div>
    <div
      v-if="member.riskAssessment.location"
      class="location-props"
    >
      <div
        v-if="member.riskAssessment.location.city"
        class="member__item__prop"
      >
        <b>City:</b> {{ member.riskAssessment.location.city }}
      </div>
      <div
        v-if="member.riskAssessment.location.cityConfidence"
        class="member__item__prop"
      >
        <b>City Confidence:</b> {{ member.riskAssessment.location.cityConfidence }}
      </div>
      <div
        v-if="member.riskAssessment.location.country"
        class="member__item__prop"
      >
        <b>Country:</b> {{ member.riskAssessment.location.country }}
      </div>
      <div
        v-if="member.riskAssessment.location.countryConfidence"
        class="member__item__prop"
      >
        <b>Country Confidence:</b> {{ member.riskAssessment.location.countryConfidence }}
      </div>
    </div>
  </div>
  <div v-else>
    No data
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type { IAdminRecentMemberFragmentFragment } from '@/composables/graphql/generated'

export default defineComponent({
  name: 'RecentMemberRiskAssessment',
  props: {
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    }
  }
})
</script>
