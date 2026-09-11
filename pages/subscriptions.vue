<script setup lang="ts">
useHead({
  title: 'اشتراكات الأطباء',
  meta: [{ name: 'description', content: 'قارن باقات عيادتي للأطباء: الأساسي والذهبي والألماس والفاخر، والأسعار وحدود الحجوزات ومميزات كل اشتراك.' }],
  link: [{ rel: 'canonical', href: siteUrl('/subscriptions') }],
})
</script>

<template>
  <main><SubscriptionPlans /></main>
</template>
