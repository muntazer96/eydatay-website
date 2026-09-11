<script setup lang="ts">
useHead({
  title: 'للأطباء',
  meta: [
    {
      name: 'description',
      content: 'مميزات عيادتي للأطباء: شاشة الانتظار والنداء الصوتي، الحجز الذاتي والإلكتروني، إدارة العيادات والمواعيد، الرسائل والعروض والإحصائيات وربط عيادتي كير.',
    },
    { property: 'og:title', content: 'للأطباء | عيادتي' },
    { property: 'og:url', content: siteUrl('/for-doctors') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/for-doctors') }],
})

const featureGroups = [
  {
    id: 'waiting', title: 'داخل العيادة: الدور والحجز الذاتي',
    desc: 'أدوات تربط الاستقبال بشاشة الانتظار وتسهّل تسجيل المراجع عند وصوله.',
    items: [
      { icon: 'monitor-dashboard', title: 'شاشة انتظار مستقلة', desc: 'افتح شاشة العرض على تلفاز أو شاشة الاستقبال لعرض الدور الحالي وقائمة الانتظار، مع تحديثات مباشرة من لوحة التحكم.' },
      { icon: 'volume-high', title: 'نداء صوتي وإدارة الدور', desc: 'استدعِ المراجع التالي وأعد النداء عند الحاجة، وتابع حالات حجوزات اليوم من لوحة التحكم بشاشة الانتظار.' },
      { icon: 'eye-outline', title: 'التحكم بظهور أسماء المراجعين', desc: 'اختر إظهار اسم المراجع على الشاشة أو الاكتفاء برقم الدور. ويمكن توليد رابط شاشة جديد لإبطال الرابط السابق.' },
      { icon: 'tablet', title: 'محطة الحجز الذاتي', desc: 'افتح رابط الحجز على تابلت أو شاشة لمس داخل العيادة ليُدخل المراجع بياناته بنفسه. تحدّد العيادة ومدة صلاحية الرابط، ويمكنك تغييره أو إيقافه.' },
    ],
  },
  {
    id: 'appointments', title: 'الحجوزات والدوام',
    desc: 'اجمع طرق الحجز المختلفة ونظّم الأوقات المتاحة لكل عيادة.',
    items: [
      { icon: 'calendar-check', title: 'الحجز الإلكتروني', desc: 'استقبل طلبات المواعيد عند تفعيل الحجز الإلكتروني، وتابع تفاصيلها وحالاتها ضمن قائمة الحجوزات.' },
      { icon: 'account-plus', title: 'الحجز اليدوي', desc: 'أضف موعداً للحجوزات الهاتفية أو المباشرة حتى تظهر ضمن قائمة العمل إلى جانب الحجوزات الإلكترونية.' },
      { icon: 'clipboard-check-outline', title: 'متابعة المواعيد اليومية', desc: 'اختر التاريخ والعيادة وراجع معلومات المراجع وحالة موعده، ثم حدّث الحالة أو أكمل الزيارة أو ارفض الطلب المعلّق حسب حالته.' },
      { icon: 'clock-outline', title: 'جدول أسبوعي لكل عيادة', desc: 'اضبط أيام وساعات الاستقبال لكل عيادة، مع إمكانية تعديل دوام يوم محدد عندما يتغير جدولك.' },
      { icon: 'calendar-remove', title: 'الإجازات والاستثناءات', desc: 'سجّل يوم إغلاق أو دواماً استثنائياً دون تغيير الجدول الأسبوعي المعتاد، ليعكس الحجز أوقات تواجدك.' },
    ],
  },
  {
    id: 'presence', title: 'ملفك وعياداتك أمام المراجعين',
    desc: 'اعرض معلومات تساعد المراجع على معرفة اختصاصك والوصول إلى عيادتك.',
    items: [
      { icon: 'account-badge', title: 'ملف الطبيب', desc: 'حدّث الاسم والاختصاص والصورة والنبذة والمعلومات المهنية التي تظهر في ملفك للمراجعين.' },
      { icon: 'hospital-building', title: 'إدارة أكثر من عيادة', desc: 'أضف بيانات عياداتك وحدّث العناوين والمحافظات والمواقع وأرقام التواصل، مع جدول مستقل لكل عيادة.' },
      { icon: 'link-variant', title: 'روابطك الخارجية', desc: 'أضف روابطك إلى ملف الطبيب وعدّل ترتيبها أو احذفها عند الحاجة لتجميع وسائل الوصول إليك.' },
      { icon: 'tag-multiple-outline', title: 'العروض والخدمات', desc: 'أنشئ عرضاً بعنوان ووصف وشروط واضحة، وحدّد نوعه وفترة ظهوره والعيادة المرتبطة به، مع إمكانية تفعيله أو إيقافه.' },
    ],
  },
  {
    id: 'communication', title: 'التواصل ومتابعة النشاط',
    desc: 'تابع الاستفسارات والتنبيهات وملاحظات المراجعين من حسابك.',
    items: [
      { icon: 'message-text-outline', title: 'رسائل المرضى', desc: 'راجع المحادثات والرسائل غير المقروءة وأجب عن الاستفسارات داخل النظام عند إتاحة ميزة الرسائل لحسابك.' },
      { icon: 'bell-outline', title: 'الإشعارات', desc: 'تابع تنبيهات الحجوزات والرسائل والتحديثات المرتبطة بحسابك، وافتح تفاصيلها وعلّم ما قرأته منها.' },
      { icon: 'star-outline', title: 'التقييمات والملاحظات', desc: 'اطّلع على تقييمات المراجعين وتعليقاتهم لمعرفة جوانب رضاهم والملاحظات التي تحتاج متابعة.' },
      { icon: 'chart-bar', title: 'الإحصائيات', desc: 'راجع ملخص نشاط العيادة والحجوزات والإحصائيات المتاحة لحساب الطبيب، إلى جانب المواعيد القادمة.' },
    ],
  },
  {
    id: 'account', title: 'إعداد حسابك والخدمات المرتبطة',
    desc: 'اعرف ما هو متاح لحسابك، واستفد من الدليل والدعم والتكاملات.',
    items: [
      { icon: 'toggle-switch-outline', title: 'التحكم بمميزات الاشتراك', desc: 'راجع المميزات المتاحة ضمن باقتك، وفعّل أو أوقف الخيارات التي يسمح حسابك بإدارتها مثل الحجز والرسائل.' },
      { icon: 'link-variant', title: 'ربط عيادتي كير', desc: 'أنشئ مفتاح ربط لنسخة عيادتي كير وحدّد صلاحيات الوصول إلى الحجوزات وشاشة الانتظار. يتطلب استخدام الربط إعداد عيادتي كير والخدمة المناسبة.' },
      { icon: 'book-open-page-variant', title: 'دليل استخدام الطبيب', desc: 'دليل داخل حسابك يشرح إعداد الملف والعيادات والحجوزات والتواصل، مع خطوات عملية لكل وظيفة.' },
      { icon: 'headset', title: 'الإبلاغ عن مشكلة', desc: 'أرسل وصف المشكلة والصفحة والخطوات التي سبقتها إلى الإدارة من داخل حسابك حتى تتوفر تفاصيل تساعد على متابعتها.' },
    ],
  },
]

const steps = [
  { icon: 'account-plus', title: 'قدّم طلب التسجيل', desc: 'افتح استمارة تسجيل الطبيب وأكمل معلوماتك المهنية واختصاصك ورقم هاتفك وبيانات العيادة المطلوبة.' },
  { icon: 'hospital-building', title: 'رتّب بيانات العيادة', desc: 'بعد تفعيل حسابك، راجع العنوان ووسائل التواصل وأوقات الدوام وطريقة استقبال الحجوزات.' },
  { icon: 'check-decagram', title: 'ابدأ متابعة المواعيد', desc: 'راجع ملفك العام وتابع قائمة الحجوزات، وحدّث الدوام عند أي تغيير.' },
]
const logoSrc = publicAssetUrl('/onWhiteBG.png')
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <img :src="logoSrc" class="page-hero__logo" alt="شعار عيادتي" width="112" height="112" />
        <h1 class="page-hero__title">مميزات عيادتي للأطباء</h1>
        <p class="page-hero__subtitle">
          من ملفك الطبي والحجوزات إلى شاشة الانتظار والحجز الذاتي: أدوات لتنظيم يوم العيادة والتواصل مع المراجعين.
        </p>
        <div class="page-hero__actions">
          <a href="https://eyadaty.techumbrella.net/doctor-request" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg" @click="useAnalytics().trackDoctorRegistrationClick()">
            <BaseIcon name="account-plus" :size="22" />
            تسجيل حساب طبيب
          </a>
          <NuxtLink to="/about" class="btn btn--ghost btn--lg">
            تعرف على عيادتي
          </NuxtLink>
          <NuxtLink to="/subscriptions" class="btn btn--secondary btn--lg">قارن الاشتراكات</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section" aria-labelledby="for-docs-features">
      <div class="container">
        <div class="section-head section-head--center">
          <h2 id="for-docs-features" class="section-title">أدوات لإدارة يوم العيادة</h2>
          <p class="section-subtitle">تتوفر الأدوات بحسب باقة الاشتراك وصلاحيات حساب الطبيب وإعدادات العيادة. شاشة الانتظار ومحطة الحجز الذاتي تحتاجان شاشة أو جهازاً مناسباً داخل العيادة.</p>
        </div>

        <nav class="feature-index" aria-label="مجموعات مميزات الأطباء">
          <a v-for="group in featureGroups" :key="group.id" :href="`#${group.id}`">{{ group.title }}</a>
        </nav>
        <section v-for="group in featureGroups" :id="group.id" :key="group.id" class="feature-group" :aria-labelledby="`${group.id}-title`">
          <h3 :id="`${group.id}-title`" class="feature-group__title">{{ group.title }}</h3>
          <p class="section-subtitle">{{ group.desc }}</p>
          <div class="doctor-features-grid">
          <article v-for="f in group.items" :key="f.title" class="benefit card card--hover">
            <span class="benefit__icon">
              <BaseIcon :name="f.icon" :size="28" />
            </span>
            <h4 class="benefit__title">{{ f.title }}</h4>
            <p class="benefit__desc">{{ f.desc }}</p>
          </article>
          </div>
        </section>
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
            قدّم طلبك عبر استمارة تسجيل الطبيب، وأكمل البيانات المطلوبة لمراجعة طلب انضمامك.
          </p>
          <a href="https://eyadaty.techumbrella.net/doctor-request" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg" @click="useAnalytics().trackDoctorRegistrationClick()">
            <BaseIcon name="account-plus" :size="22" />
            تسجيل حساب طبيب
          </a>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="doctor-questions">
      <div class="container doctor-faq">
        <h2 id="doctor-questions" class="section-title">أسئلة قبل البدء</h2>
        <details><summary>شنو الفرق بين شاشة الانتظار والحجز الذاتي؟</summary><p>شاشة الانتظار تعرض الدور وتعلن النداء للمراجعين. محطة الحجز الذاتي تستقبل بيانات المراجع من تابلت أو شاشة لمس لتسجيل حجزه داخل العيادة.</p></details>
        <details><summary>أقدر أخفي أسماء المراجعين من الشاشة؟</summary><p>نعم، لوحة التحكم تتضمن خيار ظهور اسم المراجع، ويمكن الاكتفاء برقم الدور على شاشة العرض.</p></details>
        <details><summary>رابط الحجز الذاتي يبقى فعال دائماً؟</summary><p>تحدد مدة صلاحيته عند إنشائه، وتستطيع إيقافه أو تغييره. توليد رابط جديد يُبطل الرابط السابق.</p></details>
        <details><summary>هل الحجز الإلكتروني إلزامي؟</summary><p>ملف الطبيب يوضح طريقة الحجز المتاحة. عند عدم إتاحة الحجز الإلكتروني يستطيع المراجع استخدام رقم العيادة الموجود بالملف.</p></details>
        <details><summary>عندي أكثر من عيادة، شلون أنظّم الدوام؟</summary><p>تُعرض بيانات العيادات ضمن ملف الطبيب، ويمكن ضبط جدول الدوام لكل عيادة وتحديث أيام محددة أو إضافة استثناءات.</p></details>
        <details><summary>هل أقدر أضيف مواعيد وصلتني بالتلفون؟</summary><p>توجد وظيفة الحجز اليدوي ضمن أدوات الطبيب لإدخال المواعيد التي لم تصل عبر الحجز الإلكتروني.</p></details>
        <details><summary>شلون أعرف الاشتراك والخدمات المتاحة لحسابي؟</summary><p>راجع <NuxtLink to="/subscriptions">صفحة الاشتراكات</NuxtLink> لمقارنة الأسعار والمميزات والحدود. شاشة الانتظار والروابط والحجز الذاتي متاحة لجميع الاشتراكات.</p></details>
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
  font-size: 32px;
}

.page-hero__logo {
  display: block;
  width: 112px;
  height: 112px;
  object-fit: contain;
  margin: 0 auto 16px;
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
  min-width: 0;
  overflow-wrap: anywhere;
  text-align: center;
  padding: var(--spacing-xl);
}

.feature-index {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 24px;
  margin-bottom: 32px;
}
.feature-index a { color: var(--color-primary-dark); text-decoration: underline; text-underline-offset: 5px; }
.feature-group { padding-block: 32px; border-top: 1px solid var(--color-border); }
.feature-group__title { font-size: 24px; }
.doctor-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 16px;
  margin-top: 24px;
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

.doctor-faq { max-width: 800px; }
.doctor-faq details { padding-block: 20px; border-bottom: 1px solid var(--color-border); }
.doctor-faq summary { cursor: pointer; font-size: 17px; font-weight: 700; }
.doctor-faq p { margin-top: 12px; color: var(--color-text-secondary); line-height: 1.8; }
</style>
