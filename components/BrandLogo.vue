<script setup lang="ts">
const props = withDefaults(
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

const logoSrc = computed(() => publicAssetUrl(props.light ? '/onColorsBG.png' : '/onWhiteBG.png'))
</script>

<template>
  <NuxtLink to="/" class="ey-logo" :aria-label="'عيادتي — الصفحة الرئيسية'">
    <span class="ey-logo__mark" :class="{ 'ey-logo__mark--light': light }">
      <img :src="logoSrc" alt="" width="52" height="52" />
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

.ey-logo__mark img {
  display: block;
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 8px;
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
