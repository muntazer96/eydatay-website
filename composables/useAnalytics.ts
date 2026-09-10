import { submitAnalytics } from '~/utils/api'

let sessionId: string | null = null

function getSessionId(): string {
  if (sessionId) return sessionId
  if (import.meta.server) {
    sessionId = `srv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    return sessionId
  }
  const stored = window.sessionStorage.getItem('eyadaty_sid')
  if (stored) {
    sessionId = stored
    return stored
  }
  const created = `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  window.sessionStorage.setItem('eyadaty_sid', created)
  sessionId = created
  return created
}

export interface AnalyticsTrackOptions {
  doctorId?: number
  clinicId?: number
  specializationId?: number
  province?: string
  searchText?: string
  source?: string
}

/**
 * Privacy-respecting analytics that reuses the existing Eyadaty backend
 * `Analytics/track` endpoint. Never include anything sensitive.
 */
export function useAnalytics() {
  const route = useRoute()

  function track(eventType: string, opts: AnalyticsTrackOptions = {}) {
    void submitAnalytics({
      eventType,
      ...opts,
      page: route.path,
      platform: 'website',
      source: opts.source ?? 'website',
    })
  }

  return {
    track,
    trackDoctorSearch(opts: AnalyticsTrackOptions = {}) {
      track('doctor_search', opts)
    },
    trackDoctorView(doctorId: number, opts: AnalyticsTrackOptions = {}) {
      track('doctor_profile_view', { ...opts, doctorId })
    },
    trackSpecializationSearch(specializationId: number, opts: AnalyticsTrackOptions = {}) {
      track('specialization_search', { ...opts, specializationId })
    },
    trackGovernorateSearch(province: string, opts: AnalyticsTrackOptions = {}) {
      track('governorate_search', { ...opts, province })
    },
    trackBookingClick(doctorId: number, clinicId?: number) {
      track('booking_cta_click', { doctorId, clinicId })
    },
    trackPhoneClick(doctorId: number, clinicId?: number) {
      track('phone_contact_click', { doctorId, clinicId })
    },
    trackMapClick(doctorId: number, clinicId?: number) {
      track('map_click', { doctorId, clinicId })
    },
    trackDoctorRegistrationClick() {
      track('doctor_registration_click')
    },
    trackAppDownloadClick() {
      track('app_download_click')
    },
  }
}

export { getSessionId }