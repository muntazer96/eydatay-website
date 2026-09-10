<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)

const navItems = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المزايا', to: '/#features' },
  { label: 'التخصصات', to: '/#specializations' },
  { label: 'المحافظات', to: '/#governorates' },
  { label: 'طريقة العمل', to: '/#how-it-works' },
  { label: 'الأطباء', to: '/doctors' },
  { label: 'الدعم', to: '/contact' },
]

function isActive(item: { to: string }): boolean {
  if (item.to === '/') return route.path === '/'
  if (item.to.startsWith('/#')) return false
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function closeMobile() {
  mobileOpen.value = false
}

watch(route, closeMobile)

function trackNavCta() {
  useAnalytics().trackAppDownloadClick()
}
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <BrandLogo :compact="true" />

      <nav class="app-header__nav" aria-label="التنقل الرئيسي">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="app-header__link"
          :class="{ 'app-header__link--active': isActive(item) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="app-header__actions">
        <NuxtLink to="/download" class="btn btn--primary app-header__cta" @click="trackNavCta">
          <BaseIcon name="cellphone-arrow-down" :size="20" />
          <span class="app-header__cta-text">حمّل تطبيق عيادتي</span>
        </NuxtLink>

        <button
          type="button"
          class="app-header__burger"
          :aria-expanded="mobileOpen"
          aria-label="فتح القائمة"
          @click="mobileOpen = !mobileOpen"
        >
          <BaseIcon :name="mobileOpen ? 'close' : 'menu'" :size="26" />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="app-header__mobile">
        <nav class="app-header__mobile-nav" aria-label="قائمة الجوال">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="app-header__mobile-link"
            :class="{ 'app-header__link--active': isActive(item) }"
          >
            {{ item.label }}
          </NuxtLink>
          <NuxtLink to="/download" class="btn btn--primary btn--block" @click="trackNavCta">
            <BaseIcon name="cellphone-arrow-down" :size="20" />
            حمّل تطبيق عيادتي
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: rgba(249, 252, 251, 0.82);
  border-bottom: 1px solid rgba(19, 121, 107, 0.1);
  box-shadow: 0 10px 36px rgba(9, 48, 51, 0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  min-height: var(--header-height);
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: 2px;
}

.app-header__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 11px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-secondary);
  transition: color 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.app-header__link:hover {
  color: var(--color-primary-dark);
  background: rgba(19, 121, 107, 0.09);
}

.app-header__link--active {
  color: #fff;
  background: var(--color-primary);
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-header__cta {
  display: none;
}

.app-header__burger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(19, 121, 107, 0.16);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-primary);
}

.app-header__mobile {
  position: absolute;
  inset-inline: 0;
  top: 100%;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid rgba(19, 121, 107, 0.1);
  box-shadow: var(--shadow-lg);
  animation: fadeInUp 0.22s ease both;
  backdrop-filter: blur(16px);
}

.app-header__mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-xl);
}

.app-header__mobile-link {
  padding: 13px 12px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.app-header__mobile-link:hover,
.app-header__mobile-link--active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (min-width: 1024px) {
  .app-header__nav {
    display: flex;
  }

  .app-header__cta {
    display: inline-flex;
  }

  .app-header__burger {
    display: none;
  }
}
</style>
