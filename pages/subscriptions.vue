<script setup lang="ts">
interface SubscriptionPackage {
  id: number
  name: string
  normalizedName: string
  price: number
  yearlyPrice: number
  maxClinics: number
  maxDailyAppointments: number
  maxWeeklyDays: number
  maxActiveOffers: number
  eBooking: boolean
  autoApproveAppointments: boolean
  showReviews: boolean
  showMessages: boolean
  makeOffers: boolean
  ePayments: boolean
}

useHead({
  title: 'اشتراكات الأطباء',
  meta: [{ name: 'description', content: 'قارن باقات عيادتي للأطباء: الأساسي والذهبي والألماس والفاخر، والأسعار وحدود الحجوزات ومميزات كل اشتراك.' }],
  link: [{ rel: 'canonical', href: siteUrl('/subscriptions') }],
})

const { data, pending, error, refresh } = await useAsyncData('public-subscription-packages', async () => {
  const response = await apiGetRaw<{ data: SubscriptionPackage[] }>('/SubscriptionPackages/items')
  if (!Array.isArray(response.data)) throw new Error('Invalid packages response')
  return response.data
})
const packages = computed(() => [...(data.value ?? [])].sort((a, b) => a.price - b.price || a.id - b.id))
const featureRows: { key: 'eBooking' | 'autoApproveAppointments' | 'showReviews' | 'showMessages' | 'makeOffers' | 'ePayments'; label: string }[] = [
  { key: 'eBooking', label: 'الحجز الإلكتروني' },
  { key: 'autoApproveAppointments', label: 'الموافقة التلقائية على الحجوزات' },
  { key: 'showReviews', label: 'عرض التقييمات' },
  { key: 'showMessages', label: 'رسائل المراجعين' },
  { key: 'makeOffers', label: 'إنشاء العروض' },
  { key: 'ePayments', label: 'الدفع الإلكتروني' },
]
const commonFeatures = [
  { icon: 'monitor-dashboard', title: 'شاشة الانتظار', description: 'عرض الدور الحالي وإدارة النداء داخل العيادة.' },
  { icon: 'link-variant', title: 'الروابط الخارجية', description: 'إضافة روابطك إلى ملف الطبيب وتنظيمها.' },
  { icon: 'tablet', title: 'الحجز الذاتي', description: 'استقبال بيانات المراجع عبر محطة حجز داخل العيادة.' },
]
const money = (value: number) => new Intl.NumberFormat('ar-IQ').format(value)
function annualDiscount(item: SubscriptionPackage) {
  const fullYear = item.price * 12
  if (fullYear <= 0 || item.yearlyPrice < 0 || item.yearlyPrice >= fullYear) return null
  const saving = fullYear - item.yearlyPrice
  return { saving, percent: new Intl.NumberFormat('ar-IQ', { style: 'percent', maximumFractionDigits: 0 }).format(saving / fullYear) }
}
const isGold = (item: SubscriptionPackage) => item.normalizedName.toLowerCase() === 'gold'
const logoSrc = publicAssetUrl('/onWhiteBG.png')
</script>

