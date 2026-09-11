<script setup lang="ts">
import type { ProvinceItemDto, SpecializationDto } from '~/types'
import { provinceSlug, specializationSlug } from '~/utils/slug'

useHead({
  title: 'عيادتي | ابحث واحجز طبيبك في العراق',
  meta: [
    {
      name: 'description',
      content:
        'عيادتي تجمع لك الأطباء والاختصاصات والمحافظات ومعلومات العيادات والحجز في تجربة عراقية سهلة من البحث إلى الموعد.',
    },
    { property: 'og:title', content: 'عيادتي | طبيبك أقرب مما تتوقع' },
    { property: 'og:description', content: 'ابحث عن الطبيب المناسب، اعرف الدوام والموقع، واحجز موعدك بسهولة.' },
    { property: 'og:url', content: siteUrl() },
    { property: 'og:image', content: siteAssetUrl('/onWhiteBG.png') },
  ],
  link: [{ rel: 'canonical', href: siteUrl() }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            name: 'عيادتي',
            alternateName: 'Eyaadaty',
            url: siteUrl(),
            logo: siteAssetUrl('/onWhiteBG.png'),
            sameAs: [],
            description:
              'منصة عراقية تساعد المرضى على اكتشاف الأطباء، معرفة معلومات العيادات، أوقات الدوام، الموقع، التقييمات وحجز المواعيد.',
          },
          {
            '@type': 'WebSite',
            name: 'عيادتي',
            url: siteUrl(),
            potentialAction: {
              '@type': 'SearchAction',
              'query-input': 'required name=search_term_string',
              target: `${siteUrl()}/doctors?name={search_term_string}`,
            },
          },
        ],
      }),
    },
  ],
})

const { data: specializations, pending: specsPending, error: specsError, refresh: refreshSpecs } = await useAsyncData<SpecializationDto[]>('home-specializations', () =>
  getSpecializations(),
)

const { data: provinces, pending: provincesPending, error: provincesError, refresh: refreshProvinces } = await useAsyncData<ProvinceItemDto[]>('home-provinces', () => getProvinces())
const { data: homeDoctors, pending: doctorsPending, error: doctorsError, refresh: refreshDoctors } = await useAsyncData(
  'home-doctors-preview', () => searchDoctors({ page: 1, pageSize: 4 }),
)
const previewDoctors = computed(() => (homeDoctors.value?.items ?? []).slice(0, 4))

const featuredSpecializations = computed(() => (specializations.value ?? []).slice(0, 10))
const popularProvinces = computed(() => {
  const order = ['Baghdad', 'Basrah', 'Karbala', 'Najaf', 'Babil', 'Nineveh']
  const list = provinces.value ?? []
  return order
    .map((name) => list.find((p) => p.normalizedName === name))
    .filter((p): p is ProvinceItemDto => Boolean(p))
})
const logoSrc = publicAssetUrl('/onWhiteBG.png')

const highlights = [
  { icon: 'map-marker-radius', value: 'كل العراق', label: 'محافظات وعيادات واضحة' },
  { icon: 'calendar-check', value: 'حجز أسرع', label: 'انتقال مباشر من البحث للموعد' },
  { icon: 'star-outline', value: 'ثقة أعلى', label: 'تقييمات ومعلومات منظمة' },
]

const benefits = [
  { icon: 'magnify', title: 'بحث ذكي', desc: 'اسم الطبيب، الاختصاص، أو المحافظة في نفس المكان.' },
  { icon: 'map-marker-radius', title: 'موقع واضح', desc: 'عنوان العيادة وموقعها يساعدك توصل بدون تخمين.' },
  { icon: 'clock-outline', title: 'دوام مرتب', desc: 'أيام وأوقات الدوام تظهر قبل ما تتواصل أو تحجز.' },
  { icon: 'calendar-check', title: 'حجز مباشر', desc: 'عندما يكون الحجز متاحاً تنتقل للموعد بخطوات قليلة.' },
]

