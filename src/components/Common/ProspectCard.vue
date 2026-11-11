<template>
  <div class="prospect-card">
    <div
      class="ratio ratio-1x1 prospect-card__img-container"
    >
      <RouterLink
        target="_blank"
        :to="`/profile/${source.handle}/`"
        :draggable="draggable"
      >
        <ProfileImage
          class="card-img-top prospect-card__image"
          :profile="source"
        />

        <div
          class="prospect-card__hover"
          @click="$emit('click')"
        >
          <span v-if="age"> {{ age }} {{ $t('profile.years-old') }} </span>
          <span v-if="occupation"> {{ occupation }} </span>
          <span> {{ activeDate }} </span>
          <div
            v-if="source.totals"
            class="row align-items-center justify-content-space-between"
          >
            <div class="me-3">
              <FaIcon
                :icon="['fas', 'eye']"
                class="me-1"
              />
              {{ source.totals.views }}
            </div>
            <div>
              <FaIcon
                :icon="['fal', 'calendar-circle-user']"
                class="me-1"
              />
              {{ source.totals.invites }}
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
    <div class="prospect-card__body">
      <div class="prospect-card__name">
        <RouterLink
          target="_blank"
          :to="`/profile/${source.handle}/`"
          :draggable="draggable"
        >
          <span class="name link-unstyled">{{ `${source.firstName} ${source.lastName}` }}</span>
        </RouterLink>
      </div>
      <div
        v-if="source.primaryLocation"
        class="prospect-card__address"
      >
        {{ primaryLocationString }}
      </div>
    </div>
    <div
      v-if="selectable"
      class="prospect-card__checkbox"
    >
      <BFormCheckbox
        class="checkbox-red"
        button-variant="secondary"
        :model-value="selected"
        @change="onSelectChange"
      />
    </div>
    <ProfileOverlayMenu
      :profile="source"
      class="more-menu"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ProfileImage from '@/components/Common/ProfileImage.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import { storeKey } from '@/store'
import type { Profile } from '@/types'
import { calculateAge, getActiveOrSinceNotation,isDateValid } from '@/utils'

export default defineComponent({
  name: 'ProspectCard',
  components: {
    ProfileOverlayMenu,
    ProfileImage,
  },
  props: {
    source: {
      type: Object as () => Profile,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click', 'select'],
  setup(props, context) {
    const store = useStore(storeKey)
    const route = useRoute()
    const occupations = computed(() => store.state.profile.occupations)
    const primaryLocationString = computed<string>(() => {
      const { city, state, country } = props.source.primaryLocation
      return [city, state || country].filter(item => !!item).join(', ')
    })
    const age = computed<number | null>(() => {
      const { birthday } = props.source
      if (birthday && isDateValid(birthday)) {
        return calculateAge(birthday)
      }
      return null
    })
    const activeDate = computed<string>(() => {
      const { createdAt, dateActive } = props.source
      if (['Dating', 'Search'].includes(route.name?.toString() || '')) {
        const { recentMembership } = route.query || {}
        if (recentMembership === 'true') {
          return getActiveOrSinceNotation(createdAt, dateActive, 'createdAt')
        }
      }
      return getActiveOrSinceNotation(createdAt, dateActive)
    })
    const occupation = computed<string | null>(() => {
      if (props.source.occupation) {
        const index = occupations.value.findIndex(item => item.id === props.source.occupationId)
        if (index > -1) {
          return occupations.value[index].name
        } else {
          return props.source.occupation
        }
      }
      return props.source.uncuratedOccupation || null
    })
    const onSelectChange = (isSelected: boolean) => {
      context.emit('select', { profile: props.source, isSelected })
    }

    return {
      activeDate,
      age,
      occupation,
      occupations,
      onSelectChange,
      primaryLocationString
    }
  }
})
</script>

<style scoped lang="scss">
.prospect-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  font-weight: 400;
  background-color: transparent;
  background-clip: border-box;
  text-align: center;
  border-radius: 10px !important;
  border: none !important;
  overflow: hidden;
}

.prospect-card__img-container {
  width: 100%;
  position: relative;
}

.prospect-card__image {
  object-fit: cover;
  border-radius: 10px !important;
}

.prospect-card__hover {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  padding: 0 15px;
  border-radius: 10px;

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
  }

  span {
    display: block;
  }

  div {
    font-size: 10px;
    font-weight: 400;
  }
}

.prospect-card__body {
  padding: 5px 10px 15px 10px;
}
.prospect-card__name {
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;

  a {
    color: inherit;
  }
}

.prospect-card__address {
  font-size: 12px;
  color: grey;
  line-height: 16px;
}

.prospect-card__checkbox {
  position: absolute;
  top: 2px;
  left: 5px;
}

.more-menu {
  :deep(.overlay-menu) {
    position: absolute;
    top: 5px;
    right: 7px;
  }
}

.rtl-at-root {
  .more-menu {
    :deep(.overlay-menu) {
      right: auto;
      left: 7px;
    }
  }
}
</style>
