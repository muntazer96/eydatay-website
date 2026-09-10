<script setup lang="ts">
withDefaults(
  defineProps<{
    tagline?: boolean
    light?: boolean
    compact?: boolean
  }>(),
  {
    tagline: false,
    light: false,
    compact: false,
  },
)
</script>

<template>
  <NuxtLink to="/" class="ey-logo" :aria-label="'عيادتي — الصفحة الرئيسية'">
    <span class="ey-logo__mark" :class="{ 'ey-logo__mark--light': light }">
      <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
        <rect width="64" height="64" rx="16" :fill="light ? '#0b5c51' : '#13796b'" />
        <path
          d="M32 48S14 38 14 24.8C14 18.8 18.4 15 23.4 15c3.7 0 6.8 2 8.6 5 1.8-3 4.9-5 8.6-5 5 0 9.4 3.8 9.4 9.8C50 38 32 48 32 48Z"
          fill="none"
          stroke="#fff"
          stroke-width="4"
          stroke-linejoin="round"
        />
        <path
          d="M18 31h8l3-7 6 15 4-8h7"
          fill="none"
          stroke="#fff"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="ey-logo__text" :class="{ 'ey-logo__text--light': light }">
      <span class="ey-logo__name">عيادتي</span>
      <span v-if="tagline" class="ey-logo__tag">طبيبك أقرب مما تتوقع</span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.ey-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: var(--radius-md);
}

.ey-logo__mark {
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;
}

.ey-logo__mark--light svg rect {
  fill: #ffffff;
}

.ey-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.ey-logo__name {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.ey-logo__text--light .ey-logo__name {
  color: #ffffff;
}

.ey-logo__tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.ey-logo__text--light .ey-logo__tag {
  color: rgba(255, 255, 255, 0.75);
}
</style>