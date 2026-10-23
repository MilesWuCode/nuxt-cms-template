import type { NavigationMenuItem } from '@nuxt/ui'

// 左側目錄假資料（二層）
export const sidebarItems: NavigationMenuItem[][] = [
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-chart-pie',
      to: '/dashboard',
    },
    {
      label: '文章管理',
      icon: 'i-lucide-file-text',
      defaultOpen: true,
      children: [{ label: '文章列表', to: '/posts' }],
    },
    {
      label: '分類管理',
      icon: 'i-lucide-folder',
      children: [
        { label: '分類列表', to: '/categories' },
        { label: '標籤列表', to: '/tags' },
      ],
    },
    {
      label: '使用者',
      icon: 'i-lucide-users',
      children: [
        { label: '使用者列表', to: '/users' },
        { label: '角色權限', to: '/roles' },
      ],
    },
  ],
  [
    {
      label: '系統設定',
      icon: 'i-lucide-settings',
      children: [
        { label: '一般設定', to: '/settings' },
        { label: '通知設定', to: '/settings/notifications' },
      ],
    },
  ],
]
