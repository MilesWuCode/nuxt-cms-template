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
  { label: '檢視' },
]

const statusLabel = postStatusOptions.find(
  (o) => o.value === post.status,
)?.label

// 檢視頁假資料
const detail = {
  slug: `sample-post-${post.id}`,
  summary: '這是一段範例摘要，用來展示檢視頁的內容。',
  content:
    '這是範例文章內容。\n\n檢視頁只顯示資料、不能編輯，要修改請按右上角的「編輯」。目前只是切版用的假資料。',
  tags: ['Nuxt', 'Vue'],
  keywords: ['nuxt ui', 'cms'],
  publishedAt: `${post.createdAt} 09:30`,
  updatedAt: `${post.createdAt} 18:12`,
  featured: true,
  allowComments: false,
  channels: ['網站', '電子報'],
}

const infoRows = [
  { label: '網址代稱', value: `/posts/${detail.slug}` },
  { label: '分類', value: post.category },
  { label: '發布時間', value: detail.publishedAt },
  { label: '最後更新', value: detail.updatedAt },
  { label: '瀏覽數', value: post.views.toLocaleString('zh-TW') },
]
</script>

<template>
  <UDashboardPanel id="posts-view">
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
            icon="i-lucide-pencil"
            label="編輯"
            :to="`/posts/${post.id}/edit`"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-6 lg:col-span-2">
          <UPageCard variant="subtle">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                :label="statusLabel"
                :color="postStatusColor[post.status]"
                variant="subtle"
              />
              <UBadge
                v-if="detail.featured"
                label="精選"
                icon="i-lucide-star"
                color="primary"
                variant="outline"
              />
            </div>
            <h1 class="text-2xl font-bold text-highlighted">
              {{ post.title }}
            </h1>
            <p class="text-muted">{{ detail.summary }}</p>
            <USeparator />
            <p class="whitespace-pre-line text-default">{{ detail.content }}</p>
          </UPageCard>

          <UPageCard title="標籤與關鍵字" variant="subtle">
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in detail.tags"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="subtle"
              />
              <UBadge
                v-for="keyword in detail.keywords"
                :key="keyword"
                :label="`#${keyword}`"
                color="neutral"
                variant="outline"
              />
            </div>
          </UPageCard>
        </div>

        <div class="flex flex-col gap-6">
          <UPageCard title="作者" variant="subtle">
            <UUser
              :name="post.author"
              description="內容編輯"
              :avatar="{ src: `https://i.pravatar.cc/80?u=${post.author}` }"
            />
          </UPageCard>

          <UPageCard title="文章資訊" variant="subtle">
            <dl class="flex flex-col gap-3 text-sm">
              <div
                v-for="row in infoRows"
                :key="row.label"
                class="flex justify-between gap-4"
              >
                <dt class="text-muted">{{ row.label }}</dt>
                <dd class="text-right text-highlighted">{{ row.value }}</dd>
              </div>
            </dl>
          </UPageCard>

          <UPageCard title="發布設定" variant="subtle">
            <dl class="flex flex-col gap-3 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-muted">發布管道</dt>
                <dd class="text-highlighted">
                  {{ detail.channels.join('、') }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-muted">允許留言</dt>
                <dd>
                  <UIcon
                    :name="
                      detail.allowComments
                        ? 'i-lucide-circle-check'
                        : 'i-lucide-circle-x'
                    "
                    :class="
                      detail.allowComments ? 'text-success' : 'text-error'
                    "
                    class="size-5"
                  />
                </dd>
              </div>
            </dl>
          </UPageCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
