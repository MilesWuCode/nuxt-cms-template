<script setup lang="ts">
import type { BreadcrumbItem, DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Column, SortingState } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'

definePageMeta({ layout: 'dashboard' })

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const ULink = resolveComponent('ULink')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()

const rows = ref<Post[]>([...posts])
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 25, 50]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: '文章列表', to: '/posts' },
  { label: '列表' },
]

const sorting = ref<SortingState>([{ id: 'id', desc: false }])

// 進階篩選（仿 Filament）：選完按「套用篩選」才生效
interface AdvancedFilters {
  status: 'all' | PostStatus
  category: string
  author: string
  views: 'all' | 'low' | 'mid' | 'high'
  createdAt: 'all' | '7d' | '30d'
}

const defaultFilters: AdvancedFilters = {
  status: 'all',
  category: 'all',
  author: 'all',
  views: 'all',
  createdAt: 'all',
}

const filtersOpen = ref(false)
const draftFilters = reactive<AdvancedFilters>({ ...defaultFilters })
const appliedFilters = ref<AdvancedFilters>({ ...defaultFilters })

const filterFields = [
  {
    key: 'status',
    label: '狀態',
    items: [{ label: '全部', value: 'all' }, ...postStatusOptions],
  },
  {
    key: 'category',
    label: '分類',
    items: [
      { label: '全部', value: 'all' },
      ...categoryOptions.map((c) => ({ label: c, value: c })),
    ],
  },
  {
    key: 'author',
    label: '作者',
    items: [
      { label: '全部', value: 'all' },
      ...[...new Set(posts.map((p) => p.author))].map((a) => ({
        label: a,
        value: a,
      })),
    ],
  },
  {
    key: 'views',
    label: '瀏覽數',
    items: [
      { label: '全部', value: 'all' },
      { label: '1,000 以下', value: 'low' },
      { label: '1,000 – 3,000', value: 'mid' },
      { label: '3,000 以上', value: 'high' },
    ],
  },
  {
    key: 'createdAt',
    label: '建立日期',
    items: [
      { label: '全部', value: 'all' },
      { label: '最近 7 天', value: '7d' },
      { label: '最近 30 天', value: '30d' },
    ],
  },
] as const

const activeFilterCount = computed(
  () =>
    (Object.keys(defaultFilters) as (keyof AdvancedFilters)[]).filter(
      (key) => appliedFilters.value[key] !== defaultFilters[key],
    ).length,
)

function applyFilters() {
  appliedFilters.value = { ...draftFilters }
}

function resetFilters() {
  Object.assign(draftFilters, defaultFilters)
  applyFilters()
}

function matchesAdvancedFilters(post: Post) {
  const f = appliedFilters.value
  const daysAgo = (Date.now() - new Date(post.createdAt).getTime()) / 86_400_000
  return (
    (f.status === 'all' || post.status === f.status) &&
    (f.category === 'all' || post.category === f.category) &&
    (f.author === 'all' || post.author === f.author) &&
    (f.views === 'all' ||
      (f.views === 'low' && post.views < 1000) ||
      (f.views === 'mid' && post.views >= 1000 && post.views <= 3000) ||
      (f.views === 'high' && post.views > 3000)) &&
    (f.createdAt === 'all' ||
      (f.createdAt === '7d' && daysAgo <= 7) ||
      (f.createdAt === '30d' && daysAgo <= 30))
  )
}

