<script setup lang="ts">
useHead({
  title: 'تحميل التطبيق',
  meta: [
    {
      name: 'description',
      content: 'حمّل تطبيق عيادتي على هاتفك لمتابعة أطبائك، معرفة مواعيدك وحجزها بسهولة.',
    },
    { property: 'og:title', content: 'تحميل تطبيق عيادتي' },
    { property: 'og:url', content: siteUrl('/download') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/download') }],
})

const { androidPlayStoreUrl, iosAppStoreUrl, downloadUrl } = useAppLinks()

const stores = [
  {
    icon: 'apple',
    title: 'App Store',
    active: Boolean(iosAppStoreUrl),
    note: 'قريباً على متجر آبل',
    url: iosAppStoreUrl,
  },
  {
    icon: 'android',
    title: 'Google Play',
    active: Boolean(androidPlayStoreUrl),
    note: 'جرّب نسخة أندرويد مباشرة من زر التحميل أدناه',
    url: androidPlayStoreUrl,
  },
]
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-hero__title">حمّل تطبيق عيادتي</h1>
        <p class="page-hero__subtitle">
          احفظ أطباءك، اعرف أوقات دوامهم، واحجز مواعيدك من جوالك — أينما كنت.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="store-grid">
          <a
            v-for="store in stores"
            :key="store.title"
            :href="store.active ? store.url : undefined"
            :class="['store card', { 'store--active': store.active }]"
            :target="store.active ? '_blank' : undefined"
            :rel="store.active ? 'noopener nofollow' : undefined"
            :aria-disabled="!store.active"
            @click="store.active && useAnalytics().trackAppDownloadClick()"
          >
            <BaseIcon class="store__icon" :name="store.icon" :size="40" />
            <span>
              <strong class="store__title">{{ store.title }}</strong>
              <span class="store__note">{{ store.active ? 'متوفر الآن' : store.note }}</span>
            </span>
          </a>
        </div>

        <div class="mt-4">
          <DownloadAppSection variant="page" />
        </div>

        <p class="hint mt-4">
          إذا كان تطبيق عيادتي مثبتاً على جهازك، استخدم زر «فتح في التطبيق» من صفحات الأطباء لتجربة كاملة.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  background: linear-gradient(160deg, var(--color-primary-soft) 0%, #f6f9f8 55%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border-light);
  text-align: center;
  padding-block: clamp(32px, 6vw, 64px);
}

.page-hero__title {
  font-size: clamp(26px, 4.5vw, 40px);
}

.page-hero__subtitle {
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.store-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  max-width: 560px;
  margin-inline: auto;
}

@media (min-width: 640px) {
  .store-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.store {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  justify-content: center;
  border-color: var(--color-border);
  text-decoration: none;
}

.store--active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(19, 121, 107, 0.12);
}

.store__icon {
  color: var(--color-text-muted);
}

.store--active .store__icon {
  color: var(--color-primary);
}

.store__title {
  display: block;
  font-size: 18px;
  color: var(--color-text);
}

.store__note {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.mt-4 {
  margin-top: var(--spacing-2xl);
}

.hint {
  max-width: 560px;
  margin-inline: auto;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
}
</style>