import * as mdi from '@mdi/js'

type MdiModule = typeof mdi

function pascal(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** Resolve a kebab-case icon name (e.g. "map-marker-radius") to an MDI path. */
export function mdiPath(name: string): string {
  const key = `mdi${pascal(name)}`
  const module = mdi as MdiModule
  const path = (module as Record<string, string | undefined>)[key]
  return path || mdi.mdiStethoscope
}

export function mdiMarkup(name: string): string {
  return mdiPath(name)
}

/** Maps a specialization normalized name to an MDI icon name. */
const specializationIcons: Record<string, string> = {
  'internal-medicine': 'briefcase-medical',
  ent: 'ear-hearing',
  cardiology: 'heart-pulse',
  ophthalmology: 'eye',
  dermatology: 'emoticon-outline',
  neurology: 'brain',
  'general-surgery': 'content-cut',
  orthopedics: 'bone',
  gynecology: 'account-group',
  pediatrics: 'baby-face-outline',
  oncology: 'microscope',
  nephrology: 'water',
  gastroenterology: 'food-apple',
  endocrinology: 'chart-bell-curve',
  'plastic-surgery': 'face-man-shimmer',
  neurosurgery: 'brain',
  anesthesiology: 'needle',
  'family-medicine': 'hospital-building',
  psychiatry: 'brain',
  'infectious-disease': 'shield-alert',
  radiology: 'radioactive',
  emergency: 'heart-pulse',
  rheumatology: 'human-cane',
  pulmonology: 'weather-windy',
  'occupational-medicine': 'briefcase-medical',
  'sports-medicine': 'dumbbell',
  hematology: 'water',
  physiotherapy: 'human-cane',
  nutrition: 'food-apple',
  'speech-therapy': 'message-text-outline',
  urology: 'water-pump',
  'vascular-surgery': 'blood-bag',
  'thoracic-surgery': 'lungs',
  'cardiac-surgery': 'heart-plus',
  dentistry: 'tooth',
  orthodontics: 'tooth-outline',
  'oral-surgery': 'toothbrush',
  'allergy-immunology': 'shield-check',
  'nuclear-medicine': 'atom',
  'intensive-care': 'hospital-box',
  rehabilitation: 'wheelchair-accessibility',
  geriatrics: 'human-cane',
  'forensic-medicine': 'file-search',
  'medical-genetics': 'dna',
  pharmacy: 'pill',
  laboratory: 'test-tube',
  vaccination: 'needle',
  ambulance: 'ambulance',
  hospital: 'hospital-building',
  'medical-bag': 'medical-bag',
  surgery: 'doctor',
  'health-check': 'clipboard-pulse',
  'mental-health': 'head-heart',
  'womens-health': 'gender-female',
  'mens-health': 'gender-male',
  'primary-care': 'account-heart',
  'pain-management': 'bandage',
  'sleep-medicine': 'sleep',
  'public-health': 'earth',
}

/** Resolve a specialization's icon to an MDI icon name. */
export function specializationIconName(normalizedName?: string | null): string {
  if (!normalizedName) return 'stethoscope'
  return specializationIcons[normalizedName.toLowerCase()] ?? 'stethoscope'
}