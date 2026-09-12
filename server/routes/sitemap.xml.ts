function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function publicSiteUrl(): string {
  const config = useRuntimeConfig()
  const origin = String(config.public.siteUrl || 'https://eyadaty.techumbrella.net').replace(/\/+$/, '')
  const appBase = String(config.app.baseURL || '/')
  const basePath = appBase === '/' ? '' : `/${appBase.replace(/^\/+|\/+$/g, '')}`
  return basePath && !origin.endsWith(basePath) ? `${origin}${basePath}` : origin
}

function publicApiBase(): string {
  return String(useRuntimeConfig().public.apiBase || 'https://eyadaty.techumbrella.net/api').replace(/\/+$/, '')
}

function normalizedSlug(value: string | null | undefined): string {
  return String(value || '').trim().toLowerCase()
}

function doctorNameSlug(value: string | null | undefined): string {
  if (!value) return 'doctor'
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ت')
    .replace(/[\u0600-\u06FF\s]+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'doctor'
}

const STATIC_ROUTES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/doctors', changefreq: 'daily', priority: '0.9' },
  { url: '/specializations', changefreq: 'weekly', priority: '0.7' },
  { url: '/about', changefreq: 'monthly', priority: '0.5' },
  { url: '/for-doctors', changefreq: 'monthly', priority: '0.6' },
  { url: '/contact', changefreq: 'monthly', priority: '0.4' },
  { url: '/download', changefreq: 'monthly', priority: '0.6' },
  { url: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { url: '/terms', changefreq: 'yearly', priority: '0.2' },
]

async function fetchAllDoctors(): Promise<{ id: number; normalizedName: string }[]> {
  const all: { id: number; normalizedName: string }[] = []
  let page = 1
  const pageSize = 100

  while (page <= 200) {
    const res = await $fetch<any>('/Doctor/public', {
      baseURL: publicApiBase(),
      query: { page, pageSize },
    }).catch(() => null)
    const data = res?.data
    if (!data?.items?.length) break
    for (const item of data.items) {
      all.push({ id: item.id, normalizedName: item.normalizedName ?? '' })
    }
    if (page >= data.totalPages) break
    page += 1
  }
  return all
}

export default defineEventHandler(async (event) => {
  const site = publicSiteUrl()
  const entries = new Map<string, { changefreq: string; priority: string }>()

  const addEntry = (path: string, changefreq: string, priority: string) => {
    const cleanPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
    entries.set(`${site}${cleanPath}`, { changefreq, priority })
  }

  for (const route of STATIC_ROUTES) {
    addEntry(route.url, route.changefreq, route.priority)
  }

  try {
    const [specsResponse, provsResponse, doctors] = await Promise.all([
      $fetch<any>('/Specialization', { baseURL: publicApiBase() }).catch(() => null),
      $fetch<any>('/IraqiProvince', { baseURL: publicApiBase() }).catch(() => null),
      fetchAllDoctors(),
    ])

    const specList = specsResponse?.data ?? specsResponse ?? []
    for (const spec of specList) {
      const slug = normalizedSlug(spec.normalizedName)
      if (!slug) continue
      addEntry(`/doctors/${slug}`, 'weekly', '0.7')
    }

    const provList = provsResponse?.data ?? provsResponse ?? []
    for (const prov of provList) {
      const slug = normalizedSlug(prov.normalizedName)
      if (!slug) continue
      addEntry(`/doctors/governorate/${slug}`, 'weekly', '0.7')
    }

    for (const doctor of doctors) {
      addEntry(`/doctor/${doctor.id}-${doctorNameSlug(doctor.normalizedName)}`, 'daily', '0.8')
    }
  } catch {
    // Static-only sitemap is still valid if the backend is temporarily unreachable.
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    [...entries.entries()]
      .map(
        ([url, metadata]) =>
          `<url><loc>${xmlEscape(url)}</loc><changefreq>${metadata.changefreq}</changefreq><priority>${metadata.priority}</priority></url>`,
      )
      .join('') +
    `</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
})