const filteredPosts = computed(() =>
  rows.value.filter(
    (post) =>
      (!search.value || post.title.includes(search.value)) &&
      matchesAdvancedFilters(post),
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

// 顯示第 X 到 Y 筆
const rangeStart = computed(() =>
  filteredPosts.value.length ? (page.value - 1) * pageSize.value + 1 : 0,
)
const rangeEnd = computed(() =>
  Math.min(page.value * pageSize.value, filteredPosts.value.length),
)

const pagedPosts = computed(() =>
  sortedPosts.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  ),
)

watch([search, sorting, appliedFilters, pageSize], () => {
  page.value = 1
})

// 勾選（以文章 id 為 key，換頁後勾選仍保留）
const rowSelection = ref<Record<string, boolean>>({})
const selectedPosts = computed(() =>
  rows.value.filter((post) => rowSelection.value[post.id]),
)

// 刪除確認（單筆或批次）
const deleteTargets = ref<Post[]>([])
const deleteOpen = computed({
  get: () => deleteTargets.value.length > 0,
  set: (value) => {
    if (!value) deleteTargets.value = []
  },
})

function confirmDelete() {
  const ids = new Set(deleteTargets.value.map((post) => post.id))
  if (!ids.size) return
  rows.value = rows.value.filter((post) => !ids.has(post.id))
  rowSelection.value = Object.fromEntries(
    Object.entries(rowSelection.value).filter(([id]) => !ids.has(Number(id))),
  )
  page.value = Math.min(
    page.value,
    Math.max(1, Math.ceil(filteredPosts.value.length / pageSize.value)),
  )
  toast.add({
    title: '已刪除',
    description:
      ids.size === 1 ? deleteTargets.value[0]!.title : `共 ${ids.size} 篇文章`,
    color: 'success',
  })
  deleteTargets.value = []
}

// 批次操作
function setStatus(status: PostStatus) {
  const ids = new Set(selectedPosts.value.map((post) => post.id))
  rows.value = rows.value.map((post) =>
    ids.has(post.id) ? { ...post, status } : post,
  )
  toast.add({
    title: '已更新狀態',
    description: `${ids.size} 篇文章設為「${postStatusOptions.find((o) => o.value === status)?.label}」`,
    color: 'success',
  })
  rowSelection.value = {}
}

const bulkActions = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: '設定狀態',
      icon: 'i-lucide-refresh-cw',
      children: postStatusOptions.map((option) => ({
        label: option.label,
        onSelect: () => setStatus(option.value),
      })),
    },
  ],
  [
    {
      label: '刪除所選',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: () => {
        deleteTargets.value = [...selectedPosts.value]
      },
    },
  ],
])

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
  {
    id: 'select',
    enableHiding: false,
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': '全選本頁',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value),
        'aria-label': '選取',
      }),
  },
  { accessorKey: 'id', header: sortableHeader('#'), enableHiding: false },
  {
    accessorKey: 'title',
    header: sortableHeader('標題'),
    enableHiding: false,
    cell: ({ row }) =>
      h(
        ULink,
        { to: `/posts/${row.original.id}`, class: 'text-primary' },
        () => row.original.title,
      ),
  },
  { accessorKey: 'author', header: sortableHeader('作者') },
  { accessorKey: 'category', header: sortableHeader('分類') },
  {
    accessorKey: 'status',
    header: sortableHeader('狀態'),
    cell: ({ row }) => {
      const status = row.original.status
      return h(UBadge, {
        label: postStatusOptions.find((o) => o.value === status)?.label,
        color: postStatusColor[status],
        variant: 'subtle',
      })
    },
  },
  { accessorKey: 'views', header: sortableHeader('瀏覽數') },
  { accessorKey: 'createdAt', header: sortableHeader('建立日期') },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) =>
      h('div', { class: 'text-right' }, [
        h(UButton, {
          icon: 'i-lucide-eye',
          color: 'neutral',
          variant: 'ghost',
          to: `/posts/${row.original.id}`,
          'aria-label': '檢視',
        }),
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
            deleteTargets.value = [row.original]
          },
        }),
      ]),
  },
]

// 欄位顯示（仿 Filament）：enableHiding: false 的欄位不能被隱藏
const columnLabels: Record<string, string> = {
  id: '#',
  title: '標題',
  author: '作者',
  category: '分類',
  status: '狀態',
  views: '瀏覽數',
  createdAt: '建立日期',
}

const columnOptions = columns
  .filter((column) => 'accessorKey' in column)
  .map((column) => {
    const id = String((column as { accessorKey: string }).accessorKey)
    return {
      id,
      label: columnLabels[id] ?? id,
      toggleable: column.enableHiding !== false,
    }
  })

const columnsOpen = ref(false)
const columnVisibility = ref<Record<string, boolean>>({})
const draftVisibility = reactive<Record<string, boolean>>({})

// 打開時從目前套用的狀態複製一份草稿
watch(columnsOpen, (open) => {
  if (!open) return
  for (const option of columnOptions) {
    draftVisibility[option.id] = columnVisibility.value[option.id] !== false
  }
})

function applyColumns() {
  columnVisibility.value = { ...draftVisibility }
  columnsOpen.value = false
}

function resetColumns() {
  for (const option of columnOptions) draftVisibility[option.id] = true
  columnVisibility.value = { ...draftVisibility }
}
</script>

