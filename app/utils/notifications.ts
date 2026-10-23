export interface AppNotification {
  id: number
  title: string
  body: string
  icon: string
  time: string
  read: boolean
}

// 通知假資料
export const notifications: AppNotification[] = [
  {
    id: 1,
    title: '新留言',
    body: '陳美玲在「範例文章標題 2」留言',
    icon: 'i-lucide-message-circle',
    time: '5 分鐘前',
    read: false,
  },
  {
    id: 2,
    title: '文章待審核',
    body: '林志豪送出「範例文章標題 3」等待審核',
    icon: 'i-lucide-file-clock',
    time: '20 分鐘前',
    read: false,
  },
  {
    id: 3,
    title: '新使用者註冊',
    body: '有 3 位新使用者完成註冊',
    icon: 'i-lucide-user-plus',
    time: '1 小時前',
    read: false,
  },
  {
    id: 4,
    title: '文章已發布',
    body: '「範例文章標題 1」已排程發布',
    icon: 'i-lucide-send',
    time: '3 小時前',
    read: false,
  },
  {
    id: 5,
    title: '瀏覽數突破',
    body: '「範例文章標題 36」瀏覽數突破 4,000',
    icon: 'i-lucide-trending-up',
    time: '昨天',
    read: false,
  },
  {
    id: 6,
    title: '系統更新',
    body: '後台將於今晚 23:00 進行維護',
    icon: 'i-lucide-wrench',
    time: '昨天',
    read: false,
  },
  {
    id: 7,
    title: '密碼已變更',
    body: '你的帳號密碼已於 10/20 變更',
    icon: 'i-lucide-key-round',
    time: '3 天前',
    read: true,
  },
]
