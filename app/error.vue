<script setup lang="ts">
import type { NuxtError } from '#app'
import { zh_tw } from '@nuxt/ui/locale'

defineProps<{ error: NuxtError }>()

const router = useRouter()

// 有上一頁就返回，沒有就回到儀表板
async function goBack() {
  if (window.history.state?.back) {
    await clearError()
    router.back()
  } else {
    await clearError({ redirect: '/dashboard' })
  }
}
</script>

<template>
  <UApp :locale="zh_tw">
    <UError :error="error" :clear="false">
      <template #links>
        <UButton
          label="上一頁"
          icon="i-lucide-arrow-left"
          size="lg"
          @click="goBack"
        />
      </template>
    </UError>
  </UApp>
</template>
