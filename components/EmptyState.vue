<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title?: string
    message?: string
    actionLabel?: string
    actionTo?: string
  }>(),
  {
    icon: 'magnify-close',
    title: 'لا توجد نتائج',
    message: 'جرّب تعديل البحث أو إعادة تعيين الفلاتر.',
    actionLabel: 'إعادة تعيين',
    actionTo: '',
  },
)
</script>

<template>
  <div class="state-box" role="status">
    <span class="state-box__icon">
      <BaseIcon :name="icon" :size="34" />
    </span>
    <h3 class="state-box__title">{{ title }}</h3>
    <p class="state-box__message">{{ message }}</p>
    <NuxtLink v-if="actionLabel && actionTo" :to="actionTo" class="btn btn--secondary">
      {{ actionLabel }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.state-box__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.state-box__title {
  font-size: 20px;
  color: var(--color-text);
}

.state-box__message {
  max-width: 420px;
  color: var(--color-text-muted);
  line-height: 1.7;
}
</style>