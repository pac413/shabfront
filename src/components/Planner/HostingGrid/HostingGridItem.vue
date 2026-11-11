<template>
  <div
    class="hosting-grid-item"
    :class="{
      'hosting-grid-item--accepted': status === 'ACCEPTED',
      'hosting-grid-item--declined': status === 'DECLINED',
    }"
  >
    <div class="hosting-grid-item__avatar-section">
      <BLink
        class="hosting-grid-item__avatar"
        @click.prevent="$emit('view')"
      >
        <ProfileAvatar
          class="avatar mb-1"
          rounded="lg"
          size="8rem"
          thumbnail="medium"
          :profile="subjectProfile"
        />
      </BLink>
      <div
        v-if="!hideOverlay"
        class="hosting-item-overlay"
        @click="$emit('view')"
      >
        <IconItem
          v-if="subjectProfile.phone"
          :icon="['fal', 'phone']"
          :item-text="subjectProfile.phone"
        />
        <IconItem
          v-if="subjectProfile.user && subjectProfile.user.email"
          :icon="['fal', 'envelope']"
          :item-text="subjectProfile.user.email"
        />
      </div>
      <div
        v-if="selectable"
        class="hosting-grid-item__checkbox"
        :class="{ 'hosting-grid-item__checkbox--selected': selected }"
      >
        <BFormCheckbox
          class="checkbox-red"
          button-variant="secondary"
          :model-value="selected"
          @change="onSelectChange"
        />
      </div>
    </div>
    <ProfileOverlayMenu
      :profile="subjectProfile"
      class="more-menu"
      :items="[
        ProfileOverlayItem.DATING,
        ProfileOverlayItem.FOLLOW,
        ProfileOverlayItem.MESSAGE
      ]"
    />

    <RouterLink
      target="_blank"
      :to="{ name: 'Profile', params: { handle: subjectProfile.handle } }"
      class="no-overflow"
    >
      {{ subjectProfile.displayName }}
    </RouterLink>
    <BLink
      class="hosting-grid-item__meals-text no-overflow"
      @click.prevent="$emit('view')"
    >
      <IconItem
        v-if="status"
        :icon="statusIcon(status)"
        :item-text="$t('planner.item-' + status + '-' + role)"
      />
      <span v-else>{{ mealsText }}</span>
    </BLink>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import { IHostingRole } from '@/composables/graphql/generated'
import { type InviteDetail, type InviteStatus, type Profile } from '@/types'
import { inviteParts, ProfileOverlayItem,statusIcon } from '@/utils'

export default defineComponent({
  name: 'HostingGridItem',
  components: {
    ProfileAvatar,
    ProfileOverlayMenu
  },
  props: {
    invite: {
      type: Object as () => InviteDetail,
      required: true,
    },
    role: {
      type: String as () => IHostingRole,
      required: true,
    },
    status: {
      type: String as () => InviteStatus,
      default: null,
    },
    hideOverlay: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['view', 'select'],
  setup(props, context) {
    const { t } = useI18n()
    const subjectRole = computed((): IHostingRole => 
      props.role === IHostingRole.Host ? IHostingRole.Guest : IHostingRole.Host
    )
    const subjectProfile= computed((): Profile =>
      props.invite[subjectRole.value.toLowerCase() as keyof Pick<InviteDetail, 'host'| 'guest'>]
    )
    const mealsText = computed((): string => inviteParts(props.invite)
      .map(item => t('invites.hosting-part.' + item))
      .join(', ')
      .toString()
    )
    const onSelectChange = (isSelected: boolean) => {
      context.emit('select', { item: props.invite, isSelected })
    }

    return {
      ProfileOverlayItem,
      mealsText,
      onSelectChange,
      statusIcon,
      subjectProfile,
      subjectRole,
    }
  }
})
</script>

<style lang="scss" scoped>
.hosting-grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hosting-grid-item--accepted {
  .hosting-grid-item__meals-text {
    color: green;
  }
}

.hosting-grid-item--declined {
  opacity: .4;

  .hosting-grid-item__meals-text {
    color: red;
  }
}

.avatar {
  box-shadow: 1px 1px 3px rgba(0,0,0,.2)
}

a {
  color: $colorText;
}

.hosting-grid-item__avatar-section {
  position: relative;

  &:hover {
    .hosting-grid-item__checkbox {
      display: block;
    }
    .hosting-item-overlay {
      opacity: 1;
    }
  }

  a:hover {
    text-decoration: none;
  }
}

.hosting-grid-item__checkbox {
  position: absolute;
  display: none;
  top: 2px;
  left: 5px;
}

.hosting-grid-item__checkbox--selected {
  display: block;
}

.hosting-item-overlay {
  border-radius: 5px;
  position: absolute;
  background:rgba(0, 0, 0, 0.4);
  cursor: pointer;
  height: calc(100% - .25rem);
  width: 100%;
  transition: 0.5s;
  opacity: 0;
  padding: 6px;
  color: white;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;

  :deep(.icon-item) {
    font-size: .8em;

    .icon-item-detail {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-left: .25rem;

      a {
        color: white;
      }
    }
  }
}

.more-menu {
  :deep(.overlay-menu) {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}

a.no-overflow {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 8em;

  :deep(.icon-item-detail) {
    padding-left: .25rem;
  }
}

.hosting-grid-item__meals-text {
  font-size: .8rem;
  color: $colorGrey;
}

.rtl-at-root {
  .hosting-item-overlay {
    left: unset;
    right: 0;

    :deep(.icon-item) {
      .icon-item-detail {
        padding-left: unset;
        padding-right: .25rem;
      }
    }
  }

  .more-menu {
    :deep(.overlay-menu) {
      left: 3px;
      right: unset;
    }
  }

  a.no-overflow {
    :deep(.icon-item-detail) {
      padding-left: unset;
      padding-right: .25rem;
    }
  }
}
</style>
