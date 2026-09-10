export default defineEventHandler((event) => {
  const site = String(useRuntimeConfig().public.siteUrl || 'https://eyadaty.techumbrella.net').replace(/\/$/, '')

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /_nuxt/',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n')

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})