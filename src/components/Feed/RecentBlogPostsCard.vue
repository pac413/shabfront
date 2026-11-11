<template>
  <ProfileCard :title="$t('feed.recent-blogs.title')">
    <Spinner v-if="!blogEntries" />
    <template v-else>
      <BLink
        v-for="(item, index) in blogEntries"
        :key="index"
        :href="item.link"
        target="_blank"
        class="blog-entry"
      >
        <img
          :src="item.thumb"
          class="blog-entry__thumb"
        >
        <div class="blog-entry__content">
          {{ item.title }}
        </div>
      </BLink>
    </template>
  </ProfileCard>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, onMounted, ref } from 'vue'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { type BlogEntry } from '@/types'

export default defineComponent({
  name: 'RecentBlogPostsCard',
  components: { ProfileCard },
  setup() {
    const blogEntries = ref<BlogEntry[] | null>(null)

    onMounted(() => {
      if (!import.meta.env.VITE_APP_BLOG_API) {
        return
      }
      axios
        .get(import.meta.env.VITE_APP_BLOG_API)
        .then((response) => {
          blogEntries.value = response.data.map((item: any) => {
            return {
              contents: item.Contents,
              link: item.Link,
              thumb: item.Thumb,
              thumbnailWidth: parseInt(item.ThumbnailWidth),
              title: item.Title
            }
          })
        })
    })

    return {
      blogEntries
    }
  }
})
</script>

<style lang="scss" scoped>
.blog-entry {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 5px;
  color: inherit;
  font-weight: bold;
  font-size: .9em;

  &:hover {
    background: $colorLightGrey2;
    cursor: pointer;
    text-decoration: none;
  }

  .blog-entry__thumb {
    flex: 1;
    overflow: hidden;
    object-fit: cover;
    border-radius: 12px;
    padding: 5px;
    max-height: 120px;
  }
  .blog-entry__content {
    flex: 1;
    padding: 0 5px;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
