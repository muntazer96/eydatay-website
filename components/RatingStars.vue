<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rating: number | null | undefined
    size?: number
    reviewCount?: number
  }>(),
  {
    rating: null,
    size: 20,
    reviewCount: 0,
  },
)

const stars = computed(() => {
  const value = props.rating ?? 0
  return [1, 2, 3, 4, 5].map((i) => {
    const fraction = Math.max(0, Math.min(1, value - (i - 1)))
    return fraction >= 0.75
      ? 'full'
      : fraction > 0.3
        ? 'half'
        : 'empty'
  })
})
</script>

<template>
  <span v-if="rating !== null && rating !== undefined" class="rating">
    <span class="rating__stars" role="img" :aria-label="`التقييم ${rating.toFixed(1)} من 5`">
      <BaseIcon
        v-for="(star, i) in stars"
        :key="i"
        :name="star === 'half' ? 'star-half-full' : 'star'"
        :size="size"
        :color="star === 'empty' ? '#dbe5e2' : '#e8a33d'"
      />
    </span>
    <strong class="rating__value">{{ rating.toFixed(1) }}</strong>
    <span v-if="reviewCount" class="rating__count">({{ reviewCount }})</span>
  </span>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.rating__stars {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.rating__value {
  font-weight: 800;
  font-size: 14px;
  color: var(--color-text);
}

.rating__count {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>