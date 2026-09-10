<script setup lang="ts">
const route = useRoute()

const slug = computed(() => String(route.params.governorate ?? ''))

const {
  data: province,
  pending,
  error,
} = await useAsyncData(`governorate-${slug.value}`, () => findProvinceBySlug(slug.value).then((p) => p ?? null))

if (error.value || !province.value) {
  throw createError({ statusCode: 404, statusMessage: 'المحافظة غير موجودة', fatal: true })
}

useHead({
  title: `أطباء في ${province.value!.name}`,
  meta: [
    {
      name: 'description',
      content: `قائمة الأطباء المتاحين في ${province.value!.name} عبر عيادتي — اعرف العنوان، أوقات الدوام، التقييمات ومعلومات الحجز.`,
    },
    { property: 'og:title', content: `أطباء في ${province.value!.name} | عيادتي` },
    { property: 'og:url', content: siteUrl(`/doctors/governorate/${slug.value}`) },
  ],
  link: [{ rel: 'canonical', href: siteUrl(`/doctors/governorate/${slug.value}`) }],
})

const listingKey = computed(() => `doctors-prov-${province.value!.id}`)
</script>

<template>
  <main>
    <div v-if="pending" class="container listing-page"><StateSkeleton :count="6" /></div>
    <div v-else-if="province" class="container listing-page">
      <div class="page-hero">
        <h1 class="page-hero__title">أطباء في {{ province.name }}</h1>
        <p class="page-hero__subtitle">
          اكتشف الأطباء المتاحين في محافظة {{ province.name }} مع معلومات العيادة والحجز.
        </p>
      </div>

      <DoctorsListing :key="listingKey" :heading="`prov-${province.id}`" :fixed-province="province.id" />
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