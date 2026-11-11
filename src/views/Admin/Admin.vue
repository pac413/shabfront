<template>
  <div class="admin-layout">
    <admin-nav />

    <div class="admin-layout__content">
      <RouterView v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import AdminNav from '@/components/Admin/AdminNav.vue'

export default defineComponent({
  name: 'AdminLayout',
  components: {
    AdminNav,
    RouterView,
  },
})
</script>

<style lang="scss" scoped>
.admin-layout {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  font-size: 14px;
  padding: 20px 0 40px;
  flex: 1;
}

.admin-layout__content {
  display: flex;

  > .card,
  > .full-width {
    flex: 1;
  }
}

.recent-members__empty {
  display: flex;
  justify-content: center;
  padding: 20px 10px;
  font-size: 1rem;
  border: none;
}

:deep(.card) {
  box-shadow: none;

  .card-header {
    color: $colorText;

    .card-header__title {
      font-size: 20px;
    }
  }
}

.navbar {
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  background: white;
  margin-bottom: 10px;
}
</style>
