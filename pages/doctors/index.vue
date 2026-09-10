<script setup lang="ts">
import type { PageResult, ProvinceItemDto, PublicDoctorListDto, SpecializationDto } from '~/types'
import type { SearchDoctorsParams } from '~/utils/api'

// ── Query state (kept reactive so filters sync with the URL) ──
const route = useRoute()
const router = useRouter()

const page = ref(1)
const name = ref('')
const specialization = ref<number | ''>('')
const province = ref<number | ''>('')

function syncFromQuery() {
  page.value = Math.max(1, Number(route.query.page) || 1)
  name.value = String(route.query.name ?? '')
  const spec = route.query.specialization
  specialization.value = spec && spec !== '' ? String(spec) : ''
  const prov = route.query.province
  province.value = prov && prov !== '' ? String(prov) : ''
}

watch(
  () => route.fullPath,
  () => syncFromQuery(),
)

syncFromQuery()

function buildQuery(): Record<string, string> {
  const q: Record<string, string> = {}
  if (name.value) q.name = name.value
  if (specialization.value !== '') q.specialization = String(specialization.value)
  if (province.value !== '') q.province = String(province.value)
  if (page.value > 1) q.page = String(page.value)
  return q
}

function applyFilters() {
  useAnalytics().trackDoctorSearch({
    searchText: name.value || undefined,
    specializationId: specialization.value === '' ? undefined : Number(specialization.value),
    province: province.value === '' ? undefined : String(province.value),
  })
  page.value = 1
  router.push({ path: '/doctors', query: buildQuery() })
}

function changePage(newPage: number) {
  page.value = newPage
  router.push({ path: '/doctors', query: buildQuery() })
}

// ── Data ──
const { data: specializations } = await useAsyncData<SpecializationDto[]>('doctors-specializations', () =>
  getSpecializations(),
)

const { data: provinces } = await useAsyncData<ProvinceItemDto[]>('doctors-provinces', () => getProvinces())

const pageSize = 8

const searchParams = computed<SearchDoctorsParams>(() => {
  const p: SearchDoctorsParams = {}
  if (name.value.trim()) p.name = name.value.trim()
  if (specialization.value !== '') p.specialization = Number(specialization.value)
  if (province.value !== '') p.iraqiProvince = Number(province.value)
  p.page = page.value || 1
  p.pageSize = pageSize
  return p
})

const { data: doctorsData, pending, refresh: refreshDoctors, error: doctorsError } = await useAsyncData<
  PageResult<PublicDoctorListDto>
>(
  'doctors-list',
  () => searchDoctors(searchParams.value),
  { watch: [searchParams] },
)

const totalPages = computed(() => {
  const total = doctorsData.value?.totalItems ?? 0
  return Math.max(1, Math.ceil(total / pageSize))
})

useHead({
  title: 'أطباء في العراق | عيادتي',
  meta: [
    {
      name: 'description',
      content: 'ابحث عن الأطباء في جميع محافظات العراق حسب الاسم أو التخصص أو المحافظة، واعرف معلومات الدوام والعيادة والتقييمات.',
    },
    { property: 'og:title', content: 'ابحث عن طبيبك في العراق | عيادتي' },
    { property: 'og:url', content: siteUrl('/doctors') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/doctors') }],
})

function onSearch(payload: { name: string; specialization: number | null; province: number | null }) {
  name.value = payload.name
  specialization.value = payload.specialization != null ? String(payload.specialization) : ''
  province.value = payload.province != null ? String(payload.province) : ''
  applyFilters()
}
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <div class="page-hero__inner">
          <h1 class="page-hero__title">ابحث عن طبيبك</h1>
          <p class="page-hero__subtitle">ابحث بالاسم أو الاختصاص أو المحافظة، واعرف معلومات العيادة وأوقات الدوام.</p>
          <DoctorSearchForm
            :specializations="specializations ?? []"
            :provinces="provinces ?? []"
            :initial-name="name"
            :initial-spec="specialization"
            :initial-province="province"
            :compact="true"
            @submit="onSearch"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="doctors-toolbar" aria-live="polite">
          <h2 class="doctors-toolbar__title">
            <template v-if="doctorsData">
              {{ doctorsData.totalItems }} طبيب
              <span v-if="name || specialization !== '' || province !== ''" class="doctors-toolbar__query">
                لمطابقة بحثك
              </span>
            </template>
            <template v-else>نتائج البحث</template>
          </h2>
          <button
            v-if="name || specialization !== '' || province !== ''"
            type="button"
            class="btn btn--ghost btn--sm"
            @click="
              name = '';
              specialization = '';
              province = '';
              applyFilters();
            "
          >
            <BaseIcon name="filter-remove-outline" :size="18" />
            مسح الفلاتر
          </button>
        </div>

        <div v-if="pending" class="mt-3">
          <StateSkeleton :count="pageSize" />
        </div>

        <div v-else-if="doctorsError" class="mt-3">
          <ErrorState :message="'تعذر الاتصال بخوادم عيادتي.'" @retry="refreshDoctors()" />
        </div>

        <div v-else-if="doctorsData?.items?.length" class="grid grid--doctors mt-3">
          <DoctorCard v-for="doctor in doctorsData.items" :key="doctor.id" :doctor="doctor" />
        </div>

        <div v-else class="mt-3">
          <EmptyState
            icon="magnify-close"
            title="لا توجد نتائج"
            message="لم نجد أطباء يطابقون بحثك. جرّب تعديل الكلمات أو مسح الفلاتر."
            :action-to="'/doctors'"
          />
        </div>

        <SitePagination
          v-if="doctorsData?.items?.length"
          :page="page"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  position: relative;
  background: linear-gradient(160deg, var(--color-primary-soft) 0%, #f6f9f8 60%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border-light);
}

.page-hero__inner {
  padding-block: clamp(32px, 6vw, 64px);
  text-align: center;
  max-width: 760px;
  margin-inline: auto;
}

.page-hero__title {
  font-size: clamp(26px, 4.5vw, 40px);
}

.page-hero__subtitle {
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.page-hero .search-form {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.doctors-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.doctors-toolbar__title {
  font-size: 20px;
}

.doctors-toolbar__query {
  color: var(--color-text-muted);
  font-size: 15px;
  margin-inline-start: 8px;
}

.mt-3 {
  margin-top: var(--spacing-lg);
}
</style>
