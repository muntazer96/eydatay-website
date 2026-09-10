<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    variant?: 'cards' | 'row' | 'profile'
  }>(),
  {
    count: 6,
    variant: 'cards',
  },
)
</script>

<template>
  <div v-if="variant === 'cards'" class="skeleton-grid grid grid--doctors" aria-hidden="true">
    <div v-for="i in count" :key="i" class="skeleton-card card">
      <div class="skeleton skeleton-card__media" />
      <div class="skeleton-card__body">
        <div class="skeleton skeleton-card__line skeleton-card__line--lg" />
        <div class="skeleton skeleton-card__line" />
        <div class="skeleton skeleton-card__line skeleton-card__line--sm" />
        <div class="skeleton skeleton-card__line skeleton-card__line--btn" />
      </div>
    </div>
  </div>
  <div v-else class="skeleton-grid" aria-hidden="true">
    <div v-for="i in count" :key="i" class="skeleton-card card skeleton-card--row">
      <div class="skeleton skeleton-card__avatar" />
      <div class="skeleton-card__body">
        <div class="skeleton skeleton-card__line skeleton-card__line--lg" />
        <div class="skeleton skeleton-card__line" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
}

.skeleton-card__media {
  aspect-ratio: 4 / 3;
  border-radius: 0;
  border-start-start-radius: var(--radius-lg);
  border-start-end-radius: var(--radius-lg);
}

.skeleton-card--row {
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.skeleton-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: var(--spacing-lg);
  flex: 1;
}

.skeleton-card--row .skeleton-card__body {
  padding: 0;
  gap: 8px;
}

.skeleton-card__line {
  height: 12px;
  border-radius: 999px;
}

.skeleton-card__line--lg {
  height: 18px;
  width: 60%;
}

.skeleton-card__line--sm {
  width: 40%;
}

.skeleton-card__line--btn {
  height: 42px;
  width: 100%;
  margin-top: 6px;
}
</style>