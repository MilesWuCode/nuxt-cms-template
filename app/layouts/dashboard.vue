<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const userMenuItems: DropdownMenuItem[][] = [
  [{ label: '個人資料', icon: 'i-lucide-user', to: '/profile' }],
  [{ label: '登出', icon: 'i-lucide-log-out', to: '/' }],
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 font-bold text-highlighted">
          <UIcon name="i-lucide-layout-dashboard" class="size-6 text-primary" />
          <span v-if="!collapsed">Nuxt CMS</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="sidebarItems[0]"
          orientation="vertical"
          tooltip
          popover
        />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="sidebarItems[1]"
          orientation="vertical"
          tooltip
          popover
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'center' }"
          class="w-full"
        >
          <UButton
            :avatar="{ src: 'https://i.pravatar.cc/80?img=12' }"
            :label="collapsed ? undefined : 'Admin'"
            :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
