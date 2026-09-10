/** Public endpoint types — mirror the Eyadaty backend public DTOs. */

export interface ApiResponse<T> {
  status: string
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface PublicDoctorListDto {
  id: number
  name: string
  normalizedName: string
  specializationId: number
  specializationName: string
  specializationNormalizedName: string
  specializationIconName: string
  description: string | null
  imageName: string | null
  canBookOnline: boolean
  averageRating: number | null
  reviewCount: number
  isFeatured: boolean
  activeSubscriptionName: string | null
  activeSubscriptionNormalizedName: string | null
  activeSubscriptionWeight: number
  clinics: PublicDoctorClinicSummaryDto[]
}

export interface PublicDoctorProfileDto {
  id: number
  name: string
  normalizedName: string
  specializationId: number
  specializationName: string
  specializationNormalizedName: string
  specializationIconName: string
  description: string | null
  imageName: string | null
  canBookOnline: boolean
  canMessage: boolean
  averageRating: number | null
  reviewCount: number
  isFeatured: boolean
  activeSubscriptionName: string | null
  activeSubscriptionNormalizedName: string | null
  activeSubscriptionWeight: number
  userId: string | null
  clinics: PublicDoctorClinicDto[]
}

export interface PublicDoctorClinicSummaryDto {
  id: number
  name: string
  iraqiProvince: number
  iraqiProvinceName: string
  address: string
  consultationPrice: number | null
  showConsultationPrice: boolean
  bookingWindowDays: number
}

export interface PublicDoctorClinicDto extends PublicDoctorClinicSummaryDto {
  latitude: number | null
  longitude: number | null
  mapUrl: string | null
  phoneNumber: string | null
  availabilities: PublicClinicAvailabilityDto[]
}

export interface PublicClinicAvailabilityDto {
  dayId: number
  dayName: string
  dayNormalizedName: string
  startTime: string
  endTime: string
  maxAppointments: number
}

export interface SpecializationDto {
  id: number
  name: string
  normalizedName: string
  iconName: string
}

export interface ProvinceItemDto {
  id: number
  name: string
  normalizedName: string
  iconName: string
}

export interface ReviewDto {
  id: number
  user: { id: string; name: string; normalizedName: string } | null
  rating: number
  comment: string | null
  appointmentId: number | null
}

export enum DoctorExternalLinkType {
  Instagram = 1,
  Facebook = 2,
  TikTok = 3,
  WhatsApp = 4,
  Website = 5,
  Custom = 6,
}

export interface DoctorExternalLinkDto {
  id: number
  type: DoctorExternalLinkType
  value: string
  displayName: string | null
  displayOrder: number
  isActive: boolean
}

export interface AppReleaseResponse {
  id: number
  versionName: string
  versionCode: number
  downloadUrl: string
  fileSize: string
  releaseNotes: string[]
  isActive: boolean
  createdAt: string
  downloadCount: number
}