<script setup lang="ts">
import type { SpecializationDto } from '~/types'
import { specializationSlug } from '~/utils/slug'

const { data: specializations } = await useAsyncData<SpecializationDto[]>('specializations-page', () =>
  getSpecializations(),
)

const grouped = computed(() => {
  const list = specializations.value ?? []
  const byLetter = new Map<string, SpecializationDto[]>()
  for (const spec of list) {
    const letter = spec.name.charAt(0)
    const bucket = byLetter.get(letter) ?? []
    bucket.push(spec)
    byLetter.set(letter, bucket)
  }
  return byLetter
})

useHead({
  title: 'التخصصات الطبية',
  meta: [
    {
      name: 'description',
      content: 'تصفح جميع التخصصات الطبية المتوفرة في عيادتي للعثور على الطبيب المناسب لك في العراق.',
    },
    { property: 'og:title', content: 'التخصصات الطبية | عيادتي' },
    { property: 'og:url', content: siteUrl('/specializations') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/specializations') }],
})
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-hero__title">التخصصات الطبية</h1>
        <p class="page-hero__subtitle">تصفح حسب أي تخصص للوصول إلى أفضل أطباء في العراق.</p>
      </div>
    </section>

    <section v-if="specializations?.length" class="section">
      <div class="container">
        <div class="grid grid--specializations">
          <NuxtLink
            v-for="spec in specializations"
            :key="spec.id"
            :to="`/doctors/${specializationSlug(spec.normalizedName)}`"
            class="spec card card--hover"
            @click="useAnalytics().trackSpecializationSearch(spec.id)"
          >
            <span class="spec__icon">
              <BaseIcon :name="specializationIconName(spec.normalizedName)" :size="26" />
            </span>
            <span class="spec__name">{{ spec.name }}</span>
            <BaseIcon class="spec__arrow" name="chevron-left" :size="18" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-else class="section">
      <div class="container">
        <ErrorState message="تعذر تحميل التخصصات حالياً." />
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  background: linear-gradient(160deg, var(--color-primary-soft) 0%, #f6f9f8 60%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border-light);
  text-align: center;
  padding-block: clamp(32px, 6vw, 64px);
}

.page-hero__title {
  font-size: clamp(26px, 4.5vw, 40px);
}

.page-hero__subtitle {
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.spec {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.spec__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.spec__name {
  font-weight: 700;
  font-size: 15px;
  color: var(--color-text);
  flex: 1;
}

.spec__arrow {
  color: var(--color-text-muted);
  transition: transform 0.2s ease, color 0.2s ease;
}

.spec:hover .spec__arrow {
  color: var(--color-primary);
  transform: translateX(-3px);
}
</style>