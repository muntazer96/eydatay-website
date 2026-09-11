<script setup lang="ts">
useHead({
  title: 'تواصل معنا',
  meta: [
    { name: 'description', content: 'راسل عيادتي لأسئلتك وملاحظاتك والاستفسار حول الأطباء أو التسجيل في المنصة.' },
    { property: 'og:title', content: 'تواصل معنا | عيادتي' },
    { property: 'og:url', content: siteUrl('/contact') },
  ],
  link: [{ rel: 'canonical', href: siteUrl('/contact') }],
})
</script>

<template><main><ContactSection /></main></template>