<template>
  <UDashboardPanel id="posts">
    <template #header>
      <UDashboardNavbar title="文章列表">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <UBreadcrumb :items="breadcrumbItems" />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="新增" to="/posts/create" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- subnav -->
      <PostSubNav :post-id="1" />

      <!-- filter -->
      <UCollapsible v-model:open="filtersOpen" class="-mb-4 shrink-0 sm:-mb-6">
        <template #content>
          <div class="pb-4 sm:pb-6">
            <UCard :ui="{ header: 'flex items-center justify-between', footer: 'flex items-center justify-end' }">
              <template #header>
                <span class="font-semibold text-highlighted">篩選條件</span>
                <UButton
                  label="重設"
                  color="error"
                  variant="link"
                  class="p-0"
                  @click="resetFilters"
                />
              </template>

              <div
                class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              >
                <UFormField
                  v-for="field in filterFields"
                  :key="field.key"
                  :label="field.label"
                >
                  <USelect
                    v-model="draftFilters[field.key]"
                    :items="[...field.items]"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <template #footer>
                <UButton label="套用篩選" @click="applyFilters" />
              </template>
            </UCard>
          </div>
        </template>
      </UCollapsible>

      <!-- data-table-toolbar -->
      <div class="flex shrink-0 items-center justify-between gap-1.5">
        <div class="flex items-center gap-1.5">
          <!-- 批次 -->
          <UDropdownMenu
            v-if="selectedPosts.length"
            :items="bulkActions"
            :content="{ align: 'start' }"
          >
            <UButton
              icon="i-lucide-ellipsis-vertical"
              :label="`批次操作（${selectedPosts.length}）`"
              color="neutral"
              variant="outline"
            />
          </UDropdownMenu>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- search-input -->
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="搜尋標題..."
          />

          <!-- filter-button -->
          <UChip
            :text="activeFilterCount"
            size="3xl"
            :color="activeFilterCount ? 'primary' : 'neutral'"
          >
            <UButton
              icon="i-lucide-funnel"
              color="neutral"
              :variant="filtersOpen ? 'soft' : 'outline'"
              aria-label="篩選條件"
              @click="filtersOpen = !filtersOpen"
            />
          </UChip>

          <!-- columns-toggle -->
          <UPopover v-model:open="columnsOpen" :content="{ align: 'end' }">
            <UButton
              aria-label="欄位顯示"
              color="neutral"
              title="欄位顯示"
              icon="i-lucide-columns-3"
              :variant="columnsOpen ? 'soft' : 'outline'"
            />

            <template #content>
              <div class="w-64 p-4">
                <div class="mb-3 flex items-center justify-between">
                  <span class="font-semibold text-highlighted">欄位</span>
                  <UButton
                    label="重設"
                    color="error"
                    variant="link"
                    class="p-0"
                    @click="resetColumns"
                  />
                </div>

                <div class="flex flex-col gap-3">
                  <UCheckbox
                    v-for="option in columnOptions"
                    :key="option.id"
                    v-model="draftVisibility[option.id]"
                    :label="option.label"
                    :disabled="!option.toggleable"
                    :color="option.toggleable ? 'primary' : 'neutral'"
                  />
                </div>

                <UButton label="套用欄位" class="mt-4" @click="applyColumns" />
              </div>
            </template>
          </UPopover>

          <!-- sorttable-button -->
          <UButton
            icon="i-lucide-list-ordered"
            title="排序"
            color="neutral"
            variant="outline"
            to="/posts/sorttable"
          />
        </div>
      </div>

      <!-- data-table -->
      <UTable
        v-model:sorting="sorting"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        :data="pagedPosts"
        :get-row-id="(post: Post) => String(post.id)"
        :ui="{
          tr: 'data-[selected=true]:shadow-[inset_2px_0_0_var(--ui-primary)]',
        }"
        :columns="columns"
        :sorting-options="{ manualSorting: true }"
        class="shrink-0"
      />

      <!-- data-table-footer -->
      <div
        class="mt-auto grid grid-cols-1 items-center gap-3 border-t border-default pt-4 sm:grid-cols-3"
      >
        <span class="text-sm text-muted">
          顯示第 {{ rangeStart }} 到 {{ rangeEnd }} 筆，共
          {{ filteredPosts.length }} 筆
        </span>

        <UFieldGroup class="sm:justify-self-center">
          <UBadge label="每頁" color="neutral" variant="outline" size="lg" />
          <USelect v-model="pageSize" :items="pageSizeOptions" class="w-20" />
        </UFieldGroup>

        <UPagination
          v-model:page="page"
          class="sm:justify-self-end"
          :sibling-count="1"
          :items-per-page="pageSize"
          :total="filteredPosts.length"
        />
      </div>

      <!-- modals -->
      <UModal
        v-model:open="deleteOpen"
        title="刪除文章"
        :ui="{ footer: 'justify-end' }"
      >
        <template #body>
          <template v-if="deleteTargets.length === 1">
            確定要刪除「{{ deleteTargets[0]?.title }}」嗎？此動作無法復原。
          </template>
          <template v-else>
            確定要刪除所選的
            {{ deleteTargets.length }} 篇文章嗎？此動作無法復原。
          </template>
        </template>
        <template #footer="{ close }">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            @click="close"
          />
          <UButton
            label="刪除"
            color="error"
            icon="i-lucide-trash"
            @click="confirmDelete"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
