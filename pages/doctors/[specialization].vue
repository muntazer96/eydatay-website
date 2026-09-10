<script setup lang="ts">
const route = useRoute()

const slug = computed(() => String(route.params.specialization ?? ''))

const {
  data: spec,
  pending,
  error,
} = await useAsyncData(`specialization-${slug.value}`, () => findSpecializationBySlug(slug.value).then((s) => s ?? null))

if (error.value || !spec.value) {
  throw createError({ statusCode: 404, statusMessage: 'التخصص غير موجود', fatal: true })
}

useHead({
  title: `أطباء ${spec.value!.name}`,
  meta: [
    {
      name: 'description',
      content: `قائمة أطباء ${spec.value!.name} المنسقية في العراق — معلومات الدوام، العيادات، التقييمات والحجز عبر عيادتي.`,
    },
    { property: 'og:title', content: `أطباء ${spec.value!.name} في العراق | عيادتي` },
    { property: 'og:url', content: siteUrl(`/doctors/${slug.value}`) },
  ],
  link: [{ rel: 'canonical', href: siteUrl(`/doctors/${slug.value}`) }],
})

const listingKey = computed(() => `doctors-spec-${spec.value!.id}`)
</script>

<template>
  <main>
    <div v-if="pending" class="container listing-page"><StateSkeleton :count="6" /></div>
    <div v-else-if="spec" class="container listing-page">
      <div class="page-hero">
        <h1 class="page-hero__title">أطباء {{ spec.name }}</h1>
        <p class="page-hero__subtitle">
          قائمة الأطباء المتاحين في عيادتي ضمن تخصص {{ spec.name }}.
        </p>
      </div>

      <DoctorsListing :key="listingKey" :heading="`spec-${spec.id}`" :fixed-specialization="spec.id" />
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