const steps = [
  { icon: 'magnify', title: 'ابحث', desc: 'حدد الطبيب أو الاختصاص والمحافظة.' },
  { icon: 'account-search', title: 'قارن', desc: 'راجع الموقع والدوام والتقييمات.' },
  { icon: 'calendar-check', title: 'احجز', desc: 'كمل الموعد أو افتح التطبيق للتجربة الكاملة.' },
]

function onSearch(payload: { name: string; specialization: number | null; province: number | null }) {
  const { trackDoctorSearch } = useAnalytics()
  trackDoctorSearch({
    searchText: payload.name || undefined,
    specializationId: payload.specialization ?? undefined,
    province: payload.province != null ? String(payload.province) : undefined,
  })
  const query: Record<string, string> = {}
  if (payload.name) query.name = payload.name
  if (payload.specialization != null) query.specialization = String(payload.specialization)
  if (payload.province != null) query.province = String(payload.province)
  navigateTo({ path: '/doctors', query })
}

function specHref(spec: SpecializationDto) {
  return `/doctors/${specializationSlug(spec.normalizedName)}`
}

function provinceHref(province: ProvinceItemDto) {
  return `/doctors/governorate/${provinceSlug(province.normalizedName)}`
}
</script>

<template>
  <main class="one-page">
    <section id="home" class="hero-stage" aria-labelledby="hero-title">
      <div class="motion-field" aria-hidden="true">
        <span class="motion-field__line motion-field__line--one" />
        <span class="motion-field__line motion-field__line--two" />
        <span class="motion-field__wave motion-field__wave--one" />
        <span class="motion-field__wave motion-field__wave--two" />
      </div>

      <div class="container hero-stage__inner">
        <div class="hero-copy">
          <span class="hero-copy__kicker">
            <BaseIcon name="heart-pulse" :size="18" />
            منصة عراقية للبحث والحجز الطبي
          </span>

          <h1 id="hero-title" class="hero-copy__title">
            كل طريقك للطبيب المناسب في صفحة واحدة.
          </h1>

          <p class="hero-copy__subtitle">
            ابحث، اعرف موقع العيادة وأوقات الدوام، وشوف معلومات الحجز بدون تنقل زائد.
          </p>

          <div class="hero-copy__actions">
            <NuxtLink to="/download" class="btn btn--primary btn--lg" @click="useAnalytics().trackAppDownloadClick()">
              <BaseIcon name="cellphone-arrow-down" :size="22" />
              تحميل التطبيق
            </NuxtLink>
            <NuxtLink to="/#contact" class="btn btn--secondary btn--lg">
              <BaseIcon name="headset" :size="21" />
              الدعم والمساعدة
            </NuxtLink>
          </div>
        </div>

        <aside class="hero-visual" aria-label="لمحة عن تجربة عيادتي">
          <div class="phone-shell">
            <div class="phone-shell__top">
              <img :src="logoSrc" alt="" width="48" height="48" />
              <span>
                <strong>عيادتي</strong>
                <small>موعدك أقرب</small>
              </span>
            </div>
            <div class="hero-search-panel hero-search-panel--phone" aria-label="البحث عن طبيب">
              <div class="hero-search-panel__head">
                <span>ابحث عن طبيبك</span>
                <small>بالاسم أو الاختصاص أو المحافظة</small>
              </div>
              <DoctorSearchForm
                :specializations="specializations ?? []"
                :provinces="provinces ?? []"
                submit-label="ابحث عن طبيب"
                @submit="onSearch"
              />
            </div>
          </div>

          <div class="hero-metrics">
            <div v-for="item in highlights" :key="item.value" class="hero-metric">
              <BaseIcon :name="item.icon" :size="21" />
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </aside>

      </div>
    </section>

    <section id="about" class="flow-section flow-section--features" aria-labelledby="about-title">
      <div class="container split-layout">
        <div class="section-head">
          <span class="section-eyebrow">من نحن</span>
          <h2 id="about-title" class="section-title">عيادتي: معلومات للمريض وتنظيم للطبيب</h2>
          <p class="section-subtitle">منصة عراقية تجمع البحث عن الأطباء ومعلومات العيادات مع أدوات إدارة المواعيد. هدفنا أن يعرف المراجع أين يذهب ومتى، وأن يجد الطبيب معلومات يومه في مكان واحد.</p>
          <NuxtLink to="/about" class="text-link mt-3">تعرّف على عيادتي <BaseIcon name="arrow-left" :size="18" /></NuxtLink>
        </div>
        <div class="feature-grid">
          <article class="feature-tile">
            <h3>للمراجع</h3>
            <p>ابحث بالمحافظة والاختصاص، راجع العنوان والدوام، وتعرّف على طريقة الحجز المتاحة عند الطبيب قبل التواصل.</p>
          </article>
          <article class="feature-tile">
            <h3>للطبيب والعيادة</h3>
            <p>اعرض معلوماتك وحدّث بيانات عياداتك، ونظّم أوقات الدوام وتابع الحجوزات من أدوات حساب الطبيب.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="specializations" class="flow-section" aria-labelledby="specs-title">
      <div class="container">
        <div class="compact-head">
          <div>
            <span class="section-eyebrow">التخصصات</span>
            <h2 id="specs-title" class="section-title">اختصر الطريق حسب الحالة</h2>
          </div>
          <NuxtLink to="/specializations" class="text-link">
            كل التخصصات
            <BaseIcon name="arrow-left" :size="18" />
          </NuxtLink>
        </div>

        <StateSkeleton v-if="specsPending" :count="3" />
        <ErrorState v-else-if="specsError" message="تعذر تحميل التخصصات." @retry="refreshSpecs()" />
        <p v-else-if="!featuredSpecializations.length" class="section-subtitle">لا توجد تخصصات متاحة حالياً.</p>
        <div v-else class="specialty-rail">
          <NuxtLink
            v-for="spec in featuredSpecializations"
            :key="spec.id"
            :to="specHref(spec)"
            class="specialty-pill"
            @click="useAnalytics().trackSpecializationSearch(spec.id)"
          >
            <span class="specialty-pill__icon">
              <BaseIcon :name="specializationIconName(spec.normalizedName)" :size="24" />
            </span>
            <span>{{ spec.name }}</span>
            <BaseIcon name="chevron-left" :size="18" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="governorates" class="flow-section flow-section--map" aria-labelledby="gov-title">
      <div class="container governorate-band">
        <div class="governorate-band__copy">
          <span class="section-eyebrow section-eyebrow--light">المحافظات</span>
          <h2 id="gov-title" class="section-title">اختار محافظتك وشوف الأطباء الأقرب</h2>
          <p class="section-subtitle">
            روابط مباشرة لقوائم الأطباء حسب المحافظة، مع بقاء البحث التفصيلي متاحاً في صفحة الأطباء.
          </p>
        </div>

        <StateSkeleton v-if="provincesPending" :count="3" />
        <div v-else-if="provincesError" class="province-status"><ErrorState message="تعذر تحميل المحافظات." @retry="refreshProvinces()" /></div>
        <p v-else-if="!popularProvinces.length">لا توجد محافظات متاحة حالياً.</p>
        <div v-else class="province-grid">
          <NuxtLink
            v-for="province in popularProvinces"
            :key="province.id"
            :to="provinceHref(province)"
            class="province-link"
            @click="useAnalytics().trackGovernorateSearch(province.name)"
          >
            <BaseIcon name="map-marker-radius" :size="22" />
            <span>أطباء {{ province.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="doctor-benefits" class="flow-section" aria-labelledby="doctor-benefits-title">
      <div class="container">
        <div class="compact-head">
          <div>
            <span class="section-eyebrow">مميزات الأطباء</span>
            <h2 id="doctor-benefits-title" class="section-title">شنو يضيف عيادتي ليومك بالعيادة؟</h2>
          </div>
          <NuxtLink to="/for-doctors" class="text-link">المميزات وخطوات البدء <BaseIcon name="arrow-left" :size="18" /></NuxtLink>
        </div>
        <div class="feature-grid">
          <article class="feature-tile"><span class="feature-tile__icon"><BaseIcon name="calendar-check" :size="26" /></span><h3>مواعيدك بحالات واضحة</h3><p>تابع طلبات الحجز والمواعيد القادمة، وسجّل اكتمال الزيارة أو رفض الطلب المعلّق من حساب الطبيب.</p></article>
          <article class="feature-tile"><span class="feature-tile__icon"><BaseIcon name="clock-outline" :size="26" /></span><h3>دوام مناسب لكل عيادة</h3><p>حدّد جدول الدوام الأسبوعي وعدّل يوماً محدداً، مع إدارة استثناءات الدوام والعطل.</p></article>
          <article class="feature-tile"><span class="feature-tile__icon"><BaseIcon name="account-plus" :size="26" /></span><h3>الحجوزات الهاتفية أيضاً</h3><p>أضف الموعد يدوياً للحجوزات التي تصل للعيادة خارج الحجز الإلكتروني، لتتابعها ضمن قائمة المواعيد.</p></article>
          <article class="feature-tile"><span class="feature-tile__icon"><BaseIcon name="chart-bar" :size="26" /></span><h3>متابعة نشاط الحجوزات</h3><p>راجع إحصائيات المواعيد والحجز القادم، إلى جانب ملفك العام وروابطك ومعلومات التواصل مع عياداتك.</p></article>
        </div>
      </div>
    </section>

    <section id="features" class="flow-section flow-section--features" aria-labelledby="features-title">
      <div class="container split-layout">
        <div class="section-head">
          <span class="section-eyebrow">ليش عيادتي؟</span>
          <h2 id="features-title" class="section-title">تجربة مرتبة من أول بحث لحد باب العيادة</h2>
          <p class="section-subtitle">
            الصفحة تجمع أهم القرارات التي يحتاجها المريض: من هو الطبيب، أين العيادة، متى الدوام، وكيف يبدأ الحجز.
          </p>
        </div>

        <div class="feature-grid">
          <article v-for="benefit in benefits" :key="benefit.title" class="feature-tile">
            <span class="feature-tile__icon">
              <BaseIcon :name="benefit.icon" :size="26" />
            </span>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="flow-section" aria-labelledby="how-title">
      <div class="container">
        <div class="compact-head compact-head--center">
          <div>
            <span class="section-eyebrow">الخطوات</span>
            <h2 id="how-title" class="section-title">من البحث إلى الموعد بدون تعقيد</h2>
          </div>
        </div>

        <ol class="journey">
          <li v-for="(step, index) in steps" :key="step.title" class="journey__item">
            <span class="journey__number">{{ index + 1 }}</span>
            <span class="journey__icon">
              <BaseIcon :name="step.icon" :size="26" />
            </span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section id="doctors-preview" class="flow-section" aria-labelledby="doctors-preview-title">
      <div class="container">
        <div class="compact-head">
          <div><span class="section-eyebrow">أطباء عيادتي</span><h2 id="doctors-preview-title" class="section-title">تعرّف على الأطباء</h2></div>
          <NuxtLink to="/doctors" class="text-link">عرض المزيد <BaseIcon name="arrow-left" :size="18" /></NuxtLink>
        </div>
        <StateSkeleton v-if="doctorsPending" :count="4" />
        <ErrorState v-else-if="doctorsError" message="تعذر تحميل الأطباء." @retry="refreshDoctors()" />
        <div v-else-if="previewDoctors.length" class="home-doctors-grid">
          <DoctorCard v-for="doctor in previewDoctors" :key="doctor.id" :doctor="doctor" />
        </div>
        <EmptyState v-else icon="account-search" title="لا يوجد أطباء للعرض حالياً" message="يمكنك زيارة صفحة الأطباء والبحث حسب المحافظة والاختصاص." action-to="/doctors" action-label="البحث عن طبيب" />
      </div>
    </section>

    <section id="subscriptions" aria-label="اشتراكات الأطباء"><SubscriptionPlans embedded /></section>

    <section id="contact" aria-label="تواصل معنا"><ContactSection embedded /></section>

    <section id="download" class="flow-section flow-section--download">
      <div class="container">
        <DownloadAppSection />
      </div>
    </section>
  </main>
</template>

<style scoped>
.one-page {
  position: relative;
  overflow-x: clip;
  background:
    linear-gradient(180deg, rgba(247, 251, 250, 0.96) 0%, rgba(255, 255, 255, 0.98) 42%, rgba(242, 247, 246, 0.96) 100%);
}

.province-status { background: var(--color-surface); color: var(--color-text); border-radius: 8px; padding: 16px; }

.home-doctors-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 1050px) { .home-doctors-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .home-doctors-grid { grid-template-columns: minmax(0, 1fr); } }

.hero-stage {
  position: relative;
  isolation: isolate;
  min-height: 640px;
  display: flex;
  align-items: center;
  padding-block: clamp(48px, 7vw, 92px);
  background: #084d50;
  color: #fff;
}

.hero-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.075) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.85) 54%, transparent 86%);
}

