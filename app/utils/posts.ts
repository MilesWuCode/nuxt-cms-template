export type PostStatus = 'published' | 'draft' | 'archived'

export interface Post {
  id: number
  title: string
  author: string
  category: string
  status: PostStatus
  views: number
  createdAt: string
}

export const postStatusOptions: { label: string; value: PostStatus }[] = [
  { label: '已發布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已封存', value: 'archived' },
]

export const postStatusColor: Record<
  PostStatus,
  'success' | 'warning' | 'neutral'
> = {
  published: 'success',
  draft: 'warning',
  archived: 'neutral',
}

export const categoryOptions = ['新聞', '科技', '生活', '娛樂', '體育']

const authors = ['王小明', '陳美玲', '林志豪', '張雅婷', '李大華']
const statuses: PostStatus[] = ['published', 'draft', 'archived']

// 文章列表假資料
export const posts: Post[] = Array.from({ length: 42 }, (_, i) => {
  const id = i + 1
  return {
    id,
    title: `範例文章標題 ${id}`,
    author: authors[i % authors.length]!,
    category: categoryOptions[i % categoryOptions.length]!,
    status: statuses[i % statuses.length]!,
    views: (id * 137) % 5000,
    createdAt: new Date(2026, 9, 23 - i).toISOString().slice(0, 10),
  }
})
