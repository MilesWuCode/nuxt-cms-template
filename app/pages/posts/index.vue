<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Column, SortingState } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'

definePageMeta({ layout: 'dashboard' })

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const toast = useToast()

const rows = ref<Post[]>([...posts])
const search = ref('')
const statusFilter = ref<'all' | PostStatus>('all')
const page = ref(1)
const pageSize = 10

const statusFilterItems = [{ label: '全部狀態', value: 'all' }, ...postStatusOptions]

const statusColor: Record<PostStatus, 'success' | 'warning' | 'neutral'> = {
  published: 'success',
  draft: 'warning',
  archived: 'neutral',
}

const sorting = ref<SortingState>([{ id: 'id', desc: false }])

const filteredPosts = computed(() =>
  rows.value.filter(
    (post) =>
      (!search.value || post.title.includes(search.value)) &&
      (statusFilter.value === 'all' || post.status === statusFilter.value),
  ),
)

// 排序在分頁之前做，才會跨頁排序
const sortedPosts = computed(() => {
  const sort = sorting.value[0]
  if (!sort) return filteredPosts.value
  const key = sort.id as keyof Post
  return [...filteredPosts.value].sort((a, b) => {
    const result = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
    return sort.desc ? -result : result
  })
})

const pagedPosts = computed(() =>
  sortedPosts.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)

watch([search, statusFilter, sorting], () => {
  page.value = 1
})

// 刪除確認
const deleteTarget = ref<Post>()
const deleteOpen = computed({
  get: () => !!deleteTarget.value,
  set: (value) => {
    if (!value) deleteTarget.value = undefined
  },
})

function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  rows.value = rows.value.filter((post) => post.id !== target.id)
  page.value = Math.min(page.value, Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))
  toast.add({ title: '已刪除', description: target.title, color: 'success' })
  deleteTarget.value = undefined
}

function sortableHeader(label: string) {
  return ({ column }: { column: Column<Post> }) => {
    const sorted = column.getIsSorted()
    return h(UButton, {
      label,
      color: 'neutral',
      variant: 'ghost',
      class: '-mx-2.5',
      trailingIcon: sorted
        ? sorted === 'asc'
          ? 'i-lucide-arrow-up-narrow-wide'
          : 'i-lucide-arrow-down-wide-narrow'
        : 'i-lucide-arrow-up-down',
      onClick: () => column.toggleSorting(sorted === 'asc'),
    })
  }
}

const columns: TableColumn<Post>[] = [
  { accessorKey: 'id', header: sortableHeader('#') },
  { accessorKey: 'title', header: sortableHeader('標題') },
  { accessorKey: 'author', header: sortableHeader('作者') },
  { accessorKey: 'category', header: sortableHeader('分類') },
  {
    accessorKey: 'status',
    header: sortableHeader('狀態'),
    cell: ({ row }) => {
      const status = row.original.status
      return h(UBadge, {
        label: postStatusOptions.find((o) => o.value === status)?.label,
        color: statusColor[status],
        variant: 'subtle',
      })
    },
  },
  { accessorKey: 'views', header: sortableHeader('瀏覽數') },
  { accessorKey: 'createdAt', header: sortableHeader('建立日期') },
  {
    id: 'actions',
    cell: ({ row }) =>
      h('div', { class: 'text-right' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          color: 'neutral',
          variant: 'ghost',
          to: `/posts/${row.original.id}/edit`,
          'aria-label': '編輯',
        }),
        h(UButton, {
          icon: 'i-lucide-trash',
          color: 'error',
          variant: 'ghost',
          'aria-label': '刪除',
          onClick: () => {
            deleteTarget.value = row.original
          },
        }),
      ]),
  },
]
</script>

<template>
  <UDashboardPanel id="posts">
    <template #header>
      <UDashboardNavbar title="文章列表">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="新增文章" to="/posts/create" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput v-model="search" icon="i-lucide-search" placeholder="搜尋標題..." />
        </template>
        <template #right>
          <USelect v-model="statusFilter" :items="statusFilterItems" class="w-32" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        v-model:sorting="sorting"
        :data="pagedPosts"
        :columns="columns"
        :sorting-options="{ manualSorting: true }"
        class="shrink-0"
      />

      <div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4">
        <span class="text-sm text-muted">共 {{ filteredPosts.length }} 筆</span>
        <UPagination v-model:page="page" :items-per-page="pageSize" :total="filteredPosts.length" />
      </div>

      <UModal v-model:open="deleteOpen" title="刪除文章" :ui="{ footer: 'justify-end' }">
        <template #body>
          確定要刪除「{{ deleteTarget?.title }}」嗎？此動作無法復原。
        </template>
        <template #footer="{ close }">
          <UButton label="取消" color="neutral" variant="outline" @click="close" />
          <UButton label="刪除" color="error" icon="i-lucide-trash" @click="confirmDelete" />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
