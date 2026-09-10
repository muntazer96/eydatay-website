<script setup lang="ts">
import QRCode from 'qrcode'
import { useAppLinks } from '~/composables/useAppLinks'
import type { AppReleaseResponse } from '~/types'

const props = withDefaults(
  defineProps<{
    variant?: 'section' | 'page'
    doctorId?: number | string
  }>(),
  {
    variant: 'section',
    doctorId: '',
  },
)

const { androidPlayStoreUrl, iosAppStoreUrl, downloadUrl } = useAppLinks()
const { trackAppDownloadClick } = useAnalytics()

const qrTarget = computed(() => androidPlayStoreUrl || downloadUrl(props.doctorId || undefined))
const qrImg = ref('')
const latestRelease = ref<AppReleaseResponse | null>(null)
const showApkError = ref(false)

const apkDownloadUrl = computed(() => `${apiBase()}/app-release/download`)

async function generateQr() {
  if (import.meta.server) return
  try {
    qrImg.value = await QRCode.toDataURL(qrTarget.value, {
      width: 320,
      margin: 1,
      color: { dark: '#0b5c51ff', light: '#ffffffff' },
    })
  } catch {
    qrImg.value = ''
  }
}

async function loadRelease() {
  if (import.meta.server) return
  try {
    const res = await getLatestRelease()
    latestRelease.value = res?.data ?? null
  } catch {
    latestRelease.value = null
  }
}

function handleApkClick() {
  showApkError.value = false
  trackAppDownloadClick()
  // The backend redirects to the bundled APK; if nothing is uploaded yet, show a hint.
  try {
    window.location.href = apkDownloadUrl.value
  } catch {
    showApkError.value = true
  }
}

onMounted(() => {
  generateQr()
  if (props.variant === 'page') loadRelease()
})
</script>

<template>
  <section class="download-section" :class="{ 'download-section--page': variant === 'page' }">
    <div class="download-section__card">
      <div class="download-section__info">
        <span class="ey-logo-mark">
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
            <rect width="64" height="64" rx="16" fill="#13796b" />
            <path
              d="M32 48S14 38 14 24.8C14 18.8 18.4 15 23.4 15c3.7 0 6.8 2 8.6 5 1.8-3 4.9-5 8.6-5 5 0 9.4 3.8 9.4 9.8C50 38 32 48 32 48Z"
              fill="none"
              stroke="#fff"
              stroke-width="4"
              stroke-linejoin="round"
            />
            <path
              d="M18 31h8l3-7 6 15 4-8h7"
              fill="none"
              stroke="#fff"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <div class="download-section__text">
          <h2 class="download-section__title">حمّل تطبيق عيادتي</h2>
          <p class="download-section__desc">
            احفظ أطباءك، احجز مواعيدك، وتابع كل ما تحتاجه — تجربة كاملة في تطبيق عيادتي على جوالك.
          </p>

          <div class="download-section__buttons">
            <a
              v-if="androidPlayStoreUrl"
              :href="androidPlayStoreUrl"
              target="_blank"
              rel="noopener nofollow"
              class="btn btn--light"
              @click="trackAppDownloadClick"
            >
              <BaseIcon name="google-play" :size="22" />
              تحميل من Google Play
            </a>

            <a
              v-if="iosAppStoreUrl"
              :href="iosAppStoreUrl"
              target="_blank"
              rel="noopener nofollow"
              class="btn btn--light"
              @click="trackAppDownloadClick"
            >
              <BaseIcon name="apple" :size="22" />
              تحميل من App Store
            </a>

            <button
              v-if="!androidPlayStoreUrl"
              type="button"
              class="btn btn--light"
              @click="handleApkClick"
            >
              <BaseIcon name="android" :size="22" />
              تحميل نسخة أندرويد (APK)
            </button>
          </div>

          <p v-if="variant === 'page' && showApkError" class="download-section__hint">
            لم يتوفر ملف التطبيق بعد. سنخبرك عند إتاحته.
          </p>
          <p v-if="variant === 'page' && latestRelease && latestRelease.downloadCount > 0" class="download-section__hint">
            الإصدار {{ latestRelease.versionName }} — {{ latestRelease.fileSize }} — {{ latestRelease.downloadCount }} تحميل
          </p>
        </div>
      </div>

      <div v-if="qrImg" class="download-section__qr">
        <img :src="qrImg" alt="رمز QR لتحميل تطبيق عيادتي" width="160" height="160" loading="lazy" decoding="async" />
        <span class="download-section__qr-hint">امسح الرمز لتحميل التطبيق</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.download-section {
  position: relative;
}

.download-section__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  align-items: center;
  padding: clamp(24px, 5vw, 48px);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  box-shadow: var(--shadow-xl);
}

.download-section__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-lg);
  max-width: 560px;
}

.ey-logo-mark {
  line-height: 0;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.22));
}

.download-section__title {
  font-size: clamp(24px, 4vw, 32px);
  color: #fff;
}

.download-section__desc {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
}

.download-section__buttons {
  display: flex;
  flex-shrink: 1;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.download-section__hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.download-section__qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.download-section__qr img {
  border-radius: var(--radius-md);
  background: #fff;
  padding: 8px;
}

.download-section__qr-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
}

@media (min-width: 768px) {
  .download-section__card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .download-section__info {
    align-items: flex-start;
    text-align: start;
  }

  .download-section__buttons {
    justify-content: flex-start;
  }
}
</style>