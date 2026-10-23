<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const breadcrumbItems: BreadcrumbItem[] = [
  { label: '文章列表', to: '/posts' },
  { label: '新增文章' },
]
</script>

<template>
  <UDashboardPanel id="posts-create">
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
      <div class="mx-auto w-full max-w-3xl">
        <PostForm submit-label="新增" @submit="navigateTo('/posts')" />
      </div>
    </template>
  </UDashboardPanel>
</template>
