<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <UDashboardPanel id="settings">
    <template #header>
      <UDashboardNavbar title="一般設定">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-3xl">
        <UPageCard title="外觀" description="調整後台的顯示方式" variant="subtle">
          <UFormField
            name="colorMode"
            label="外觀模式"
            description="選擇淺色、深色，或跟隨系統設定"
            class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
          >
            <UColorModeSelect class="sm:w-48" />
          </UFormField>
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
