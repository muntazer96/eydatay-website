<script setup lang="ts">
useHead({
  title: 'عن عيادتي',
  meta: [
    {
      name: 'description',
      content: 'تعرف على عيادتي — منصة عراقية لربط المرضى بالأطباء وتسهيل اكتشاف المعلومات، المواعيد والحجز.',
    },
    { property: 'og:title', content: 'عن عيادتي | عيادتي' },
    { property: 'og:url', content: siteUrl('/about') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/about') }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'عن عيادتي',
        url: siteUrl('/about'),
        about: {
          '@type': 'Organization',
          name: 'عيادتي',
          description:
            'منصة عراقية تساعد المرضى على اكتشاف الأطباء، معرفة معلومات العيادات، أوقات الدوام، الموقع، التقييمات وحجز المواعيد.',
        },
      }),
    },
  ],
})

const values = [
  { icon: 'shield-check', title: 'معلومات موثوقة', desc: 'نحرص على أن تكون بيانات الأطباء والعيادات محدثة وموثوقة.' },
  { icon: 'heart', title: 'رعاية حقيقية', desc: 'نساعدك على اتخاذ قرار صحي واعٍ أقرب إلى طبيبك الذي تثق به.' },
  { icon: 'map-marker-radius', title: 'قريب منك', desc: 'نغطي جميع محافظات العراق لنقرّب الخدمة الصحية منك.' },
]
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-hero__title">منظومات صحية... عناية بسيطة</h1>
        <p class="page-hero__subtitle">
          عيادتي منصة عراقية أُنشأت لربط المريض بطبيبه بكل سهولة ومصداقية.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="about-text">
          <p>
            في <strong>عيادتي</strong>، نؤمن أن الوصول إلى الطبيب المناسب لا يجب أن يكون معقداً.
            جمعنا لك معلومات الأطباء والعيادات في مكانٍ واحد: الاختصاص، العنوان، أوقات الدوام،
            الموقع، الأسعار والتقييمات — بعيداً عن الالتباس والإعلانات الوهمية.
          </p>
          <p>
            نخدم آلاف الباحثين عن أطباء في جميع محافظات العراق، ونساعد الأطباء والعيادات على
            عرض ملفهم وإدارة مواعيدهم بشكل عصري ومبسط.
          </p>
        </div>

        <div class="grid grid--benefits">
          <div v-for="v in values" :key="v.title" class="benefit card card--hover">
            <span class="benefit__icon"><BaseIcon :name="v.icon" :size="28" /></span>
            <h2 class="benefit__title">{{ v.title }}</h2>
            <p class="benefit__desc">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section cta-section">
      <div class="container">
        <div class="cta-box">
          <h2>شاركنا رحلتنا</h2>
          <p>جرّب عيادتي اليوم واكتشف طبيبك بنفسك.</p>
          <div class="cta-box__actions">
            <NuxtLink to="/doctors" class="btn btn--light btn--lg">
              <BaseIcon name="magnify" :size="20" />
              ابحث عن طبيب
            </NuxtLink>
            <NuxtLink to="/for-doctors" class="btn btn--outline-light btn--lg">
              انضم كطبيب
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  background: linear-gradient(160deg, var(--color-primary-soft) 0%, #f6f9f8 55%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border-light);
  text-align: center;
  padding-block: clamp(40px, 7vw, 80px);
}

.page-hero__title {
  font-size: clamp(26px, 4.5vw, 40px);
}

.page-hero__subtitle {
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.7;
}

.about-text {
  max-width: 720px;
  margin-inline: auto;
  text-align: center;
  color: var(--color-text-secondary);
  line-height: 2;
}

.about-text p + p {
  margin-top: var(--spacing-md);
}

.benefit {
  text-align: center;
  padding: var(--spacing-xl);
}

.benefit__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-bottom: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.benefit__title {
  font-size: 18px;
  margin-bottom: var(--spacing-sm);
}

.benefit__desc {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
}

.cta-section {
  padding-top: 0;
}

.cta-box {
  padding: clamp(24px, 5vw, 48px);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  text-align: center;
  color: #fff;
}

.cta-box h2 {
  color: #fff;
  font-size: 26px;
}

.cta-box p {
  margin-top: var(--spacing-sm);
  color: rgba(255, 255, 255, 0.85);
}

.cta-box__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-xl);
}
</style>