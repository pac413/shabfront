<template>
  <div class="card card-body restrictions-card">
    <div class="card-section-title">
      {{ $t('profile-view.admin.restriction-status') }}
    </div>
    <template v-if="restrictions && !loading">
      <div
        v-for="(_, key) in RestrictionCategories"
        :key="key"
        class="restriction-status"
      >
        <div
          v-if="restrictions && restrictions[key]"
          class="category danger"
        >
          <FaIcon
            v-b-tooltip.hover.bottom="$t('profile-view.admin.restricted')"
            :icon="['fas', 'times']"
          />
          <div class="restriction-item">
            {{ $t('profile-view.admin.'+ key) }}
          </div>
          <BButton
            size="sm"
            variant="secondary"
            @click="changeRestriction(key, false)"
          >
            {{ $t('profile-view.admin.allow') }}
          </BButton>
        </div>
        <div
          v-else
          class="category success"
        >
          <FaIcon
            v-b-tooltip.hover.bottom="$t('profile-view.admin.member-good-standing')"
            :icon="['fas', 'check']"
          />
          <div class="restriction-item">
            {{ $t('profile-view.admin.'+ key) }}
          </div>
          <BButton
            size="sm"
            variant="primary"
            @click="changeRestriction(key, true)"
          >
            {{ $t('profile-view.admin.restrict') }}
          </BButton>
        </div>
      </div>
    </template>
    <template v-if="loading">
      <Spinner />
    </template>
    <template v-if="errors">
      {{ errors }}
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import Spinner from '@/components/Common/Spinner.vue'
import {
  type IProfileRestrictionsFragmentFragment,
  useProfileRestrictionsByIdQuery,
  useSetRestrictionsMutation,
} from '@/composables/graphql/generated'

enum RestrictionCategories {
  feed = 'Feed Posting',
  messaging = 'Messaging',
  actions = 'Actions',
  search = 'Search',
}

export default defineComponent({
  name: 'RestrictionsCard',
  components: { Spinner },
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { result, loading, refetch } = useProfileRestrictionsByIdQuery({ id: props.profileId })
    const { mutate } = useSetRestrictionsMutation()
    const restrictions = computed(() => result.value?.profile?.profile?.restrictions)
    const errors = computed(() => {
      const errors = result.value?.profile?.errors
      if (errors && errors.length > 0) {
        return errors[0]?.message
      }
      return null
    })

    const changeRestriction = async (restriction: keyof IProfileRestrictionsFragmentFragment, value: boolean) => {
      await mutate({
        input: {
          profileId: props.profileId,
          [restriction]: value,
        }
      })
      await refetch({ id: props.profileId })
    }

    return {
      changeRestriction,
      errors,
      loading,
      restrictions,
      RestrictionCategories,
    }
  }
})
</script>

<style lang="scss" scoped>
.restrictions-card {
  margin-bottom: 20px;
  background-color: #eee;

  .card-section-title {
    font-weight: bold;
    padding-bottom: 5px;
  }
}

.restriction-status {
  .category {
    display: flex;
    align-items: center;
    padding: 2px 0;

    svg {
      flex: 0 0 16px;
      margin-right: 10px;
    }

    &.danger svg {
      color: red;
    }

    &.success svg {
      color: green;
    }

    .restriction-item {
      flex: 1;
    }

    .btn-sm {
      min-width: 80px;
    }
  }
}

.rtl-at-root {
  .restriction-status {
    .category {
      svg {
        margin-left: 10px;
        margin-right: unset;
      }
    }
  }
}
</style>