.motion-field {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.motion-field__line {
  position: absolute;
  height: 2px;
  width: min(620px, 58vw);
  opacity: 0.56;
  background: linear-gradient(90deg, transparent, rgba(126, 231, 215, 0.72), transparent);
  animation: driftLine 8s ease-in-out infinite alternate;
}

.motion-field__line--one {
  top: 20%;
  inset-inline-start: 8%;
}

.motion-field__line--two {
  bottom: 24%;
  inset-inline-start: 17%;
  animation-delay: -2.5s;
}

.motion-field__wave {
  position: absolute;
  width: 42vw;
  min-width: 320px;
  height: 180px;
  border: 1px solid rgba(120, 227, 212, 0.18);
  border-inline: 0;
  transform: rotate(-9deg);
  animation: breatheWave 7s ease-in-out infinite;
}

.motion-field__wave--one {
  top: 12%;
  inset-inline-end: 4%;
}

.motion-field__wave--two {
  bottom: 10%;
  inset-inline-end: 14%;
  animation-delay: -3s;
}

.hero-stage__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(330px, 0.78fr);
  gap: clamp(28px, 6vw, 72px);
  align-items: center;
}

.hero-copy {
  max-width: 760px;
}

.hero-copy__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.hero-copy__title {
  margin-top: 20px;
  max-width: 720px;
  color: #fff;
  font-size: 48px;
  line-height: 1.45;
}

