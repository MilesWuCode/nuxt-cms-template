<script setup lang="ts">
const props = defineProps<{ postId: number }>()

const route = useRoute()

// 文章底下的相關頁面，目前所在的那一個會被標示
const items = computed(() => [
  { label: '內容', icon: 'i-lucide-file-text', to: `/posts/${props.postId}` },
  {
    label: '留言',
    icon: 'i-lucide-message-circle',
    to: `/posts/${props.postId}/comments`,
  },
  {
    label: '版本紀錄',
    icon: 'i-lucide-history',
    to: `/posts/${props.postId}/revisions`,
  },
])
</script>

<template>
  <nav
    aria-label="文章相關頁面"
    class="mx-auto flex w-fit max-w-full shrink-0 gap-1 overflow-x-auto rounded-lg bg-elevated/50 p-1 ring ring-default"
  >
    <UButton
      v-for="item in items"
      :key="item.to"
      :label="item.label"
      :icon="item.icon"
      :to="item.to"
      color="neutral"
      :variant="route.path === item.to ? 'soft' : 'ghost'"
      :aria-current="route.path === item.to ? 'page' : undefined"
    />
  </nav>
</template>
