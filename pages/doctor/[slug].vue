<script setup lang="ts">
import type {
  DoctorExternalLinkDto,
  PageResult,
  PublicClinicAvailabilityDto,
  PublicDoctorProfileDto,
  ReviewDto,
} from '~/types'
import { DoctorExternalLinkType } from '~/types'

const route = useRoute()

// ── Slug + identity ──
const slug = computed(() => String(route.params.slug ?? ''))
const doctorId = computed(() => parseDoctorId(slug.value))

if (!doctorId.value) {
  throw createError({ statusCode: 404, statusMessage: 'الطبيب غير موجود', fatal: true })
}

// ── Data ──
const { data: doctor, pending, error } = await useAsyncData<PublicDoctorProfileDto>(
  `doctor-${doctorId.value}`,
  () => getPublicDoctorProfile(doctorId.value as number),
)

if (error.value || !doctor.value) {
  throw createError({ statusCode: 404, statusMessage: 'الطبيب غير موجود', fatal: true })
}

const { data: reviews } = await useAsyncData<PageResult<ReviewDto> | null>(
  `doctor-reviews-${doctorId.value}`,
  () => getDoctorReviews(doctorId.value as number, 1, 6).catch(() => null),
)

const { data: externalLinks } = await useAsyncData<DoctorExternalLinkDto[]>(
  `doctor-links-${doctorId.value}`,
  () => getDoctorExternalLinks(doctorId.value as number).catch(() => []),
)

// ── Layout helpers ──
const primaryClinic = computed(() => doctor.value?.clinics?.[0] ?? null)

const governorate = computed(() => primaryClinic.value?.iraqiProvinceName ?? null)

const displayedPrice = computed(() => {
  const clinic = primaryClinic.value
  if (!clinic || !clinic.showConsultationPrice || clinic.consultationPrice == null) return null
  return clinic.consultationPrice
})

const doctorSlugPath = computed(() => doctorSlug(doctor.value!.id, doctor.value!.normalizedName))

const breadcrumb = computed(() => `عيادتي > الأطباء > ${doctor.value!.name}`)

// ── SEO ──
const pageTitle = computed(() => (doctor.value ? doctorPageTitle(doctor.value) : 'طبيب'))

const doctorJsonLd = computed(() =>
  doctor.value
    ? JSON.stringify(buildDoctorJsonLd(doctor.value, doctorSlugPath.value))
    : '',
)

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: doctor.value ? doctorPageDescription(doctor.value) : '' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: doctor.value ? doctorPageDescription(doctor.value) : '' },
    { property: 'og:type', content: 'profile' },
    { property: 'og:url', content: siteUrl(`/doctor/${doctorSlugPath.value}`) },
    { property: 'og:image', content: doctorCardImage(doctor.value) ?? siteAssetUrl('/onWhiteBG.png') },
    { property: 'profile:first_name', content: doctor.value?.name ?? '' },
  ],
  link: [{ rel: 'canonical', href: siteUrl(`/doctor/${doctorSlugPath.value}`) }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: doctorJsonLd.value,
    },
  ],
})