.hero-copy__subtitle {
  margin-top: 18px;
  max-width: 620px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 19px;
  line-height: 1.85;
}

.hero-search-panel {
  width: 100%;
  margin-top: 20px;
  padding: clamp(14px, 2vw, 18px);
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(0, 28, 31, 0.22);
  backdrop-filter: blur(14px);
}

.hero-search-panel :deep(.search-form) {
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
}

.hero-search-panel :deep(.search-form__field--grow),
.hero-search-panel :deep(.search-form > .btn) {
  grid-column: auto;
}

.hero-search-panel--phone {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
}

.hero-search-panel__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  color: var(--color-text);
}

.hero-search-panel__head span {
  font-size: 20px;
  font-weight: 800;
}

.hero-search-panel__head small {
  color: var(--color-text-muted);
  font-size: 13px;
}

.hero-copy__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.hero-visual {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.phone-shell {
  position: relative;
  min-height: 420px;
  width: 100%;
  padding: 24px;
  border: 1px solid rgba(10, 58, 61, 0.12);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(240, 248, 247, 0.92)),
    repeating-linear-gradient(135deg, rgba(18, 128, 121, 0.08) 0 1px, transparent 1px 18px);
  color: var(--color-text);
  box-shadow: 0 32px 80px rgba(10, 56, 60, 0.2);
  overflow: hidden;
  animation: floatPanel 5.6s ease-in-out infinite;
}

