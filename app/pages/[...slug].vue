<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()

// 有上一頁就返回，沒有就回到儀表板
function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    navigateTo('/dashboard')
  }
}
</script>

<template>
  <UError
    :error="{ statusCode: 404, statusMessage: '找不到頁面', message: '你要找的頁面不存在或已被移除。' }"
    :clear="false"
  >
    <template #links>
      <UButton label="上一頁" icon="i-lucide-arrow-left" size="lg" @click="goBack" />
    </template>
  </UError>
</template>
