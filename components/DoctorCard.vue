<script setup lang="ts">
import type { PublicDoctorListDto } from '~/types'
import { doctorPlaceholderUrl, publicDoctorImageUrl } from '~/utils/api'
import { doctorSlug, formatPrice } from '~/utils/slug'

const props = defineProps<{
  doctor: PublicDoctorListDto
}>()

const imageSrc = computed(() => publicDoctorImageUrl(props.doctor.imageName) || doctorPlaceholderUrl())
const href = computed(() => `/doctor/${doctorSlug(props.doctor.id, props.doctor.normalizedName)}`)
const primaryClinic = computed(() => props.doctor.clinics[0] ?? null)
const governorateName = computed(() => props.doctor.clinics[0]?.iraqiProvinceName ?? '')

function trackView() {
  useAnalytics().trackDoctorView(props.doctor.id)
}
</script>

<template>
  <article class="doctor-card card card--hover">
    <NuxtLink
      :to="href"
      class="doctor-card__link"
      :aria-label="`عرض الملف الشخصي للدكتور ${doctor.name}`"
      @click="trackView"
    >
      <div class="doctor-card__media">
        <img
          :src="imageSrc"
          :alt="`${doctor.name} — صورة الطبيب`"
          class="doctor-card__img"
          loading="lazy"
          decoding="async"
        />
        <div v-if="doctor.isFeatured" class="doctor-card__featured chip chip--warning">
          <BaseIcon name="crown" :size="14" />
          مميز
        </div>
      </div>

      <div class="doctor-card__body">
        <div class="doctor-card__title-row">
          <h3 class="doctor-card__name"> {{ doctor.name }}</h3>
          <span v-if="doctor.averageRating !== null" class="doctor-card__rating" title="التقييم العام">
            <BaseIcon name="star" :size="15" color="#e8a33d" />
            {{ doctor.averageRating.toFixed(1) }}
          </span>
        </div>

        <p class="doctor-card__spec">{{ doctor.specializationName }}</p>

        <div v-if="governorateName" class="doctor-card__loc">
          <BaseIcon name="map-marker" :size="17" />
          <span>{{ governorateName }}</span>
        </div>

        <div class="doctor-card__meta">
          <span v-if="doctor.canBookOnline" class="chip chip--success">
            <BaseIcon name="calendar-check" :size="14" />
            حجز إلكتروني
          </span>
          <span v-if="primaryClinic?.showConsultationPrice && primaryClinic?.consultationPrice != null" class="chip chip--outline">
            <BaseIcon name="cash-multiple" :size="14" />
            {{ formatPrice(primaryClinic.consultationPrice) }} د.ع
          </span>
          <span v-if="primaryClinic?.address" class="chip chip--outline doctor-card__addr">
            {{ primaryClinic.address }}
          </span>
        </div>

        <span class="btn btn--secondary doctor-card__btn">
          عرض الملف الشخصي
          <BaseIcon name="chevron-left" :size="18" />
        </span>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.doctor-card {
  overflow: hidden;
}

.doctor-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.doctor-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--color-primary-soft);
  overflow: hidden;
}

.doctor-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.35s ease;
}

.doctor-card:hover .doctor-card__img {
  transform: scale(1.04);
}

.doctor-card__featured {
  position: absolute;
  top: 12px;
  inset-inline-start: 12px;
}

.doctor-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
  padding: var(--spacing-lg);
}

.doctor-card__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.doctor-card__name {
  font-size: 18px;
  color: var(--color-text);
}

.doctor-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
}

.doctor-card__spec {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
}

.doctor-card__loc {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.doctor-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.doctor-card__addr {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doctor-card__btn {
  margin-top: auto;
  padding-block: 12px;
}
</style>