.phone-shell__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.phone-shell__top img {
  border-radius: 14px;
  box-shadow: 0 14px 26px rgba(14, 99, 92, 0.24);
}

.phone-shell__top strong,
.mini-card strong {
  display: block;
  font-size: 16px;
}

.phone-shell__top small,
.mini-card small {
  display: block;
  color: var(--color-text-muted);
  font-size: 13px;
  margin-top: 2px;
}

.phone-shell__pulse {
  position: relative;
  margin-block: 24px;
  height: 126px;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(19, 121, 107, 0.1), rgba(19, 121, 107, 0.02)),
    repeating-linear-gradient(90deg, transparent 0 26px, rgba(19, 121, 107, 0.06) 26px 27px);
  overflow: hidden;
}

.phone-shell__pulse span {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0 8%, #13796b 8% 10%, transparent 10% 18%, #13796b 18% 20%, transparent 20% 30%, #13796b 30% 32%, transparent 32% 100%);
  clip-path: polygon(0 55%, 9% 55%, 13% 35%, 17% 76%, 22% 48%, 29% 48%, 34% 24%, 40% 83%, 46% 55%, 100% 55%, 100% 100%, 0 100%);
  opacity: 0.72;
  animation: pulseScan 3.4s linear infinite;
}

.mini-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(19, 121, 107, 0.13);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 42px rgba(16, 70, 72, 0.12);
  backdrop-filter: blur(8px);
}

