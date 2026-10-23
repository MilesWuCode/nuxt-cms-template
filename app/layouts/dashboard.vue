<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const userMenuItems: DropdownMenuItem[][] = [
  [{ label: '個人資料', icon: 'i-lucide-user', to: '/profile' }],
  [{ label: '登出', icon: 'i-lucide-log-out', to: '/' }],
]

// 通知
const notificationsOpen = ref(false)
const notificationItems = ref<AppNotification[]>([...notifications])
const unreadCount = computed(
  () => notificationItems.value.filter((n) => !n.read).length,
)

const notificationMenu = computed<NavigationMenuItem[]>(() => [
  {
    label: '通知',
    icon: 'i-lucide-bell',
    slot: 'notifications' as const,
    badge: unreadCount.value || undefined,
    active: notificationsOpen.value,
    onSelect: () => {
      notificationsOpen.value = true
    },
  },
])
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

        <UNavigationMenu
          :collapsed="collapsed"
          :items="notificationMenu"
          orientation="vertical"
          tooltip
        >
          <!-- 收合時看不到數字，改在鈴鐺上顯示紅點 -->
          <template #notifications-leading="{ active, ui }">
            <UChip :show="collapsed && unreadCount > 0" color="error" inset>
              <UIcon
                name="i-lucide-bell"
                :class="ui.linkLeadingIcon({ active })"
              />
            </UChip>
          </template>
        </UNavigationMenu>
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

    <NotificationsSlideover
      v-model:open="notificationsOpen"
      v-model:items="notificationItems"
    />
  </UDashboardGroup>
</template>
