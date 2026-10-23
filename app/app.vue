<script setup lang="ts">
import { zh_tw } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="zh_tw">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
