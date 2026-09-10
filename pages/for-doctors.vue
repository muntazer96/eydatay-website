<script setup lang="ts">
useHead({
  title: 'للأطباء',
  meta: [
    {
      name: 'description',
      content: 'انضم إلى عيادتي — اعرض ملفك، عياداتك وأوقات الدوام لملايين المرضى في العراق. إدارة سهلة، حجز إلكتروني، ومتابعة مركزية.',
    },
    { property: 'og:title', content: 'للأطباء | عيادتي' },
    { property: 'og:url', content: siteUrl('/for-doctors') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/for-doctors') }],
})

const features = [
  { icon: 'account-badge', title: 'ملف طبي احترافي', desc: 'صفحة تعريفية تعرض تخصصك، مؤهلاتك، عياداتك وأوقات الدوام.' },
  { icon: 'calendar-check', title: 'حجز إلكتروني', desc: 'فعّل الحجز الإلكتروني وركّز على مواعيدك دون مكالمات.' },
  { icon: 'map-marker-radius', title: 'معلومات دقيقة', desc: 'عنوان العيادة، الموقع، الأسعار وأوقات العمل بالتفصيل.' },
  { icon: 'star-outline', title: 'تقييمات موثوقة', desc: 'ردود فعل المرضى تساعدك على بناء سمعتك وتحسين جودة الخدمة.' },
  { icon: 'cellphone', title: 'تطبيق مخصص', desc: 'إدارة مواعيدك ومتابعة يومك من تطبيق عيادتي على جوالك.' },
  { icon: 'chart-bar', title: 'وصول أوسع', desc: 'ليراك المرضى الباحثون عن طبيبك في مدينتك أو تخصصك.' },
]

const steps = [
  { icon: 'account-plus', title: 'سجّل ملفك', desc: 'أنشئ حسابك الطبي وأضف معلومات تخصصك ومؤهلاتك.' },
  { icon: 'hospital-building', title: 'أضف عياداتك', desc: 'حدد عياداتك وأوقاتي الدوام وأسعارك للمرضى.' },
  { icon: 'check-decagram', title: 'تحقق ونشر', desc: 'بعد التحقق، يظهر ملفك للمرضى ليبحثوا ويحجزوا بسهولة.' },
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">لأن وقتك ثمين</p>
        <h1 class="page-hero__title">منظّمتك، ملفك، ومرضاكم — في مكان واحد</h1>
        <p class="page-hero__subtitle">
          اعرض ملفك الطبي، عياداتك وأوقات الدوام بسهولة، ووسّع وصولك إلى المرضى في جميع محافظات العراق.
        </p>
        <div class="page-hero__actions">
          <NuxtLink to="/download" class="btn btn--primary btn--lg" @click="useAnalytics().trackDoctorRegistrationClick()">
            <BaseIcon name="calendar-check" :size="22" />
            ابدأ التسجيل
          </NuxtLink>
          <NuxtLink to="/#how-it-works" class="btn btn--ghost btn--lg">
            تعرف على عيادتي
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section" aria-labelledby="for-docs-features">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 id="for-docs-features" class="section-title">كل ما تحتاجه لإدارة ملفك</h2>
          <p class="section-subtitle">أدوات مصممة خصيصًا لتجوّة الطبيب العراقي.</p>
        </div>

        <div class="grid grid--benefits">
          <div v-for="f in features" :key="f.title" class="benefit card card--hover">
            <span class="benefit__icon">
              <BaseIcon :name="f.icon" :size="28" />
            </span>
            <h3 class="benefit__title">{{ f.title }}</h3>
            <p class="benefit__desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps -->
    <section class="section how-section" aria-labelledby="for-docs-steps">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 id="for-docs-steps" class="section-title">ثلاث خطوات للانطلاق</h2>
          <p class="section-subtitle">البداية أسهل مما تتوقع.</p>
        </div>

        <ol class="steps">
          <li v-for="(step, i) in steps" :key="step.title" class="step card">
            <span class="step__num">{{ i + 1 }}</span>
            <span class="step__icon"><BaseIcon :name="step.icon" :size="30" /></span>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__desc">{{ step.desc }}</p>
          </li>
        </ol>

        <div class="text-center mt-4" id="register">
          <p class="register-note">
            التسجيل الأول يتم عبر <strong>تطبيق عيادتي</strong> بخطوات بسيطة — حمّل التطبيق وابدأ.
          </p>
          <NuxtLink to="/download" class="btn btn--primary btn--lg" @click="useAnalytics().trackDoctorRegistrationClick()">
            <BaseIcon name="cellphone-arrow-down" :size="22" />
            حمّل تطبيق عيادتي وابدأ
          </NuxtLink>
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

.eyebrow {
  display: inline-block;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: 800;
  font-size: 14px;
}

.page-hero__title {
  max-width: 720px;
  margin-inline: auto;
  font-size: clamp(26px, 4.5vw, 40px);
}

.page-hero__subtitle {
  max-width: 640px;
  margin-inline: auto;
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.page-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-xl);
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

.how-section {
  background: var(--color-surface);
  border-block: 1px solid var(--color-border-light);
}

.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

.step {
  position: relative;
  padding: var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
}

.step__num {
  position: absolute;
  top: 14px;
  inset-inline-end: 16px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
}

.step__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: var(--spacing-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.step__title {
  font-size: 19px;
  margin-bottom: 6px;
}

.step__desc {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
}

@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
  }
}

.register-note {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.mt-4 {
  margin-top: var(--spacing-2xl);
}

.text-center {
  text-align: center;
}
</style>