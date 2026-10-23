<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const items = defineModel<AppNotification[]>('items', { required: true })

const unreadCount = computed(() => items.value.filter((n) => !n.read).length)

function markAsRead(id: number) {
  items.value = items.value.map((n) => (n.id === id ? { ...n, read: true } : n))
}

function markAllAsRead() {
  items.value = items.value.map((n) => ({ ...n, read: true }))
}
</script>

<template>
  <USlideover v-model:open="open" title="通知">
    <template #body>
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm text-muted">{{ unreadCount }} 則未讀</span>
        <UButton
          label="全部標為已讀"
          color="neutral"
          variant="link"
          size="sm"
          :disabled="!unreadCount"
          @click="markAllAsRead"
        />
      </div>

      <button
        v-for="notification in items"
        :key="notification.id"
        type="button"
        class="-mx-3 flex w-[calc(100%+1.5rem)] items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-elevated/50"
        @click="markAsRead(notification.id)"
      >
        <UChip color="error" :show="!notification.read" inset class="shrink-0">
          <UAvatar :icon="notification.icon" size="md" />
        </UChip>

        <div class="min-w-0 flex-1 text-sm">
          <p class="flex items-center justify-between gap-2">
            <span
              class="font-medium"
              :class="notification.read ? 'text-muted' : 'text-highlighted'"
            >
              {{ notification.title }}
            </span>
            <time class="shrink-0 text-xs text-dimmed">
              {{ notification.time }}
            </time>
          </p>
          <p class="truncate text-dimmed">{{ notification.body }}</p>
        </div>
      </button>
    </template>
  </USlideover>
</template>
