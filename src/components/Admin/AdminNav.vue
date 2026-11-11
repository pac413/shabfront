<template>
  <nav>
    <ul>
      <li>
        <RouterLink :to="{ name: 'RecentMembers' }">
          {{ $t('admin.recent-members.title') }}
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'FlaggedContents' }">
          {{ $t('admin.flagged-contents.title') }}
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'ReportedMembers' }">
          {{ $t('admin.reported-members.title') }}
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'AdminTotals' }">
          {{ $t('admin.admin-totals.title') }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminNav',
})
</script>

<style lang="scss" scoped>
nav {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0 1rem;
  display: flex;
}

li {
  margin: 0;
  padding: 0 0.5rem;
  font-size: 1.1rem;

  a {
    display: inline-block;
    padding: 0.5rem 1.5rem 1rem;
    color: $colorSecondary;

    &:hover {
      color: $colorText;
      text-decoration: none;
    }
    &.router-link-exact-active {
      color: $colorRed;
      font-weight: bold;
      border-bottom: solid 4px $colorRed;
    }
  }
}

@media (max-width: $mobileMaxWidth) {
  ul {
    overflow-x: scroll;
  }

  li {
    flex: 0 0 auto;
    a {
      padding: 5px;
      font-size: 0.8rem;
    }
  }
}
</style>