<template>
  <main>
    <section class="plans-heading container">
      <img :src="logoSrc" alt="شعار عيادتي" width="80" height="80" />
      <h1>اشتراكات عيادتي للأطباء</h1>
      <p>قارن المميزات وحدود الاستخدام واختار الاشتراك المناسب لعيادتك.</p>
    </section>

    <section class="container plans-section" aria-label="باقات الاشتراك" aria-live="polite">
      <StateSkeleton v-if="pending" :count="4" />
      <ErrorState v-else-if="error" message="تعذر تحميل الاشتراكات. حاول مجدداً." @retry="refresh()" />
      <EmptyState v-else-if="!packages.length" title="لا توجد باقات متاحة حالياً" message="تواصل مع الدعم للاستفسار عن الاشتراكات." icon="information-outline" />
      <div v-else class="plans-grid">
        <article v-for="item in packages" :key="item.id" class="plan" :class="{ 'plan--gold': isGold(item) }">
          <div class="plan__recommendation"><span v-if="isGold(item)"><BaseIcon name="star" :size="16" /> موصى به</span></div>
          <h2>{{ item.name }}</h2>
          <div class="plan__price">
            <strong>{{ item.price === 0 ? 'مجاني' : money(item.price) }}</strong>
            <span v-if="item.price > 0">د.ع / شهر</span>
          </div>
          <p class="plan__alternate-price">
            <BaseIcon name="calendar-range" :size="18" />
            <span>الاشتراك السنوي:
              <strong>{{ item.yearlyPrice === 0 ? 'مجاني' : `${money(item.yearlyPrice)} د.ع` }}</strong>
            </span>
          </p>
          <div v-if="annualDiscount(item)" class="plan__saving">
            <strong>خصم سنوي {{ annualDiscount(item)?.percent }}</strong>
            <span>وفّر {{ money(annualDiscount(item)!.saving) }} د.ع مقارنةً بـ١٢ اشتراكاً شهرياً</span>
            <span>بدلاً من {{ money(item.price * 12) }} د.ع للسنة</span>
          </div>
          <dl class="plan__limits">
            <div><dt>عدد العيادات</dt><dd>{{ money(item.maxClinics) }}</dd></div>
            <div><dt>الحجوزات اليومية</dt><dd>{{ money(item.maxDailyAppointments) }}</dd></div>
            <div><dt>أيام الحجز بالأسبوع</dt><dd>{{ money(item.maxWeeklyDays) }}</dd></div>
            <div><dt>العروض الفعالة</dt><dd>{{ money(item.makeOffers ? item.maxActiveOffers : 0) }}</dd></div>
          </dl>
          <h3>مميزات الاشتراك</h3>
          <ul class="plan__features">
            <li v-for="feature in featureRows" :key="feature.key" :class="{ unavailable: !item[feature.key] }">
              <BaseIcon :name="item[feature.key] ? 'check-circle-outline' : 'minus-circle-outline'" :size="19" />
              <span>{{ feature.label }}<small v-if="!item[feature.key]">غير مشمول</small></span>
            </li>
          </ul>
          <p class="plan__common">تشمل أيضاً شاشة الانتظار والروابط والحجز الذاتي.</p>
          <a href="https://eyadaty.techumbrella.net/doctor-request" target="_blank" rel="noopener noreferrer" class="btn" :class="isGold(item) ? 'btn--primary' : 'btn--secondary'" @click="useAnalytics().trackDoctorRegistrationClick()">
            <BaseIcon name="account-plus" :size="20" /> تسجيل حساب طبيب
          </a>
        </article>
      </div>
    </section>

    <section class="common-section">
      <div class="container">
        <h2 class="section-title">مميزات متاحة لجميع الاشتراكات</h2>
        <p class="section-subtitle">تشمل الاشتراك الأساسي أيضاً، وتبقى حدود العيادات والحجوزات حسب باقتك.</p>
        <div class="common-grid">
          <div v-for="feature in commonFeatures" :key="feature.title" class="common-feature">
            <BaseIcon :name="feature.icon" :size="28" />
            <h3>{{ feature.title }}</h3><p>{{ feature.description }}</p>
          </div>
        </div>
        <p class="section-subtitle">شاشة العرض وجهاز الحجز الذاتي من تجهيزات العيادة.</p>
        <div class="plans-links">
          <NuxtLink to="/for-doctors" class="btn btn--secondary">تفاصيل مميزات الأطباء <BaseIcon name="arrow-left" :size="18" /></NuxtLink>
          <a href="https://eyadaty.techumbrella.net/support" target="_blank" rel="noopener noreferrer" class="btn btn--ghost">استفسر عن الاشتراك <BaseIcon name="headset" :size="18" /></a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.plans-heading { text-align: center; padding-block: 40px 28px; }
.plans-heading img { object-fit: contain; }
.plans-heading h1 { font-size: 32px; margin-block: 12px; }
.plans-heading p { color: var(--color-text-secondary); }
.plans-section { padding-bottom: 48px; }
.plans-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.plan { display: flex; flex-direction: column; min-width: 0; padding: 20px; background: #fff; border: 2px solid var(--color-border); border-radius: 8px; overflow-wrap: anywhere; }
.plan--gold { border-color: #b48724; box-shadow: 0 8px 24px #b487241a; }
.plan__recommendation { min-height: 34px; }
.plan__recommendation span { display: inline-flex; align-items: center; gap: 6px; color: #745411; background: #fff4cf; border-radius: 4px; padding: 2px 10px; font-weight: 700; font-size: 13px; }
.plan h2 { font-size: 24px; }
.plan__price { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; margin-top: 16px; }
.plan__price strong { font-size: 28px; }
.plan__price span { font-size: 13px; color: var(--color-text-secondary); }
.plan__saving { display: grid; gap: 4px; margin-top: 12px; padding-inline-start: 10px; border-inline-start: 3px solid var(--color-success); color: var(--color-success); font-size: 13px; }
.plan__alternate-price { display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; font-size: 14px; color: var(--color-primary-dark); }
.plan__alternate-price > svg { margin-top: 2px; }
.plan__limits { margin-block: 20px; padding-block: 16px; border-block: 1px solid var(--color-border); }
.plan__limits div { display: flex; justify-content: space-between; gap: 8px; padding-block: 4px; font-size: 14px; }
.plan__limits dd { margin: 0; font-weight: 700; }
.plan h3 { font-size: 16px; }
.plan__features { list-style: none; padding: 0; margin: 14px 0 20px; display: grid; gap: 12px; }
.plan__features li { display: flex; align-items: start; gap: 8px; font-size: 14px; }
.plan__features li > svg { color: var(--color-success); margin-top: 2px; }
.plan__features .unavailable, .plan__features .unavailable > svg { color: var(--color-text-muted); }
.plan__features small { display: block; font-size: 11px; }
.plan__common { margin-top: auto; margin-bottom: 16px; font-size: 13px; color: var(--color-text-secondary); }
.plan > .btn { width: 100%; padding-inline: 10px; }
.common-section { padding-block: 40px; background: var(--color-accent-soft); }
.common-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-block: 28px; }
.common-feature { min-width: 0; }
.common-feature > svg { color: var(--color-accent); }
.common-feature h3 { font-size: 18px; margin-block: 10px 6px; }
.common-feature p { color: var(--color-text-secondary); }
.plans-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
@media (max-width: 1100px) { .plans-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) {
  .plans-grid, .common-grid { grid-template-columns: minmax(0, 1fr); }
  .plans-heading h1 { font-size: 26px; }
}
</style>
