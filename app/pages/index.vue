<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: '請輸入 Email',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: '密碼',
    placeholder: '請輸入密碼',
    required: true,
  },
  {
    name: 'remember',
    type: 'checkbox',
    label: '記住我',
  },
]

const schema = z.object({
  email: z.email('Email 格式不正確'),
  password: z.string('請輸入密碼').min(8, '密碼至少 8 個字元'),
})

type Schema = z.output<typeof schema>

function onSubmit(_event: FormSubmitEvent<Schema>) {
  navigateTo('/dashboard')
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      :fields="fields"
      title="登入後台"
      description="請輸入帳號密碼以登入 CMS"
      icon="i-lucide-lock"
      :submit="{ label: '登入' }"
      @submit="onSubmit"
    >
      <template #password-hint>
        <ULink to="/forget-password" class="font-medium text-primary">
          忘記密碼？
        </ULink>
      </template>
    </UAuthForm>
  </UPageCard>
</template>
