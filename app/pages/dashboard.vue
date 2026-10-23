<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

// 儀表板假資料
const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
]

const pageViews = months.map((month, i) => ({
  month,
  views: 3200 + i * 420 + (i % 3) * 600,
  visitors: 1800 + i * 260 + (i % 2) * 300,
}))

const trafficSources = months.map((month, i) => ({
  month,
  search: 1200 + i * 150,
  social: 800 + (i % 4) * 220,
  direct: 500 + i * 60,
}))

const categoryPosts = categoryOptions.map((category, i) => ({
  category,
  count: [42, 35, 28, 19, 24][i]!,
}))

const weeklyPosts = [
  '週一',
  '週二',
  '週三',
  '週四',
  '週五',
  '週六',
  '週日',
].map((day, i) => ({
  day,
  published: [6, 8, 5, 9, 7, 3, 2][i]!,
  draft: [3, 2, 4, 2, 5, 1, 1][i]!,
}))

const statusCounts = postStatusOptions.map((option) => ({
  status: option.label,
  count: posts.filter((post) => post.status === option.value).length,
}))

const signups = months.map((month, i) => ({
  month,
  users: [120, 135, 160, 150, 190, 230, 260, 245, 300, 340][i]!,
}))

const formatNumber = (value: number) => value.toLocaleString('zh-TW')
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UPageCard title="每月瀏覽數" description="Line" variant="subtle">
          <UChart
            type="line"
            :data="pageViews"
            index="month"
            :categories="[
              { key: 'views', label: '瀏覽數' },
              { key: 'visitors', label: '訪客數' },
            ]"
            curve="monotone"
            points
            :format="formatNumber"
            :height="220"
          />
        </UPageCard>

        <UPageCard title="流量來源" description="Stacked area" variant="subtle">
          <UChart
            type="area"
            :data="trafficSources"
            index="month"
            :categories="[
              { key: 'search', label: '搜尋' },
              { key: 'social', label: '社群' },
              { key: 'direct', label: '直接' },
            ]"
            stacked
            curve="monotone"
            :format="formatNumber"
            :height="220"
          />
        </UPageCard>

        <UPageCard title="各分類文章數" description="Bar" variant="subtle">
          <UChart
            type="bar"
            :data="categoryPosts"
            index="category"
            :categories="[{ key: 'count', label: '文章數' }]"
            :height="220"
          />
        </UPageCard>

        <UPageCard
          title="本週發布量"
          description="Stacked bar"
          variant="subtle"
        >
          <UChart
            type="bar"
            :data="weeklyPosts"
            index="day"
            :categories="[
              { key: 'published', label: '已發布' },
              { key: 'draft', label: '草稿' },
            ]"
            stacked
            :height="220"
          />
        </UPageCard>

        <UPageCard title="文章狀態" description="Donut" variant="subtle">
          <UChart
            type="donut"
            :data="statusCounts"
            index="status"
            :categories="[{ key: 'count', label: '文章數' }]"
            :colors="['success', 'warning', 'neutral']"
            :height="220"
          >
            <template #center>
              <span class="text-2xl font-semibold text-highlighted">
                {{ posts.length }}
              </span>
              <span class="text-muted">篇文章</span>
            </template>
          </UChart>
        </UPageCard>

        <UPageCard
          title="新註冊使用者"
          description="Step line"
          variant="subtle"
        >
          <UChart
            type="line"
            :data="signups"
            index="month"
            :categories="[{ key: 'users', label: '新使用者', color: 'info' }]"
            curve="step"
            :height="220"
          />
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
