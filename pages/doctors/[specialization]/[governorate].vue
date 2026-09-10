<script setup lang="ts">
import type { ProvinceItemDto, SpecializationDto } from '~/types'

const route = useRoute()

const specSlug = computed(() => String(route.params.specialization ?? ''))
const provSlug = computed(() => String(route.params.governorate ?? ''))

const specResult = await useAsyncData<SpecializationDto | null>(
  `combo-spec-${specSlug.value}`,
  () => findSpecializationBySlug(specSlug.value).then((s) => s ?? null),
)

const provResult = await useAsyncData<ProvinceItemDto | null>(
  `combo-prov-${provSlug.value}`,
  () => findProvinceBySlug(provSlug.value).then((p) => p ?? null),
)

if (specResult.error.value || !specResult.data.value || provResult.error.value || !provResult.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'الصفحة غير موجودة',
    fatal: true,
  })
}

const spec = specResult.data.value
const prov = provResult.data.value

useHead({
  title: `أطباء ${spec.name} في ${prov.name}`,
  meta: [
    {
      name: 'description',
      content: `قائمة أطباء ${spec.name} في ${prov.name} عبر عيادتي — اعرف العنوان، أوقات الدوام، التقييمات ومعلومات الحجز.`,
    },
    { property: 'og:title', content: `أطباء ${spec.name} في ${prov.name} | عيادتي` },
    { property: 'og:url', content: siteUrl(`/doctors/${specSlug.value}/${provSlug.value}`) },
  ],
  link: [{ rel: 'canonical', href: siteUrl(`/doctors/${specSlug.value}/${provSlug.value}`) }],
})

const listingKey = computed(() => `doctors-spec-${spec.id}-prov-${prov.id}`)
</script>

<template>
  <main>
    <div class="container listing-page">
      <div class="page-hero">
        <h1 class="page-hero__title">أطباء {{ spec.name }} في {{ prov.name }}</h1>
        <p class="page-hero__subtitle">
          اكتشف أطباء تخصص {{ spec.name }} في {{ prov.name }} مع معلومات العيادة والحجز.
        </p>
      </div>

      <DoctorsListing
        :key="listingKey"
        :heading="`combo-${spec.id}-${prov.id}`"
        :fixed-specialization="spec.id"
        :fixed-province="prov.id"
      />
    </div>
  </main>
</template>

<style scoped>
.listing-page {
  padding-block: var(--spacing-lg) var(--spacing-2xl);
}

.page-hero {
  text-align: center;
  padding-block: var(--spacing-xl);
}
</style>