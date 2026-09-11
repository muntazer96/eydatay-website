const appBaseURL = process.env.NUXT_APP_BASE_URL || '/website/'
const publicPath = (path: string) => `${appBaseURL.endsWith('/') ? appBaseURL : `${appBaseURL}/`}${path.replace(/^\//, '')}`

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  ssr: true,

  modules: [],

  css: [
    '@fontsource/tajawal/400.css',
    '@fontsource/tajawal/500.css',
    '@fontsource/tajawal/700.css',
    '@fontsource/tajawal/800.css',
    '@/assets/css/main.css',
  ],

  app: {
    baseURL: appBaseURL,
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#13796b' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
        {
          name: 'description',
          content:
            'عيادتي — دليلك لإيجاد الأطباء في العراق. ابحث عن الطبيب المناسب، اعرف عنوان العيادة وأوقات الدوام، موقعها، التقييمات ومعلومات الحجز.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'عيادتي' },
        { property: 'og:locale', content: 'ar_IQ' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@eyadaty' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: publicPath('/onWhiteBG.png') },
        { rel: 'apple-touch-icon', href: publicPath('/onWhiteBG.png') },
        { rel: 'canonical', href: 'https://eyadaty.techumbrella.net/' },
      ],
      style: [],
      script: [],
      noscript: [],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://eyadaty.techumbrella.net/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://eyadaty.techumbrella.net',
      androidPlayStoreUrl: process.env.NUXT_PUBLIC_ANDROID_PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.clinicbooking.clinic_app',
      iosAppStoreUrl: process.env.NUXT_PUBLIC_IOS_APP_STORE_URL || '',
      androidPackage: 'com.clinicbooking.clinic_app',
    },
    contactHoneypotAgeMs: 4000,
  },

  routeRules: {
    '/': { swr: 900 },
    '/doctors/**': { swr: 300 },
    '/doctor/**': { swr: 300 },
    '/specializations': { swr: 3600 },
    '/about': { swr: 3600 },
    '/for-doctors': { swr: 3600 },
    '/download': { swr: 3600 },
    '/contact': { swr: 600 },
    '/privacy': { swr: 86400 },
    '/terms': { swr: 86400 },
    '/__nuxt_error': { cache: false },
    '/sitemap.xml': { swr: 3600 },
    '/robots.txt': { swr: 86400 },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
})
