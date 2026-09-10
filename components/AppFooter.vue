<script setup lang="ts">
const year = new Date().getFullYear()

const columns = [
  {
    title: 'الصفحة',
    links: [
      { label: 'الرئيسية', to: '/' },
      { label: 'من نحن', to: '/about' },
      { label: 'المزايا', to: '/#features' },
      { label: 'التخصصات', to: '/#specializations' },
      { label: 'المحافظات', to: '/#governorates' },
    ],
  },
  {
    title: 'الخدمات',
    links: [
      { label: 'البحث عن الأطباء', to: '/doctors' },
      { label: 'كل التخصصات', to: '/specializations' },
      { label: 'للأطباء', to: '/for-doctors' },
      { label: 'الاشتراكات', to: '/subscriptions' },
      { label: 'تحميل التطبيق', to: '/download' },
    ],
  },
  {
    title: 'الدعم',
    links: [
      { label: 'تواصل معنا', to: '/contact' },
      { label: 'الدعم الفني', to: 'https://eyadaty.techumbrella.net/support' },
      { label: 'سياسة الخصوصية', to: '/privacy' },
      { label: 'شروط الاستخدام', to: '/terms' },
    ],
  },
]
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <div class="app-footer__brand">
        <BrandLogo light />
        <p class="app-footer__desc">
          عيادتي منصة عراقية تساعد المرضى على اكتشاف الأطباء، معرفة معلومات العيادات، أوقات الدوام، الموقع
          والتقييمات وحجز المواعيد.
        </p>
      </div>

      <nav v-for="col in columns" :key="col.title" class="app-footer__col" :aria-label="col.title">
        <h3 class="app-footer__title">{{ col.title }}</h3>
        <ul class="app-footer__list">
          <li v-for="link in col.links" :key="link.to + link.label">
            <NuxtLink :to="link.to" :external="link.to.startsWith('https://')" :target="link.to.startsWith('https://') ? '_blank' : undefined" :rel="link.to.startsWith('https://') ? 'noopener noreferrer' : undefined" class="app-footer__link">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="container app-footer__bottom">
      <p>جميع الحقوق محفوظة © {{ year }} — عيادتي</p>
      <div class="app-footer__social">
        <a href="https://www.facebook.com/eyadaty.iq" target="_blank" rel="noopener nofollow" aria-label="فيسبوك">
          <BaseIcon name="facebook" :size="20" />
        </a>
        <a href="https://www.instagram.com/eyadaty.iq" target="_blank" rel="noopener nofollow" aria-label="انستغرام">
          <BaseIcon name="instagram" :size="20" />
        </a>
        <a href="https://wa.me/9647702920080" target="_blank" rel="noopener nofollow" aria-label="واتساب">
          <BaseIcon name="whatsapp" :size="20" />
        </a>
        <!-- TikTok temporarily disabled.
        <a href="https://www.tiktok.com" target="_blank" rel="noopener nofollow" aria-label="تيك توك">
          <BaseIcon name="music-note-sixteenth-dotted" :size="20" />
        </a>
        -->
        <a href="https://t.me/eyadatyiq" target="_blank" rel="noopener nofollow" aria-label="تيليجرام">
          <BaseIcon name="send" :size="20" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background:
    linear-gradient(135deg, #062c31 0%, #0b4d4f 54%, #102f49 100%);
  color: rgba(255, 255, 255, 0.85);
  padding-top: clamp(36px, 5vw, 56px);
}

.app-footer__inner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.app-footer__desc {
  margin-top: var(--spacing-md);
  max-width: 360px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.68);
}

.app-footer__brand {
  grid-column: 1 / -1;
}

.app-footer__brand :deep(.ey-logo__name) {
  color: #ffffff;
}

.app-footer__inner > * {
  min-width: 0;
  overflow-wrap: anywhere;
}

.app-footer__title {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: var(--spacing-md);
}

.app-footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-footer__link {
  display: inline-flex;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
  transition: color 0.15s ease;
}

.app-footer__link:hover {
  color: #8df4e4;
}

.app-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  padding-block: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

.app-footer__social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.app-footer__social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.75);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.app-footer__social a:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

@media (min-width: 768px) {
  .app-footer__inner {
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
  }

  .app-footer__brand {
    grid-column: auto;
  }
}
</style>
