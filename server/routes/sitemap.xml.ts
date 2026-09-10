function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
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
      baseURL: apiBase(),
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
  const site = siteUrl()
  const entries: string[] = []

  for (const route of STATIC_ROUTES) {
    entries.push(
      `<url><loc>${site}${route.url === '/' ? '/' : xmlEscape(route.url)}</loc><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`,
    )
  }

  try {
    const [specsResponse, provsResponse, doctors] = await Promise.all([
      $fetch<any>('/Specialization', { baseURL: apiBase() }).catch(() => null),
      $fetch<any>('/IraqiProvince', { baseURL: apiBase() }).catch(() => null),
      fetchAllDoctors(),
    ])

    const specList = specsResponse?.data ?? specsResponse ?? []
    for (const spec of specList) {
      const slug = specializationSlug(spec.normalizedName ?? '')
      if (!slug) continue
      entries.push(`<url><loc>${site}/doctors/${xmlEscape(slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
    }

    const provList = provsResponse?.data ?? provsResponse ?? []
    for (const prov of provList) {
      const slug = provinceSlug(prov.normalizedName ?? '')
      if (!slug) continue
      entries.push(
        `<url><loc>${site}/doctors/governorate/${xmlEscape(slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      )
    }

    for (const doctor of doctors) {
      entries.push(
        `<url><loc>${site}/doctor/${doctor.id}-${xmlEscape(toSlug(doctor.normalizedName) || 'doctor')}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      )
    }
  } catch {
    // Static-only sitemap is still valid if the backend is temporarily unreachable.
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.join('') +
    `</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
})