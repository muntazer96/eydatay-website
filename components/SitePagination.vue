<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
    totalItems?: number
  }>(),
  {
    totalItems: 0,
  },
)

const emit = defineEmits<{
  change: [page: number]
}>()

const pages = computed(() => {
  const total = Math.max(1, props.totalPages)
  const current = Math.min(Math.max(1, props.page), total)
  const list: (number | '…')[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) list.push(i)
    return list
  }

  list.push(1)
  if (current > 3) list.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) list.push(i)
  if (current < total - 2) list.push('…')
  list.push(total)
  return list
})
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="التنقل بين الصفحات">
    <button
      type="button"
      class="pagination__btn"
      :disabled="page <= 1"
      :aria-label="'الصفحة السابقة'"
      @click="emit('change', page - 1)"
    >
      <BaseIcon name="chevron-right" :size="20" />
    </button>

    <template v-for="(p, i) in pages" :key="`${p}-${i}`">
      <span v-if="p === '…'" class="pagination__ellipsis">…</span>
      <button
        v-else
        type="button"
        class="pagination__btn"
        :class="{ 'pagination__btn--active': p === page }"
        :aria-current="p === page ? 'page' : undefined"
        @click="emit('change', p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      type="button"
      class="pagination__btn"
      :disabled="page >= totalPages"
      :aria-label="'الصفحة التالية'"
      @click="emit('change', page + 1)"
    >
      <BaseIcon name="chevron-left" :size="20" />
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: var(--spacing-2xl);
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  padding: 0 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 700;
  font-size: 15px;
  transition: all 0.15s ease;
}

.pagination__btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination__btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  color: var(--color-text-muted);
}
</style>