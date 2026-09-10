<script setup lang="ts">
import type { PageResult, ProvinceItemDto, PublicDoctorListDto, SpecializationDto } from '~/types'
import type { SearchDoctorsParams } from '~/utils/api'

const props = withDefaults(
  defineProps<{
    fixedSpecialization?: number | null
    fixedProvince?: number | null
    heading: string
    blurb?: string
  }>(),
  {
    fixedSpecialization: null,
    fixedProvince: null,
    blurb: '',
  },
)

const route = useRoute()
const router = useRouter()

const page = ref(1)
const name = ref('')
const userSpec = ref('')
const userProvince = ref('')

function syncFromQuery() {
  page.value = Math.max(1, Number(route.query.page) || 1)
  name.value = String(route.query.name ?? '')
  const spec = route.query.specialization
  userSpec.value = spec && spec !== '' ? String(spec) : ''
  const prov = route.query.province
  userProvince.value = prov && prov !== '' ? String(prov) : ''
}

watch(
  () => route.fullPath,
  () => syncFromQuery(),
)

syncFromQuery()

const { data: specializations } = await useAsyncData<SpecializationDto[]>(
  `listing-specs-${props.heading}`,
  () => getSpecializations(),
)

const { data: provinces } = await useAsyncData<ProvinceItemDto[]>(
  `listing-provinces-${props.heading}`,
  () => getProvinces(),
)

const pageSize = 8

const effectiveFilters = computed<SearchDoctorsParams>(() => {
  const p: SearchDoctorsParams = {}
  if (name.value.trim()) p.name = name.value.trim()
  const spec = userSpec.value !== '' ? Number(userSpec.value) : props.fixedSpecialization
  const prov = userProvince.value !== '' ? Number(userProvince.value) : props.fixedProvince
  if (spec) p.specialization = spec
  if (prov !== null && prov !== undefined) p.iraqiProvince = prov
  p.page = page.value || 1
  p.pageSize = pageSize
  return p
})

const { data: doctorsData, pending, refresh, error } = await useAsyncData<PageResult<PublicDoctorListDto> | null>(
  `listing-doctors-${props.heading}`,
  () => searchDoctors(effectiveFilters.value).catch(() => null),
  { watch: [effectiveFilters], default: () => null },
)

const totalPages = computed(() => {
  const total = doctorsData.value?.totalItems ?? 0
  return Math.max(1, Math.ceil(total / pageSize))
})

function buildQuery(over: { page?: number } = {}): Record<string, string> {
  const q: Record<string, string> = {}
  if (name.value) q.name = name.value
  if (userSpec.value !== '') q.specialization = String(userSpec.value)
  if (userProvince.value !== '') q.province = String(userProvince.value)
  if ((over.page ?? page.value) > 1) q.page = String(over.page ?? page.value)
  return q
}

function onSubmit(payload: { name: string; specialization: number | null; province: number | null }) {
  useAnalytics().trackDoctorSearch({
    searchText: payload.name || undefined,
    specializationId: payload.specialization ?? undefined,
    province: payload.province != null ? String(payload.province) : undefined,
  })
  name.value = payload.name
  userSpec.value = payload.specialization != null ? String(payload.specialization) : ''
  userProvince.value = payload.province != null ? String(payload.province) : ''
  page.value = 1
  router.push({ path: route.path, query: buildQuery() })
}

function changePage(newPage: number) {
  page.value = newPage
  router.push({ path: route.path, query: buildQuery({ page: newPage }) })
}

function resetFilters() {
  name.value = ''
  userSpec.value = ''
  userProvince.value = ''
  page.value = 1
  router.push({ path: route.path, query: {} })
}

const hasActiveFilters = computed(
  () => name.value || userSpec.value !== '' || userProvince.value !== '',
)
</script>

<template>
  <div>
    <DoctorSearchForm
      v-if="specializations?.length"
      :specializations="specializations ?? []"
      :provinces="provinces ?? []"
      :initial-name="name"
      :initial-spec="userSpec !== '' ? userSpec : fixedSpecialization"
      :initial-province="userProvince !== '' ? userProvince : fixedProvince"
      :compact="true"
      @submit="onSubmit"
    />

    <div class="listing-toolbar" aria-live="polite">
      <p class="listing-toolbar__count">
        <template v-if="doctorsData">
          {{ doctorsData.totalItems }} طبيب
          <span v-if="hasActiveFilters" class="listing-toolbar__query">لمعاييرك</span>
        </template>
        <template v-else>نتائج البحث</template>
      </p>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="btn btn--ghost btn--sm"
        @click="resetFilters"
      >
        <BaseIcon name="filter-remove-outline" :size="18" />
        مسح الفلاتر
      </button>
    </div>

    <div v-if="pending" class="mt-3">
      <StateSkeleton :count="pageSize" />
    </div>

    <div v-else-if="error" class="mt-3">
      <ErrorState message="تعذر الاتصال بخوادم عيادتي." @retry="refresh()" />
    </div>

    <div v-else-if="doctorsData?.items?.length" class="grid grid--doctors mt-3">
      <DoctorCard v-for="doctor in doctorsData.items" :key="doctor.id" :doctor="doctor" />
    </div>

    <div v-else class="mt-3">
      <EmptyState
        icon="magnify-close"
        title="لا توجد نتائج"
        message="لم نجد أطباء يطابقون بحثك. جرّب تعديل الكلمات أو مسح الفلاتر."
        action-label="مسح الفلاتر"
        :action-to="route.path"
      />
    </div>

    <SitePagination
      v-if="doctorsData?.items?.length"
      :page="page"
      :total-pages="totalPages"
      @change="changePage"
    />
  </div>
</template>

<style scoped>
.listing-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.listing-toolbar__count {
  font-weight: 800;
  color: var(--color-text);
}

.listing-toolbar__query {
  color: var(--color-text-muted);
  font-weight: 400;
  font-size: 14px;
}

.mt-3 {
  margin-top: var(--spacing-lg);
}
</style>
