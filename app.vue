<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} | عيادتي` : 'عيادتي | دليلك لإيجاد الأطباء في العراق'),
})

const loading = ref(true)
let hideTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  hideTimer = setTimeout(() => {
    loading.value = false
  }, 400)
})

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div>
    <Transition name="splash-fade">
      <div v-if="loading" class="splash" aria-hidden="true">
        <span class="splash__mark">
          <img src="/onWhiteBG.png" alt="" width="112" height="112" />
          <span class="splash__ring" />
        </span>
        <span class="splash__name">عيادتي</span>
        <span class="splash__bar" />
      </div>
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(19, 121, 107, 0.08), transparent 60%),
    #ffffff;
}

.splash__mark {
  position: relative;
  display: inline-flex;
  line-height: 0;
}

.splash__mark img {
  display: block;
  width: 112px;
  height: 112px;
  object-fit: contain;
  border-radius: 22px;
  box-shadow: 0 18px 44px rgba(14, 99, 92, 0.22);
  animation: splashPop 0.5s ease both;
}

.splash__ring {
  position: absolute;
  inset: -14px;
  border: 3px solid var(--color-primary-soft, #d4efea);
  border-top-color: var(--color-primary, #13796b);
  border-radius: 26px;
  animation: splashSpin 1s linear infinite;
  pointer-events: none;
}

.splash__name {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-primary-dark, #084d50);
  letter-spacing: -0.3px;
}

.splash__bar {
  display: block;
  width: 96px;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-primary, #13796b) 0 40%, rgba(19, 121, 107, 0.2) 40%);
  background-size: 240% 100%;
  animation: splashBar 1s ease-in-out infinite;
}

@keyframes splashPop {
  from {
    opacity: 0;
    transform: scale(0.82);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes splashSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes splashBar {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: 0 0;
  }
}

.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.35s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}
</style>