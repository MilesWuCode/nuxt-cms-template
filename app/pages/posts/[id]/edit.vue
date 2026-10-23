<script setup lang="ts">
import { CalendarDate, Time } from '@internationalized/date'
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
  { label: `編輯文章 #${post.id}` },
]

// 編輯頁假資料
const initialState = {
  title: post.title,
  slug: `sample-post-${post.id}`,
  summary: '這是一段範例摘要，用來展示編輯頁的預設值。',
  content:
    '這是範例文章內容。\n\n可以在這裡編輯文章的完整內容，目前只是切版用的假資料。',
  category: post.category,
  tags: ['Nuxt', 'Vue'],
  keywords: ['nuxt ui', 'cms'],
  status: post.status,
  publishDate: new CalendarDate(2026, 10, 23),
  publishTime: new Time(9, 30),
  priority: 80,
  rating: 4,
  featured: true,
  allowComments: false,
  channels: ['web', 'newsletter'],
  themeColor: '#3B82F6',
  accessCode: ['1', '2', '3', '4'],
}
</script>

<template>
  <UDashboardPanel id="posts-edit">
    <template #header>
      <UDashboardNavbar :as="{ title: 'div' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <UBreadcrumb :items="breadcrumbItems" />
        </template>
        <template #right>
          <UButton
            icon="i-lucide-trash"
            label="刪除"
            color="error"
            variant="subtle"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-3xl">
        <PostForm
          :initial-state="initialState"
          submit-label="更新"
          @submit="navigateTo('/posts')"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