.mini-card :deep(svg) {
  color: var(--color-primary);
}

.mini-card--doctor {
  margin-bottom: 12px;
}

.mini-card--clinic {
  margin-bottom: 0;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.hero-metric {
  min-height: 112px;
  padding: 14px;
  border: 1px solid rgba(19, 121, 107, 0.16);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.82);
  color: var(--color-text);
  box-shadow: 0 18px 38px rgba(13, 64, 69, 0.08);
}

.hero-metric svg {
  color: var(--color-primary);
}

.hero-metric strong,
.hero-metric span {
  display: block;
}

.hero-metric strong {
  margin-top: 8px;
  font-size: 17px;
}

.hero-metric span {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.45;
}

.flow-section {
  position: relative;
  padding-block: clamp(52px, 8vw, 92px);
}

.flow-section--features {
  background: #ffffff;
}

.split-layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 60px);
  align-items: start;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.feature-tile {
  min-height: 210px;
  padding: 22px;
  border: 1px solid rgba(19, 121, 107, 0.12);
  border-radius: var(--radius-sm);
  background:
    linear-gradient(180deg, #ffffff, #f7fbfa);
  box-shadow: 0 18px 42px rgba(22, 72, 76, 0.07);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.feature-tile:hover {
  transform: translateY(-5px);
  border-color: rgba(19, 121, 107, 0.28);
  box-shadow: 0 22px 50px rgba(22, 72, 76, 0.11);
}

.feature-tile__icon,
.specialty-pill__icon,
.journey__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, rgba(19, 121, 107, 0.12), rgba(32, 91, 168, 0.09));
  color: var(--color-primary);
}

.feature-tile h3 {
  margin-top: 18px;
  font-size: 20px;
}

.feature-tile p {
  margin-top: 8px;
  color: var(--color-text-muted);
  font-size: 15px;
  line-height: 1.8;
}

.compact-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.compact-head--center {
  justify-content: center;
  text-align: center;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 800;
}

