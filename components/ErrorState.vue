<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    retryable?: boolean
  }>(),
  {
    message: 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
    retryable: true,
  },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state-box" role="alert">
    <span class="state-box__icon state-box__icon--error">
      <BaseIcon name="alert-circle-outline" :size="34" />
    </span>
    <h3 class="state-box__title">تعذر تحميل البيانات</h3>
    <p class="state-box__message">{{ message }}</p>
    <button v-if="retryable" type="button" class="btn btn--secondary" @click="emit('retry')">
      <BaseIcon name="refresh" :size="18" />
      إعادة المحاولة
    </button>
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

.state-box__icon--error {
  background: var(--color-error-light);
  color: var(--color-error);
}

.state-box__title {
  font-size: 20px;
  color: var(--color-text);
}

.state-box__message {
  max-width: 440px;
  color: var(--color-text-muted);
  line-height: 1.7;
}
</style>