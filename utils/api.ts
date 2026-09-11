import type {
  ApiResponse,
  AppReleaseResponse,
  DoctorExternalLinkDto,
  PageResult,
  ProvinceItemDto,
  PublicDoctorListDto,
  PublicDoctorProfileDto,
  ReviewDto,
  SpecializationDto,
} from '~/types'

export const useApiConfig = () => useRuntimeConfig().public

/** Base URL for public API calls (ends with /api). */
export function apiBase(): string {
  const base = useApiConfig().apiBase
  return base.endsWith('/') ? base.slice(0, -1) : base
}

/** Official site origin used in canonical links / meta (no trailing slash). */
export function siteUrl(path = ''): string {
  const url = useApiConfig().siteUrl
  const base = url.endsWith('/') ? url.slice(0, -1) : url
  if (!path) return base
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${base}${clean}`
}

/** Public asset URL that respects Nuxt app.baseURL, e.g. /website/. */
export function publicAssetUrl(path: string): string {
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`
}

/** Absolute public asset URL for SEO metadata. */
export function siteAssetUrl(path: string): string {
  return siteUrl(path)
}

async function apiGet<T>(path: string, opts?: Record<string, unknown>): Promise<T> {
  const res = (await $fetch(path, {
    baseURL: apiBase(),
    ...opts,
  })) as unknown as ApiResponse<T>
  return res.data
}

export async function apiGetRaw<T>(path: string, opts?: Record<string, unknown>): Promise<T> {
  return (await $fetch(path, {
    baseURL: apiBase(),
    ...opts,
  })) as T
}

export interface SearchDoctorsParams {
  name?: string
  specialization?: number
  iraqiProvince?: number
  sort?: 'rating' | 'reviews' | 'booking' | ''
  page?: number
  pageSize?: number
}

export function searchDoctors(params: SearchDoctorsParams = {}) {
  const query: Record<string, string | number> = {}
  if (params.name?.trim()) query.Name = params.name.trim()
  if (params.specialization) query.Specialization = params.specialization
  if (params.iraqiProvince !== undefined && params.iraqiProvince !== null && params.iraqiProvince !== -1) {
    query.IraqiProvince = params.iraqiProvince
  }
  if (params.sort) query.Sort = params.sort
  query.page = params.page || 1
  query.pageSize = params.pageSize || 8
  return apiGet<PageResult<PublicDoctorListDto>>('/Doctor/public', { query })
}

export function getPublicDoctorProfile(doctorId: number) {
  return apiGet<PublicDoctorProfileDto>(`/Doctor/public/${doctorId}`)
}

export function getSpecializations() {
  return apiGet<SpecializationDto[]>('/Specialization')
}

export function getProvinces() {
  return apiGet<ProvinceItemDto[]>('/IraqiProvince')
}

export function getDoctorReviews(doctorId: number, page = 1, pageSize = 10) {
  return apiGet<PageResult<ReviewDto>>(`/Review/doctor/${doctorId}`, {
    query: { page, pageSize },
  })
}

export function getDoctorExternalLinks(doctorId: number) {
  return apiGet<DoctorExternalLinkDto[]>(`/DoctorExternalLink/doctor/${doctorId}`)
}

export function getLatestRelease() {
  return apiGetRaw<ApiResponse<AppReleaseResponse>>('/app-release/latest')
}

export function publicDoctorImageUrl(imageName: string | null | undefined): string | null {
  if (!imageName || !imageName.trim()) return null
  return `${apiBase()}/Files/doctor-image/${encodeURIComponent(imageName.trim())}`
}

/** Official generic Eyadaty doctor placeholder. */
export function doctorPlaceholderUrl(): string {
  return `${apiBase()}/Files/doctor-image/default-doctor.png`
}

export async function submitAnalytics(payload: {
  eventType: string
  doctorId?: number
  clinicId?: number
  specializationId?: number
  source?: string
  platform?: string
  page?: string
  province?: string
  searchText?: string
}): Promise<void> {
  try {
    await $fetch('/Analytics/track', {
      method: 'POST',
      baseURL: apiBase(),
      body: payload,
    })
  } catch {
    // Analytics must never break the user journey.
  }
}
