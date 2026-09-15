import { submitAnalytics } from '~/utils/api'

let sessionId: string | null = null
const VISIT_KEY = 'eyadaty_website_visit'
const VISIT_TIMEOUT_MS = 30 * 60 * 1000

interface StoredWebsiteVisit {
  sessionId: string
  expiresAt: number
}

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
      sessionId: getSessionId(),
    })
  }

  return {
    track,
    trackWebsiteVisit() {
      if (import.meta.server) return

      const now = Date.now()
      const currentVisit = readWebsiteVisit()

      if (currentVisit && currentVisit.expiresAt > now) {
        saveWebsiteVisit({ ...currentVisit, expiresAt: now + VISIT_TIMEOUT_MS })
        return
      }

      const newVisit = {
        sessionId: getSessionId(),
        expiresAt: now + VISIT_TIMEOUT_MS,
      }
      saveWebsiteVisit(newVisit)

      void submitAnalytics({
        eventType: 'website_visit',
        page: route.path,
        platform: 'website',
        source: 'website',
        sessionId: newVisit.sessionId,
      })
    },
    trackDoctorSearch(opts: AnalyticsTrackOptions = {}) {
      track('doctor_search_performed', opts)
    },
    trackDoctorView(doctorId: number, opts: AnalyticsTrackOptions = {}) {
      track('doctor_profile_viewed', { ...opts, doctorId })
    },
    trackDoctorShownInSearch(doctorId: number, opts: AnalyticsTrackOptions = {}) {
      track('doctor_shown_in_search', { ...opts, doctorId, source: opts.source ?? 'search' })
    },
    trackSpecializationSearch(specializationId: number, opts: AnalyticsTrackOptions = {}) {
      track('specialization_search', { ...opts, specializationId })
    },
    trackGovernorateSearch(province: string, opts: AnalyticsTrackOptions = {}) {
      track('governorate_search', { ...opts, province })
    },
    trackBookingClick(doctorId: number, clinicId?: number) {
      track('doctor_booking_clicked', { doctorId, clinicId })
    },
    trackPhoneClick(doctorId: number, clinicId?: number) {
      track('doctor_call_clicked', { doctorId, clinicId })
    },
    trackMapClick(doctorId: number, clinicId?: number) {
      track('doctor_map_clicked', { doctorId, clinicId })
    },
    trackDoctorRegistrationClick() {
      track('doctor_registration_click')
    },
    trackAppDownloadClick() {
      track('app_download_click')
    },
  }
}

function readWebsiteVisit(): StoredWebsiteVisit | null {
  const raw = window.localStorage.getItem(VISIT_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<StoredWebsiteVisit>
    if (!parsed.sessionId || typeof parsed.expiresAt !== 'number') return null
    return { sessionId: parsed.sessionId, expiresAt: parsed.expiresAt }
  } catch {
    return null
  }
}

function saveWebsiteVisit(visit: StoredWebsiteVisit) {
  window.localStorage.setItem(VISIT_KEY, JSON.stringify(visit))
}

export { getSessionId }
