<script setup lang="ts">
useHead({
  title: 'سياسة الخصوصية',
  meta: [
    {
      name: 'description',
      content: 'سياسة الخصوصية الخاصة بمنصة عيادتي — كيف نحمي بياناتك ونتعامل معها بشفافية ومسؤولية.',
    },
    { property: 'og:title', content: 'سياسة الخصوصية | عيادتي' },
    { property: 'og:url', content: siteUrl('/privacy') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/privacy') }],
})
</script>

<template>
  <main>
    <section class="page-head">
      <div class="container">
        <h1>سياسة الخصوصية</h1>
        <p class="updated">آخر تحديث: سبتمبر 2026</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <p>خصوصيتك أمر مهم بالنسبة لنا في «عيادتي». توضح هذه السياسة كيف نجمع ونستخدم بياناتك عند استخدام موقعنا وتطبيقنا.</p>

        <h2>1. البيانات التي نجمعها</h2>
        <ul>
          <li><strong>بيانات التصفح:</strong> الصفحات التي تزورها، مصطلحات البحث التي تستخدمها، المحافظة التي تبحث فيها.</li>
          <li><strong>بيانات التواصل:</strong> عندما تراسلنا عبر نموذج التواصل (الاسم، البريد الإلكتروني، رقم الهاتف، محتوى الرسالة).</li>
          <li><strong>بيانات الحساب:</strong> للأطباء والعيادات: الاسم، المؤهلات، معلومات العيادة وأوقات الدوام — بالمعلومات التي يقدمها صاحب الحساب نفسه.</li>
        </ul>

        <h2>2. كيف نستخدم البيانات</h2>
        <ul>
          <li>لتحسين نتائج البحث وتجربة الموقع.</li>
          <li>لإظهار الأطباء والعيادات القريبة منك ولمساعدتك في إيجادها.</li>
          <li>للرد على أسئلتك وملاحظاتك الواردة عبر نموذج التواصل.</li>
          <li>لإتمام الحجوزات والتواصل بين المرضى والعيادات.</li>
        </ul>

        <h2>3. مشاركة البيانات</h2>
        <p>
          لا نبيع بياناتك لأي طرف ثالث. نشارك البيانات الضرورية فقط (مثل معلومات العيادة ومواعيدك)
          مع الطبيب أو العيادة التي تحجز لديها، ومع مقدمي الخدمات التقنية اللازمين لتشغيل المنصة.
        </p>

        <h2>4. ملفات الارتباط (Cookies)</h2>
        <p>
          نستخدم ملفات ارتباط جلسة بسيطة (مثل تخزين معرف الجلسة في التخزين المحلي للمتصفح) لتحسين
          تجربتك وتتبع أداء الموقع دون تتبع شخصي فردي.
        </p>

        <h2>5. أمان البيانات</h2>
        <p>
          نتخذ إجراءات فنية وتنظيمية لحماية بياناتك، بما في ذلك التشفير عند نقل البيانات والتحكم
          الصارم بصلاحيات الوصول إلى المعلومات الحساسة.
        </p>

        <h2>6. حقوقك</h2>
        <p>
          لديك الحق في طلب الاطلاع على بياناتك، تصحيحها، أو حذفها. يمكنك ممارسة هذه الحقوق عبر
          صفحة «تواصل معنا» أو البريد الإلكتروني support@eyadaty.techumbrella.net.
        </p>

        <h2>7. تغييرات على هذه السياسة</h2>
        <p>
          قد نحدث هذه السياسة من وقت لآخر، وننشر أي تحديث في هذه الصفحة مع تاريخ آخر تعديل.
        </p>

        <h2>8. تواصل معنا</h2>
        <p>
          لأي سؤال حول هذه السياسة، راسلنا عبر صفحة <NuxtLink to="/contact">تواصل معنا</NuxtLink>.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-head {
  background: linear-gradient(160deg, var(--color-primary-soft) 0%, #f6f9f8 55%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border-light);
  padding-block: clamp(32px, 6vw, 56px);
  text-align: center;
}

.page-head h1 {
  font-size: clamp(26px, 4.5vw, 38px);
}

.updated {
  margin-top: var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: 14px;
}

.prose {
  max-width: 760px;
}

.prose p {
  line-height: 2;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.prose h2 {
  font-size: 20px;
  margin: var(--spacing-xl) 0 var(--spacing-sm);
}

.prose ul {
  margin: 0 0 var(--spacing-md);
  padding-inline-start: var(--spacing-xl);
  color: var(--color-text-secondary);
  line-height: 2;
}

.prose a {
  color: var(--color-primary);
  font-weight: 700;
}
</style>