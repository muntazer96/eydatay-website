<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} | عيادتي` : 'عيادتي | دليلك لإيجاد الأطباء في العراق'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>