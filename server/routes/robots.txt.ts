export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const origin = String(config.public.siteUrl || 'https://eyadaty.techumbrella.net').replace(/\/+$/, '')
  const appBase = String(config.app.baseURL || '/')
  const basePath = appBase === '/' ? '' : `/${appBase.replace(/^\/+|\/+$/g, '')}`
  const site = basePath && !origin.endsWith(basePath) ? `${origin}${basePath}` : origin

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n')

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})
