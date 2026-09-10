<script setup lang="ts">
import QRCode from 'qrcode'
import { useAppLinks } from '~/composables/useAppLinks'

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

onMounted(() => {
  generateQr()
})
</script>

<template>
  <section class="download-section" :class="{ 'download-section--page': variant === 'page' }">
    <div class="download-section__card">
      <div class="download-section__info">
        <span class="ey-logo-mark">
          <img src="/onColorsBG.png" alt="شعار عيادتي" width="80" height="80" loading="lazy" />
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
              أندرويد · Google Play
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
              iOS · App Store
            </a>

            <button
              v-else
              type="button"
              class="btn btn--light"
              disabled
            >
              <BaseIcon name="apple" :size="22" />
              iOS · قريباً
            </button>
          </div>

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
  container-type: inline-size;
  container-name: app-download;
  min-width: 0;
  width: 100%;
}

.download-section__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  align-items: center;
  padding: 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  box-shadow: var(--shadow-xl);
}

.download-section__info {
  min-width: 0;
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

.ey-logo-mark img {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
}

.download-section__title {
  font-size: 24px;
  line-height: 1.5;
  color: #fff;
}

.download-section__desc {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
}

.download-section__buttons {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.download-section__text {
  min-width: 0;
  width: 100%;
  overflow-wrap: anywhere;
}

.download-section__buttons .btn {
  width: 100%;
  min-width: 0;
  padding-inline: 12px;
}

.download-section__desc {
  margin-top: 8px;
}

.download-section__qr {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.download-section__qr img {
  display: block;
  width: 160px;
  height: 160px;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  background: #fff;
  padding: 8px;
}

.download-section__qr-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
}

@container app-download (min-width: 640px) {
  .download-section__card {
    padding: 32px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .download-section__info {
    align-items: flex-start;
    text-align: start;
  }

  .download-section__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .download-section__buttons .btn {
    width: auto;
    padding-inline: 22px;
  }

  .download-section__title {
    font-size: 28px;
  }
}
</style>
