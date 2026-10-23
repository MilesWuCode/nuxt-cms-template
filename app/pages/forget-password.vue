<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: '請輸入註冊時的 Email',
    required: true,
  },
]

const schema = z.object({
  email: z.email('Email 格式不正確'),
})

type Schema = z.output<typeof schema>

// 送出後切換成「已寄出」畫面
const sentTo = ref<string>()

function onSubmit(event: FormSubmitEvent<Schema>) {
  sentTo.value = event.data.email
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      v-if="!sentTo"
      :schema="schema"
      :fields="fields"
      title="忘記密碼"
      description="輸入你的 Email，我們會寄送重設密碼連結給你"
      icon="i-lucide-key-round"
      :submit="{ label: '寄送重設連結' }"
      @submit="onSubmit"
    >
      <template #footer>
        想起密碼了？
        <ULink to="/" class="font-medium text-primary">返回登入</ULink>
      </template>
    </UAuthForm>

    <div v-else class="flex flex-col items-center gap-4 text-center">
      <UIcon name="i-lucide-mail-check" class="size-10 text-primary" />
      <div>
        <h1 class="text-xl font-semibold text-highlighted">請檢查你的信箱</h1>
        <p class="mt-1 text-muted">
          重設密碼連結已寄送至
          <span class="font-medium text-highlighted">{{ sentTo }}</span>
        </p>
      </div>
      <UButton label="返回登入" to="/" block />
      <UButton
        label="沒收到信？重新寄送"
        color="neutral"
        variant="link"
        @click="sentTo = undefined"
      />
    </div>
  </UPageCard>
</template>
