<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const props = defineProps<{
  initialState?: Partial<PostFormState>
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: PostFormState]
}>()

const schema = z.object({
  title: z.string('請輸入標題').min(2, '標題至少 2 個字元'),
  slug: z
    .string('請輸入網址代稱')
    .regex(/^[a-z0-9-]+$/, '只能包含小寫英文、數字與 -'),
  summary: z.string().max(200, '摘要最多 200 字').optional(),
  content: z.string('請輸入內容').min(10, '內容至少 10 個字元'),
  category: z.string('請選擇分類'),
  tags: z.array(z.string()),
  keywords: z.array(z.string()),
  status: z.enum(['published', 'draft', 'archived']),
  publishDate: z.custom<CalendarDate>().optional(),
  publishTime: z.any().optional(),
  priority: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  featured: z.boolean(),
  allowComments: z.boolean(),
  channels: z.array(z.string()),
  themeColor: z.string(),
  cover: z.any().optional(),
  accessCode: z.array(z.string()),
})

export type PostFormState = z.output<typeof schema>

// reactive() 會把 CalendarDate 等 class 型別展開成一般物件型別，這裡轉回原本的表單型別
const state = reactive({
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: undefined,
  tags: [],
  keywords: [],
  status: 'draft',
  publishDate: undefined,
  priority: 50,
  rating: 0,
  featured: false,
  allowComments: true,
  channels: ['web'],
  themeColor: '#00C16A',
  cover: undefined,
  accessCode: [],
  ...props.initialState,
}) as Partial<PostFormState>

const tagOptions = ['Nuxt', 'Vue', 'TypeScript', 'Tailwind', 'CMS', 'AI']
const channelOptions = [
  { label: '網站', value: 'web' },
  { label: 'App', value: 'app' },
  { label: '電子報', value: 'newsletter' },
]

const toast = useToast()

function onSubmit(event: FormSubmitEvent<PostFormState>) {
  toast.add({
    title: '儲存成功',
    description: event.data.title,
    color: 'success',
  })
  emit('submit', event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
    <UPageCard
      title="基本資訊"
      description="文章標題、網址與內容"
      variant="subtle"
    >
      <UFormField name="title" label="標題" required>
        <UInput
          v-model="state.title"
          placeholder="請輸入文章標題"
          class="w-full"
        />
      </UFormField>

      <UFormField
        name="slug"
        label="網址代稱"
        description="會出現在文章網址中"
        required
      >
        <UInput
          v-model="state.slug"
          placeholder="my-first-post"
          :ui="{ base: 'pl-16', leading: 'pointer-events-none' }"
          class="w-full"
        >
          <template #leading>
            <span class="text-sm text-muted">/posts/</span>
          </template>
        </UInput>
      </UFormField>

      <UFormField
        name="summary"
        label="摘要"
        :hint="`${state.summary?.length ?? 0}/200`"
      >
        <UTextarea
          v-model="state.summary"
          :rows="2"
          autoresize
          class="w-full"
        />
      </UFormField>

      <UFormField name="content" label="內容" required>
        <UTextarea v-model="state.content" :rows="8" class="w-full" />
      </UFormField>
    </UPageCard>

    <UPageCard title="分類與標籤" variant="subtle">
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField name="category" label="分類 (USelect)" required>
          <USelect
            v-model="state.category"
            :items="categoryOptions"
            placeholder="請選擇分類"
            class="w-full"
          />
        </UFormField>

        <UFormField name="tags" label="標籤 (USelectMenu)">
          <USelectMenu
            v-model="state.tags"
            :items="tagOptions"
            multiple
            placeholder="選擇標籤"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField
        name="keywords"
        label="SEO 關鍵字 (UInputTags)"
        description="輸入後按 Enter 新增"
      >
        <UInputTags
          v-model="state.keywords"
          placeholder="新增關鍵字"
          class="w-full"
        />
      </UFormField>
    </UPageCard>

    <UPageCard title="發布設定" variant="subtle">
      <UFormField name="status" label="狀態 (URadioGroup)">
        <URadioGroup
          v-model="state.status"
          :items="postStatusOptions"
          orientation="horizontal"
        />
      </UFormField>

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField name="publishDate" label="發布日期 (UInputDate)">
          <UInputDate v-model="state.publishDate" class="w-full" />
        </UFormField>

        <UFormField name="publishTime" label="發布時間 (UInputTime)">
          <UInputTime v-model="state.publishTime" class="w-full" />
        </UFormField>
      </div>

      <UFormField name="channels" label="發布管道 (UCheckboxGroup)">
        <UCheckboxGroup
          v-model="state.channels"
          :items="channelOptions"
          orientation="horizontal"
        />
      </UFormField>

      <UFormField name="featured" label="精選文章 (USwitch)">
        <USwitch v-model="state.featured" label="顯示在首頁精選區塊" />
      </UFormField>

      <UFormField name="allowComments">
        <UCheckbox v-model="state.allowComments" label="允許留言 (UCheckbox)" />
      </UFormField>
    </UPageCard>

    <UPageCard title="其他欄位" variant="subtle">
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          name="priority"
          :label="`排序權重 (USlider)：${state.priority}`"
        >
          <USlider v-model="state.priority" :min="0" :max="100" />
        </UFormField>

        <UFormField name="priority" label="排序權重 (UInputNumber)">
          <UInputNumber
            v-model="state.priority"
            :min="0"
            :max="100"
            class="w-full"
          />
        </UFormField>

        <UFormField name="rating" label="推薦程度 (UInputRating)">
          <UInputRating v-model="state.rating" />
        </UFormField>

        <UFormField name="accessCode" label="預覽密碼 (UPinInput)">
          <UPinInput v-model="state.accessCode" :length="4" />
        </UFormField>
      </div>

      <UFormField name="themeColor" label="主題色 (UColorPicker)">
        <div class="flex items-start gap-4">
          <UColorPicker v-model="state.themeColor" />
          <UBadge :label="state.themeColor" variant="outline" color="neutral" />
        </div>
      </UFormField>

      <UFormField name="cover" label="封面圖片 (UFileUpload)">
        <UFileUpload
          v-model="state.cover"
          accept="image/*"
          label="拖曳圖片到此處"
          description="PNG、JPG，最大 2MB"
          class="min-h-40 w-full"
        />
      </UFormField>
    </UPageCard>

    <div class="flex justify-end gap-2">
      <UButton label="取消" color="neutral" variant="subtle" to="/posts" />
      <UButton
        type="submit"
        :label="submitLabel ?? '儲存'"
        icon="i-lucide-save"
      />
    </div>
  </UForm>
</template>