function buildDoctorJsonLd(d: PublicDoctorProfileDto, slugPath: string) {
  const graph: Record<string, unknown>[] = []

  const review = d.reviewCount > 0
    ? {
        '@type': 'AggregateRating',
        ratingValue: d.averageRating ?? 5,
        reviewCount: d.reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined

  const doctorNode: Record<string, unknown> = {
    '@type': 'Physician',
    '@id': `${siteUrl()}/doctor/${slugPath}#doctor`,
    name: ` ${d.name}`,
    url: siteUrl(`/doctor/${slugPath}`),
    image: doctorCardImage(d) ?? siteAssetUrl('/onWhiteBG.png'),
    medicalSpecialty: d.specializationName || undefined,
    availableService: d.canBookOnline ? ['online_booking'] : undefined,
  }
  if (review) doctorNode.aggregateRating = review
  if (d.description) doctorNode.description = d.description

  const clinics = (d.clinics ?? []).map((c) => {
    const node: Record<string, unknown> = {
      '@type': 'MedicalClinic',
      name: c.name,
      telephone: c.phoneNumber ?? undefined,
    }
    if (c.mapUrl) node.url = c.mapUrl
    if (typeof c.latitude === 'number' && typeof c.longitude === 'number') {
      node.geo = { '@type': 'GeoCoordinates', latitude: c.latitude, longitude: c.longitude }
    }
    if (c.address) node.address = { '@type': 'PostalAddress', streetAddress: c.address, addressRegion: c.iraqiProvinceName || undefined }
    return node
  })

  if (clinics.length) doctorNode.hospitalAffiliation = clinics

  graph.push(doctorNode)
  return { '@context': 'https://schema.org', '@graph': graph }
}

function doctorCardImage(d: PublicDoctorProfileDto | null): string | undefined {
  if (!d) return undefined
  return publicDoctorImageUrl(d.imageName) ?? doctorPlaceholderUrl()
}

// ── Analytics ──
onMounted(() => {
  if (doctor.value) useAnalytics().trackDoctorView(doctor.value.id)
})

function handleBook() {
  if (!doctor.value) return
  useAnalytics().trackBookingClick(doctor.value.id, primaryClinic.value?.id)
  window.open('https://eyadaty.techumbrella.net/booking', '_blank', 'noopener')
}

function handlePhoneClick(clinicId: number) {
  if (doctor.value) useAnalytics().trackPhoneClick(doctor.value.id, clinicId)
}

function handleMapClick(clinicId: number) {
  if (doctor.value) useAnalytics().trackMapClick(doctor.value.id, clinicId)
}

function handleExternalLink(link: DoctorExternalLinkDto) {
  if (doctor.value) useAnalytics().track('external_link_click', { doctorId: doctor.value.id })
}

async function handleShare() {
  if (!doctor.value) return
  const url = siteUrl(`/doctor/${doctorSlugPath.value}`)
  const title = `د. ${doctor.value.name} - ${doctor.value.specializationName || ''}`
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
    } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard?.writeText(url)
  }
}

// ── Derived UI data ──
const linkTypeIcon: Record<DoctorExternalLinkType, { icon: string; label: string }> = {
  [DoctorExternalLinkType.Instagram]: { icon: 'instagram', label: 'انستغرام' },
  [DoctorExternalLinkType.Facebook]: { icon: 'facebook', label: 'فيسبوك' },
  [DoctorExternalLinkType.TikTok]: { icon: 'music-note', label: 'تيك توك' },
  [DoctorExternalLinkType.WhatsApp]: { icon: 'whatsapp', label: 'واتساب' },
  [DoctorExternalLinkType.Website]: { icon: 'web', label: 'الموقع الإلكتروني' },
  [DoctorExternalLinkType.Custom]: { icon: 'link-variant', label: 'رابط مخصص' },
}

function groupSchedule(availabilities: PublicClinicAvailabilityDto[]) {
  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  return days.map((day) => {
    const rows = availabilities.filter((a) => formatDayName(a.dayName) === day)
    return {
      day,
      rows: rows.map((r) => ({ start: formatTimeSpan(r.startTime), end: formatTimeSpan(r.endTime) })),
    }
  })
}

const externalLinkPrefix = (value: string) => (value.startsWith('http') ? value : `https://${value}`)

const isWhatsApp = (link: DoctorExternalLinkDto) => link.type === DoctorExternalLinkType.WhatsApp
</script>

