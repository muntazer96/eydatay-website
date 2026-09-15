<template>
  <div class="site">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<style>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site > main {
  flex: 1 0 auto;
}
</style>