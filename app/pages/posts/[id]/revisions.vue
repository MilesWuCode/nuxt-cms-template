<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard',
  validate: (route) =>
    posts.some((p) => p.id === Number(route.params.id)) ||
    createError({ statusCode: 404, statusMessage: '找不到這篇文章' }),
})

const route = useRoute()
const post = posts.find((p) => p.id === Number(route.params.id))!

const breadcrumbItems: BreadcrumbItem[] = [
  { label: '文章列表', to: '/posts' },
  { label: post.title, to: `/posts/${post.id}` },
  { label: '版本紀錄' },
]

// 版本紀錄假資料（新到舊）
const revisions = [
  {
    version: 4,
    editor: '王小明',
    note: '修正錯字',
    time: `${post.createdAt} 18:12`,
  },
  {
    version: 3,
    editor: '陳美玲',
    note: '更新封面圖片與摘要',
    time: `${post.createdAt} 15:40`,
  },
  {
    version: 2,
    editor: post.author,
    note: '補充第二段內容',
    time: `${post.createdAt} 11:05`,
  },
  {
    version: 1,
    editor: post.author,
    note: '建立文章',
    time: `${post.createdAt} 09:30`,
  },
]
</script>

<template>
  <UDashboardPanel id="posts-revisions">
    <template #header>
      <UDashboardNavbar :as="{ title: 'div' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <UBreadcrumb :items="breadcrumbItems" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <PostSubNav :post-id="post.id" />

      <UPageCard
        title="版本紀錄"
        variant="subtle"
        class="mx-auto w-full max-w-5xl"
      >
        <ul class="divide-y divide-default">
          <li
            v-for="(revision, index) in revisions"
            :key="revision.version"
            class="flex items-center gap-3 py-3"
          >
            <UBadge
              :label="`v${revision.version}`"
              color="neutral"
              variant="outline"
            />
            <div class="min-w-0 flex-1 text-sm">
              <p class="text-highlighted">{{ revision.note }}</p>
              <p class="text-dimmed">
                {{ revision.editor }} · {{ revision.time }}
              </p>
            </div>
            <UBadge v-if="index === 0" label="目前版本" variant="subtle" />
            <UButton
              v-else
              label="還原"
              icon="i-lucide-rotate-ccw"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </li>
        </ul>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
