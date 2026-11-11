<template>
  <div class="likes-list-item">
    <div class="likes-list-item__profile">
      <ProfileAvatar
        linkable
        class="avatar"
        size="3em"
        thumbnail="medium"
        target="_blank"
        :profile="profile"
      />
    </div>
    <div class="like-list-item__details">
      <ProfileLinkableName
        :profile="profile"
        target="_blank"
      />
      <AgoString
        class="ago-string"
        :date="date"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AgoString from '@/components/Common/AgoString.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'LikeListItem',
  components: {
    AgoString,
    ProfileLinkableName,
    ProfileAvatar,
  },
  props: {
    date: {
      type: String,
      required: true,
    },
    profile: {
      type: Object as () => Profile,
      required: true,
    }
  }
})
</script>

<style lang="scss" scoped>
.likes-list-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 1em;
  padding: 1em 0;
  border-bottom: solid 1px $colorLightGrey3;

  &:last-of-type {
    border-bottom: none;
  }
}

.likes-list-item__profile {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar {
    margin-right: 1rem;
  }
}

.like-list-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;

  .ago-string {
    color: $colorSecondary;
    font-size: .9rem;
  }
}

.rtl-at-root {
  .likes-list-item__profile {
    .avatar {
      margin-right: unset;
      margin-left: 1rem;
    }
  }
}
</style>
