<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'

definePageMeta({
  layout: 'dashboard',
  validate: (route) =>
    posts.some((p) => p.id === Number(route.params.id)) ||
    createError({ statusCode: 404, statusMessage: '找不到這篇文章' }),
})

const UBadge = resolveComponent('UBadge')
const UUser = resolveComponent('UUser')

const route = useRoute()
const post = posts.find((p) => p.id === Number(route.params.id))!

const breadcrumbItems: BreadcrumbItem[] = [
  { label: '文章列表', to: '/posts' },
  { label: post.title, to: `/posts/${post.id}` },
  { label: '留言' },
]

interface PostComment {
  id: number
  author: string
  content: string
  approved: boolean
  createdAt: string
}

// 留言假資料
const comments: PostComment[] = [
  {
    id: 1,
    author: '陳美玲',
    content: '寫得很清楚，謝謝分享！',
    approved: true,
    createdAt: '2026-10-22 10:15',
  },
  {
    id: 2,
    author: '林志豪',
    content: '請問範例程式碼有放在 GitHub 嗎？',
    approved: true,
    createdAt: '2026-10-22 14:02',
  },
  {
    id: 3,
    author: '張雅婷',
    content: '第二段的說明好像有錯字。',
    approved: false,
    createdAt: '2026-10-23 09:40',
  },
  {
    id: 4,
    author: '李大華',
    content: '期待下一篇！',
    approved: true,
    createdAt: '2026-10-23 11:27',
  },
]

const columns: TableColumn<PostComment>[] = [
  {
    accessorKey: 'author',
    header: '留言者',
    cell: ({ row }) =>
      h(UUser, {
        name: row.original.author,
        avatar: { src: `https://i.pravatar.cc/64?u=${row.original.author}` },
        size: 'sm',
      }),
  },
  { accessorKey: 'content', header: '內容' },
  {
    accessorKey: 'approved',
    header: '狀態',
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.approved ? '已核准' : '待審核',
        color: row.original.approved ? 'success' : 'warning',
        variant: 'subtle',
      }),
  },
  { accessorKey: 'createdAt', header: '時間' },
]
</script>

<template>
  <UDashboardPanel id="posts-comments">
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
        :title="`留言（${comments.length}）`"
        variant="subtle"
        class="mx-auto w-full max-w-5xl"
      >
        <UTable :data="comments" :columns="columns" />
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
