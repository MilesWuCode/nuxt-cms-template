<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()

// 個人資料
const profileSchema = z.object({
  avatar: z.string().optional(),
  name: z.string('請輸入姓名').min(2, '姓名至少 2 個字元'),
  username: z
    .string('請輸入帳號')
    .regex(/^[a-z0-9_]+$/, '只能包含小寫英文、數字與 _'),
  email: z.email('Email 格式不正確'),
  phone: z
    .string()
    .regex(/^09\d{8}$/, '手機號碼格式不正確')
    .or(z.literal('')),
  bio: z.string().max(160, '自我介紹最多 160 字').optional(),
})

type ProfileSchema = z.output<typeof profileSchema>

// 用戶假資料
const profile = reactive<Partial<ProfileSchema>>({
  avatar: 'https://i.pravatar.cc/160?img=12',
  name: 'Admin',
  username: 'admin',
  email: 'admin@example.com',
  phone: '0912345678',
  bio: '負責網站內容管理與編輯。',
})

const fileRef = useTemplateRef('fileRef')

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) profile.avatar = URL.createObjectURL(file)
}

function onProfileSubmit(event: FormSubmitEvent<ProfileSchema>) {
  toast.add({
    title: '個人資料已更新',
    description: event.data.name,
    color: 'success',
  })
}

// 修改密碼
const passwordSchema = z
  .object({
    current: z.string('請輸入目前密碼').min(8, '密碼至少 8 個字元'),
    new: z.string('請輸入新密碼').min(8, '密碼至少 8 個字元'),
    confirm: z.string('請再次輸入新密碼'),
  })
  .refine((data) => data.new === data.confirm, {
    message: '兩次輸入的密碼不一致',
    path: ['confirm'],
    // 目前密碼還沒填時也要檢查兩次新密碼是否一致
    when: ({ value }) => !!(value as Partial<PasswordSchema>).confirm,
  })

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined,
  confirm: undefined,
})

function onPasswordSubmit() {
  toast.add({ title: '密碼已更新', color: 'success' })
  Object.assign(password, {
    current: undefined,
    new: undefined,
    confirm: undefined,
  })
}
</script>

<template>
  <UDashboardPanel id="profile">
    <template #header>
      <UDashboardNavbar title="個人資料">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <UForm
          id="profile-form"
          :schema="profileSchema"
          :state="profile"
          @submit="onProfileSubmit"
        >
          <UPageCard
            title="基本資料"
            description="這些資訊會顯示在你發布的文章上"
            variant="naked"
            orientation="horizontal"
            class="mb-4"
          >
            <UButton
              form="profile-form"
              type="submit"
              label="儲存變更"
              class="w-fit lg:ms-auto"
            />
          </UPageCard>

          <UPageCard variant="subtle">
            <UFormField
              name="avatar"
              label="頭像"
              description="JPG、PNG 或 GIF，最大 1MB"
              class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
            >
              <div class="flex items-center gap-3">
                <UAvatar :src="profile.avatar" :alt="profile.name" size="lg" />
                <UButton
                  label="更換"
                  color="neutral"
                  @click="fileRef?.click()"
                />
                <input
                  ref="fileRef"
                  type="file"
                  class="hidden"
                  accept=".jpg, .jpeg, .png, .gif"
                  @change="onFileChange"
                />
              </div>
            </UFormField>

            <USeparator />

            <UFormField
              name="name"
              label="姓名"
              description="顯示在文章作者欄位"
              required
              class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
            >
              <UInput
                v-model="profile.name"
                autocomplete="off"
                class="sm:w-72"
              />
            </UFormField>

            <USeparator />

            <UFormField
              name="username"
              label="帳號"
              description="登入用，只能包含小寫英文、數字與 _"
              required
              class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
            >
              <UInput
                v-model="profile.username"
                autocomplete="off"
                class="sm:w-72"
              />
            </UFormField>

            <USeparator />

            <UFormField
              name="email"
              label="Email"
              description="用於登入與接收通知"
              required
              class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
            >
              <UInput
                v-model="profile.email"
                type="email"
                autocomplete="off"
                class="sm:w-72"
              />
            </UFormField>

            <USeparator />

            <UFormField
              name="phone"
              label="手機"
              description="選填"
              class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
            >
              <UInput
                v-model="profile.phone"
                type="tel"
                placeholder="09xxxxxxxx"
                class="sm:w-72"
              />
            </UFormField>

            <USeparator />

            <UFormField
              name="bio"
              label="自我介紹"
              description="簡短介紹自己，會顯示在作者頁面"
              :hint="`${profile.bio?.length ?? 0}/160`"
            >
              <UTextarea
                v-model="profile.bio"
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>
          </UPageCard>
        </UForm>

        <UPageCard
          title="修改密碼"
          description="變更密碼後需要重新登入"
          variant="subtle"
        >
          <UForm
            :schema="passwordSchema"
            :state="password"
            class="flex max-w-xs flex-col gap-4"
            @submit="onPasswordSubmit"
          >
            <UFormField name="current" label="目前密碼">
              <UInput
                v-model="password.current"
                type="password"
                class="w-full"
              />
            </UFormField>

            <UFormField name="new" label="新密碼">
              <UInput v-model="password.new" type="password" class="w-full" />
            </UFormField>

            <UFormField name="confirm" label="確認新密碼">
              <UInput
                v-model="password.confirm"
                type="password"
                class="w-full"
              />
            </UFormField>

            <UButton type="submit" label="更新密碼" class="w-fit" />
          </UForm>
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