.specialty-rail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.specialty-pill {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 12px;
  min-height: 82px;
  padding: 14px;
  border: 1px solid rgba(16, 98, 92, 0.14);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 14px 34px rgba(16, 70, 72, 0.07);
  color: var(--color-text);
  font-weight: 800;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.specialty-pill:hover {
  transform: translateY(-4px);
  border-color: rgba(19, 121, 107, 0.32);
  background: #ffffff;
}

.specialty-pill > span:nth-child(2) {
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.6;
}

.specialty-pill > svg {
  color: var(--color-text-muted);
}

.flow-section--map {
  padding-block: clamp(42px, 6vw, 76px);
}

.governorate-band {
  display: grid;
  grid-template-columns: 0.72fr 1fr;
  gap: clamp(24px, 5vw, 54px);
  align-items: center;
  padding-block: clamp(32px, 5vw, 54px);
  border-radius: var(--radius-md);
  background:
    linear-gradient(135deg, rgba(7, 67, 71, 0.98), rgba(16, 103, 96, 0.94)),
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 22px);
  box-shadow: 0 28px 70px rgba(6, 50, 54, 0.17);
}

.governorate-band__copy {
  padding-inline: clamp(20px, 4vw, 42px);
}

.governorate-band .section-title {
  color: #fff;
}

.governorate-band .section-subtitle {
  color: rgba(255, 255, 255, 0.76);
}

.section-eyebrow--light {
  background: rgba(255, 255, 255, 0.12);
  color: #b8fff2;
}

.province-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-inline-end: clamp(20px, 4vw, 42px);
}

.province-link {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 13px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 800;
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.province-link:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.16);
}

.journey {
  position: relative;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
}

.journey::before {
  content: '';
  position: absolute;
  top: 24px;
  inset-inline: 14%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(19, 121, 107, 0.28), transparent);
}

.journey__item {
  position: relative;
  padding: 26px 22px;
  border: 1px solid rgba(19, 121, 107, 0.12);
  border-radius: var(--radius-sm);
  background: #fff;
  box-shadow: 0 18px 42px rgba(22, 72, 76, 0.07);
}

.journey__number {
  position: absolute;
  inset-inline-end: 18px;
  top: 18px;
  color: rgba(19, 121, 107, 0.18);
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.journey__item h3 {
  margin-top: 16px;
  font-size: 21px;
}

.journey__item p {
  margin-top: 8px;
  color: var(--color-text-muted);
  line-height: 1.75;
}

.flow-section--download {
  padding-top: 18px;
}

@keyframes driftLine {
  from {
    transform: translateX(0) scaleX(0.78);
  }
  to {
    transform: translateX(-80px) scaleX(1);
  }
}

@keyframes breatheWave {
  0%, 100% {
    transform: translateY(0) rotate(-9deg);
    opacity: 0.42;
  }
  50% {
    transform: translateY(18px) rotate(-7deg);
    opacity: 0.74;
  }
}

@keyframes floatPanel {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes pulseScan {
  from {
    transform: translateX(40%);
  }
  to {
    transform: translateX(-42%);
  }
}

@media (max-width: 1080px) {
  .hero-stage__inner,
  .split-layout,
  .governorate-band {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    max-width: none;
  }

  .phone-shell {
    max-width: 460px;
    margin-inline: auto;
  }

  .hero-visual {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .province-grid {
    padding-inline: clamp(20px, 4vw, 42px);
  }


  .specialty-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .hero-stage {
    min-height: auto;
    padding-block: 34px 48px;
  }

  .hero-copy__title {
    font-size: 34px;
  }

  .hero-copy__actions,
  .compact-head {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-copy__actions .btn,
  .text-link {
    width: 100%;
  }

  .hero-visual {
    display: none;
  }


  .feature-grid,
  .specialty-rail,
  .province-grid,
  .journey {
    grid-template-columns: 1fr;
  }

  .journey::before {
    display: none;
  }
}

.hero-copy,
.feature-tile,
.governorate-band__copy,
.journey__item {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 480px) {
  .hero-search-panel__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 2px;
  }

  .hero-copy__kicker {
    padding-block: 8px;
    border-radius: 8px;
    font-size: 13px;
  }
}
</style>
