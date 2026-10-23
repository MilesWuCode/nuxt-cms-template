<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { moveArrayElement, useSortable } from '@vueuse/integrations/useSortable'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()

const breadcrumbItems: BreadcrumbItem[] = [
  { label: '文章列表', to: '/posts' },
  { label: '排序' },
]

// 排序用的假資料（只在這頁有效）
const list = ref<Post[]>([...posts])
const originalOrder = posts.map((post) => post.id)

const changed = computed(() =>
  list.value.some((post, index) => post.id !== originalOrder[index]),
)

// 拖曳握把才能拖，避免點按鈕時誤拖
const listEl = useTemplateRef<HTMLElement>('listEl')
useSortable(listEl, list, {
  handle: '[data-drag-handle]',
  animation: 150,
})

function move(from: number, to: number) {
  if (to < 0 || to >= list.value.length) return
  moveArrayElement(list, from, to)
}

function reset() {
  list.value = [...posts]
}

function save() {
  toast.add({ title: '排序已儲存', color: 'success' })
  navigateTo('/posts')
}
</script>

<template>
  <UDashboardPanel id="posts-sort">
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
            label="還原"
            color="neutral"
            variant="outline"
            :disabled="!changed"
            @click="reset"
          />
          <UButton
            label="儲存排序"
            icon="i-lucide-save"
            :disabled="!changed"
            @click="save"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-3xl">
        <p class="mb-3 text-sm text-muted">
          拖曳左側握把調整順序，或使用右側箭頭上下移動。
        </p>

        <ul
          ref="listEl"
          class="divide-y divide-default rounded-lg ring ring-default"
        >
          <li
            v-for="(post, index) in list"
            :key="post.id"
            class="flex items-center gap-3 bg-default px-3 py-2 first:rounded-t-lg last:rounded-b-lg"
          >
            <UButton
              data-drag-handle
              icon="i-lucide-grip-vertical"
              color="neutral"
              variant="ghost"
              class="cursor-grab active:cursor-grabbing"
              aria-label="拖曳排序"
            />
            <span class="w-6 text-right text-sm text-dimmed tabular-nums">
              {{ index + 1 }}
            </span>
            <span class="min-w-0 flex-1 truncate text-sm text-highlighted">
              {{ post.title }}
            </span>
            <UBadge
              :label="
                postStatusOptions.find((o) => o.value === post.status)?.label
              "
              :color="postStatusColor[post.status]"
              variant="subtle"
            />
            <div class="flex">
              <UButton
                icon="i-lucide-arrow-up"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="index === 0"
                aria-label="上移"
                @click="move(index, index - 1)"
              />
              <UButton
                icon="i-lucide-arrow-down"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="index === list.length - 1"
                aria-label="下移"
                @click="move(index, index + 1)"
              />
            </div>
          </li>
        </ul>
      </div>
    </template>
  </UDashboardPanel>
</template>
