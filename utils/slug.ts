import type { ProvinceItemDto, PublicDoctorProfileDto, SpecializationDto } from '~/types'

/** Converts an Arabic or normalized name to a stable Latin URL slug. */
export function toSlug(value: string | null | undefined): string {
  if (!value) return ''
  const normalized =
    value
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ت')
      .replace(/[\u0600-\u06FF\s]+/g, ' ')
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  return normalized || ''
}

/** Doctor URL slug: `{id}-{normalizedName}` e.g. `5-ahmed-ali`. */
export function doctorSlug(id: number, normalizedName?: string | null): string {
  const nameSlug = toSlug(normalizedName) || 'doctor'
  return `${id}-${nameSlug}`
}

/** Parse the numeric doctor id out of a slug like `5-ahmed-ali`. */
export function parseDoctorId(slug: string): number | null {
  const match = slug.trim().match(/^(\d+)/)
  if (!match) return null
  const id = Number(match[1])
  return Number.isFinite(id) && id > 0 ? id : null
}

const SPECIALIZATION_CACHE = new Map<string, SpecializationDto[]>()

/** Load specializations (cached for the session). */
export async function loadSpecializations(): Promise<SpecializationDto[]> {
  const cached = SPECIALIZATION_CACHE.get('all')
  if (cached) return cached
  const list = await getSpecializations()
  SPECIALIZATION_CACHE.set('all', list)
  return list
}

/** Resolve a specialization by normalized name (slug), fallback to name. */
export async function findSpecializationBySlug(slug: string): Promise<SpecializationDto | null> {
  if (!slug) return null
  const list = await loadSpecializations()
  return (
    list.find(
      (s) => s.normalizedName.toLowerCase() === slug.toLowerCase() || toSlug(s.name) === slug.toLowerCase(),
    ) ?? null
  )
}

const PROVINCE_CACHE = new Map<string, ProvinceItemDto[]>()

export async function loadProvinces(): Promise<ProvinceItemDto[]> {
  const cached = PROVINCE_CACHE.get('all')
  if (cached) return cached
  const list = await getProvinces()
  PROVINCE_CACHE.set('all', list)
  return list
}

export async function findProvinceBySlug(slug: string): Promise<ProvinceItemDto | null> {
  if (!slug) return null
  const list = await loadProvinces()
  return (
    list.find(
      (p) => p.normalizedName.toLowerCase() === slug.toLowerCase() || toSlug(p.name) === slug.toLowerCase(),
    ) ?? null
  )
}

export function provinceSlug(normalizedName: string): string {
  return normalizedName.toLowerCase()
}

export function specializationSlug(normalizedName: string): string {
  return normalizedName.toLowerCase()
}

/** Page title for a doctor: `د. {name} - {specialization} في {governorate} | عيادتي` */
export function doctorPageTitle(doctor: PublicDoctorProfileDto): string {
  const governorate = doctor.clinics[0]?.iraqiProvinceName
  const spec = doctor.specializationName
  const segments: string[] = []
  if (doctor.name) segments.push(` ${doctor.name}`)
  if (spec) segments.push(` ${spec}`)
  if (governorate) segments.push(`في ${governorate}`)
  return segments.join(' - ')
}

/** Meta description for a doctor profile page. */
export function doctorPageDescription(doctor: PublicDoctorProfileDto): string {
  const governorate = doctor.clinics[0]?.iraqiProvinceName
  const pieces = [
    `تعرف على معلومات ${doctor.name}`,
    doctor.specializationName ? ` ${doctor.specializationName}` : '',
    governorate ? `في ${governorate}` : '',
    '، عنوان العيادة، أوقات الدوام، موقع العيادة ومعلومات الحجز من خلال عيادتي.',
  ]
  return pieces.filter(Boolean).join(' ')
}

export function formatTimeSpan(value: string): string {
  const [h, m] = value.split(':').map(Number)
  if (!Number.isFinite(h)) return value
  const mm = Number.isFinite(m) ? m : 0
  const period = h >= 12 ? 'م' : 'ص'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${String(hour12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${period}`
}

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return new Intl.NumberFormat('ar-IQ', { maximumFractionDigits: 0 }).format(value)
}

export function formatDayName(day: string): string {
  const names: Record<string, string> = {
    'السبت': 'السبت',
    'الأحد': 'الأحد',
    'الاثنين': 'الاثنين',
    'الإثنين': 'الاثنين',
    'الثلاثاء': 'الثلاثاء',
    'الأربعاء': 'الأربعاء',
    'الخميس': 'الخميس',
    'الجمعة': 'الجمعة',
  }
  return names[day] ?? day
}

export function sortDayNames(days: string[]): string[] {
  const order = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  return [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}