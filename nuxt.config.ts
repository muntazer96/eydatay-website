const appBaseURL = process.env.NUXT_APP_BASE_URL || '/website/'
const publicPath = (path: string) => `${appBaseURL.endsWith('/') ? appBaseURL : `${appBaseURL}/`}${path.replace(/^\//, '')}`
const googleSiteVerification = process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  ssr: true,

  experimental: {
    // Keep SSR data in the document so hydration does not depend on a second
    // _payload.json request, which can be reset by the hosting proxy.
    payloadExtraction: false,
  },

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
        ...(googleSiteVerification
          ? [{ name: 'google-site-verification', content: googleSiteVerification }]
          : []),
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
        { rel: 'canonical', href: 'https://eyadaty.techumbrella.net/website/' },
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
      googleSiteVerification: googleSiteVerification || '',
    },
    contactHoneypotAgeMs: 4000,
  },

  routeRules: {
    '/__nuxt_error': { cache: false },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
})