<template>
  <main>
    <div v-if="pending" class="container profile-page">
      <StateSkeleton variant="profile" :count="3" />
    </div>

    <div v-else-if="doctor" class="container profile-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="مسار التنقل">
        <ol>
          <li><NuxtLink to="/">الرئيسية</NuxtLink></li>
          <li><NuxtLink to="/doctors">الأطباء</NuxtLink></li>
          <li aria-current="page"> {{ doctor.name }}</li>
        </ol>
      </nav>

      <div class="profile-grid">
        <!-- ── Main column ── -->
        <div class="profile-main">
          <!-- Header card -->
          <section class="card profile-head" aria-labelledby="doctor-name">
            <div class="profile-head__top">
              <div class="profile-avatar">
                <img
                  :src="doctorCardImage(doctor)"
                  :alt="`صورة د. ${doctor.name}`"
                  width="120"
                  height="120"
                  loading="lazy"
                  decoding="async"
                />
                <span v-if="doctor.isFeatured" class="profile-avatar__badge">
                  <BaseIcon name="star" :size="14" />
                  مميز
                </span>
              </div>

              <div class="profile-identity">
                <h1 id="doctor-name" class="profile-name">{{ doctor.name }}</h1>
                <p class="profile-spec">
                  <BaseIcon :name="specializationIconName(doctor.specializationNormalizedName)" :size="18" />
                  أخصائي {{ doctor.specializationName }}
                </p>
                <div class="profile-stats">
                  <RatingStars :rating="doctor.averageRating" :review-count="doctor.reviewCount" />
                  <span v-if="governorate" class="profile-loc">
                    <BaseIcon name="map-marker-radius" :size="16" />
                    {{ governorate }}
                  </span>
                  <span v-if="displayedPrice" class="profile-price">
                    <BaseIcon name="currency-usd" :size="16" />
                    {{ formatPrice(displayedPrice) }} د.ع
                  </span>
                </div>
              </div>
            </div>

            <p v-if="doctor.description" class="profile-desc">{{ doctor.description }}</p>

            <div class="profile-actions">
              <button type="button" class="btn btn--primary btn--lg" @click="handleBook">
                <BaseIcon name="calendar-check" :size="22" />
                {{ doctor.canBookOnline ? 'احجز إلكترونياً' : 'معلومات الحجز' }}
              </button>
              <button type="button" class="btn btn--secondary btn--lg" @click="handleShare">
                <BaseIcon name="share-variant-outline" :size="20" />
                مشاركة
              </button>
              <a
                class="btn btn--ghost btn--lg"
                :href="`${siteUrl()}/download?doctorId=${doctor.id}`"
                @click="useAnalytics().trackAppDownloadClick()"
              >
                <BaseIcon name="cellphone-arrow-down" :size="20" />
                احفظ الطبيب في التطبيق
              </a>
            </div>
          </section>

          <!-- External links -->
          <section v-if="externalLinks?.length" class="card social-block" aria-labelledby="doc-social">
            <h2 id="doc-social" class="block-title">تواصل مع الطبيب</h2>
            <div class="social-list">
              <a
                v-for="link in externalLinks"
                :key="link.id"
                :href="externalLinkPrefix(link.value)"
                target="_blank"
                rel="noopener nofollow"
                class="social-list__item"
                :class="{ 'social-list__item--primary': isWhatsApp(link) }"
                @click="handleExternalLink(link)"
              >
                <BaseIcon :name="linkTypeIcon[link.type]?.icon ?? 'link-variant'" :size="22" />
                <span>{{ link.displayName || linkTypeIcon[link.type]?.label || 'رابط' }}</span>
                <BaseIcon class="social-list__arrow" name="chevron-up-right" :size="18" />
              </a>
            </div>
          </section>

          <!-- Clinics -->
          <section class="card clinics-block" aria-labelledby="doc-clinics">
            <h2 id="doc-clinics" class="block-title">بيانات العيادة</h2>
            <div class="clinic-list">
              <article v-for="clinic in doctor.clinics" :key="clinic.id" class="clinic">
                <div class="clinic__main">
                  <div class="clinic__head">
                    <h3 class="clinic__name">{{ clinic.name }}</h3>
                    <span v-if="clinic.showConsultationPrice && clinic.consultationPrice != null" class="clinic__price">
                      <BaseIcon name="currency-usd" :size="16" />
                      {{ formatPrice(clinic.consultationPrice) }} د.ع
                    </span>
                  </div>

                  <ul class="clinic__meta">
                    <li>
                      <BaseIcon name="map-marker" :size="18" />
                      <span>{{ clinic.address || 'لم يُحدد العنوان بعد' }}</span>
                    </li>
                    <li v-if="clinic.phoneNumber">
                      <BaseIcon name="phone-outline" :size="18" />
                      <a :href="`tel:${clinic.phoneNumber}`" @click="handlePhoneClick(clinic.id)">
                        {{ clinic.phoneNumber }}
                      </a>
                    </li>
                    <li v-if="clinic.iraqiProvinceName">
                      <BaseIcon name="city-variant-outline" :size="18" />
                      {{ clinic.iraqiProvinceName }}
                    </li>
                  </ul>

                  <!-- Schedule -->
                  <div class="clinic__schedule">
                    <template v-for="{ day, rows } in groupSchedule(clinic.availabilities ?? [])" :key="day">
                      <div v-if="rows.length" class="schedule-row">
                        <span class="schedule-row__day">{{ day }}</span>
                        <span class="schedule-row__times">
                          <span v-for="(row, i) in rows" :key="i" class="schedule-row__time">
                            {{ row.start }} - {{ row.end }}
                          </span>
                          <span v-if="!rows.length" class="schedule-row__none">غير متاح</span>
                        </span>
                      </div>
                    </template>
                    <p v-if="!(clinic.availabilities ?? []).length" class="clinic__none">
                      لم تُحدد أوقات الدوام بعد.
                    </p>
                  </div>

                  <div class="clinic__actions">
                    <a
                      v-if="clinic.phoneNumber"
                      :href="`tel:${clinic.phoneNumber}`"
                      class="btn btn--secondary btn--sm"
                      @click="handlePhoneClick(clinic.id)"
                    >
                      <BaseIcon name="phone-outline" :size="18" />
                      اتصل
                    </a>
                    <a
                      v-if="clinic.latitude != null && clinic.longitude != null"
                      :href="`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`"
                      target="_blank"
                      rel="noopener"
                      class="btn btn--ghost btn--sm"
                      @click="handleMapClick(clinic.id)"
                    >
                      <BaseIcon name="map-marker-radius" :size="18" />
                      افتح الخريطة
                    </a>
                    <span v-else-if="clinic.mapUrl" class="clinic__map-hint">موقع الخريطة متاح في تطبيق عيادتي</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- Reviews -->
          <section class="card reviews-block" aria-labelledby="doc-reviews">
            <div class="reviews-head">
              <h2 id="doc-reviews" class="block-title">تقييمات المرضى</h2>
              <RatingStars :rating="doctor.averageRating" :review-count="doctor.reviewCount" />
            </div>

            <div v-if="reviews?.items?.length" class="review-list">
              <article v-for="review in reviews.items" :key="review.id" class="review">
                <div class="review__top">
                  <BaseIcon name="account-circle" :size="34" color="var(--color-text-muted)" />
                  <div class="review__author">
                    <span class="review__name">{{ review.user?.name || 'مريض عبر تطبيق عيادتي' }}</span>
                    <RatingStars :rating="review.rating" :size="16" />
                  </div>
                </div>
                <p v-if="review.comment" class="review__body">{{ review.comment }}</p>
              </article>
            </div>
            <p v-else class="reviews-none">
              التقييمات والمراجعات تظهر بعد التحقق منه في تطبيق عيادتي — جرّب التطبيق لمشاركة تجربتك.
            </p>
          </section>
        </div>

        <!-- ── Sidebar ── -->
        <aside class="profile-side">
          <section class="card book-card">
            <h2 class="book-card__title">
              <BaseIcon name="calendar-check" :size="22" />
              {{ doctor.canBookOnline ? 'احجز إلكترونياً' : 'الحجز الحالي' }}
            </h2>
            <p v-if="doctor.canBookOnline" class="book-card__text">
              هذا الطبيب يتيح الحجز الإلكتروني عبر تطبيق عيادتي. اختر اليوم والوقت المناسبين.
            </p>
            <p v-else class="book-card__text">
              الحجز متاح حالياً عبر الهاتف أو زيارة العيادة. تظهر معلومات الحجز في التطبيق.
            </p>

            <template v-if="doctor.canBookOnline">
              <div class="book-card__doctor">
                <img
                  :src="doctorCardImage(doctor)"
                  :alt="`د. ${doctor.name}`"
                  width="44"
                  height="44"
                  loading="lazy"
                  decoding="async"
                />
                <span>{{ doctor.canBookOnline ? 'احجز موعدك لتوفر المقعد' : '' }}</span>
              </div>
              <button type="button" class="btn btn--primary btn--lg btn--block" @click="handleBook">
                <BaseIcon name="calendar-check" :size="20" />
                احجز الآن
              </button>
            </template>

            <template v-else>
              <a
                v-if="primaryClinic?.phoneNumber"
                :href="`tel:${primaryClinic.phoneNumber}`"
                class="btn btn--primary btn--lg btn--block"
                @click="handlePhoneClick(primaryClinic.id)"
              >
                <BaseIcon name="phone-outline" :size="20" />
                اتصل بالعيادة
              </a>
              <p v-else class="book-card__text">
                لم تُضف بيانات الهاتف بعد — يرجى التواصل عبر التطبيق لاحقاً.
              </p>
            </template>

          </section>
          <DownloadAppSection :doctor-id="doctor.id" variant="page" class="book-card__app" />
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  padding-block: var(--spacing-lg) var(--spacing-2xl);
}

.breadcrumb {
  margin-bottom: var(--spacing-lg);
}

.breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.breadcrumb li + li::before {
  content: '›';
  margin-inline: 6px;
  color: var(--color-border);
}

.breadcrumb a {
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.breadcrumb a:hover {
  color: var(--color-primary);
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 992px) {
  .profile-grid {
    grid-template-columns: minmax(0, 1fr) 340px;
    align-items: start;
  }
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  min-width: 0;
}

/* Header */
.profile-head {
  padding: var(--spacing-xl);
}

.profile-head__top {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

@media (min-width: 640px) {
  .profile-head__top {
    flex-direction: row;
    align-items: center;
  }
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
  width: 120px;
}

.profile-avatar img {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  background: var(--color-surface-alt);
}

.profile-avatar__badge {
  position: absolute;
  bottom: -8px;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  background: var(--color-primary);
  border-radius: 999px;
  white-space: nowrap;
}

.profile-identity {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: clamp(22px, 3.4vw, 30px);
  margin-bottom: 4px;
}

.profile-spec {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.profile-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
}

.profile-loc,
.profile-price {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.profile-desc {
  margin-top: var(--spacing-lg);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

/* Blocks */
.block-title {
  font-size: 18px;
  margin-bottom: var(--spacing-lg);
}

.social-block,
.clinics-block,
.reviews-block {
  padding: var(--spacing-xl);
}

.social-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

@media (min-width: 640px) {
  .social-list {
    grid-template-columns: 1fr 1fr;
  }
}

.social-list__item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-weight: 700;
  font-size: 14px;
  transition: all 0.15s ease;
}

.social-list__item--primary {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.social-list__item:hover {
  border-color: var(--color-primary);
}

.social-list__arrow {
  margin-inline-start: auto;
  color: var(--color-text-muted);
}

/* Clinic */
.clinic {
  padding-block: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.clinic:first-of-type {
  padding-top: 0;
}

.clinic:last-of-type {
  padding-bottom: 0;
  border-bottom: 0;
}

.clinic__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.clinic__name {
  font-size: 17px;
}

.clinic__price {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--color-secondary-soft);
  color: var(--color-secondary-dark);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.clinic__meta {
  list-style: none;
  margin: 0 0 var(--spacing-md);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.clinic__meta li {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.clinic__meta a {
  color: var(--color-primary);
  font-weight: 700;
}

.clinic__schedule {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.schedule-row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
  padding-block: 6px;
  border-bottom: 1px dashed var(--color-border-light);
}

.schedule-row:last-child {
  border-bottom: 0;
}

.schedule-row__day {
  flex: 0 0 90px;
  font-weight: 800;
  font-size: 14px;
}

.schedule-row__times {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.schedule-row__time {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.clinic__none {
  font-size: 13px;
  color: var(--color-text-muted);
}

.clinic__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.clinic__map-hint {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* Reviews */
.reviews-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.reviews-head .block-title {
  margin-bottom: 0;
}

.review-list {
  margin-top: var(--spacing-lg);
}

.review {
  padding-block: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
}

.review:last-child {
  border-bottom: 0;
}

.review__top {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: 6px;
}

.review__name {
  font-weight: 800;
  font-size: 14px;
  display: block;
  margin-bottom: 2px;
}

.review__body {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.reviews-none {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
}

/* Sidebar */
.profile-side {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.book-card {
  padding: var(--spacing-xl);
}

.book-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary-dark);
}

.book-card__text {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
}

.book-card__doctor {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--spacing-md);
  font-size: 14px;
  font-weight: 700;
}

.book-card__doctor img {
  border-radius: 50%;
  object-fit: cover;
  background: var(--color-surface-alt);
}

.book-card__app {
  margin-top: var(--spacing-xl);
}

.profile-side {
  min-width: 0;
}
</style>
