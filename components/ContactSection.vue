<script setup lang="ts">
withDefaults(defineProps<{ embedded?: boolean }>(), { embedded: false })
const contactEndpoint = publicAssetUrl('/api/contact')

type FormState = 'idle' | 'sending' | 'success' | 'error'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '', // honeypot — must stay empty
})

const state = ref<FormState>('idle')
const errorMessage = ref('')
const formStartedAt = ref('')

onMounted(() => {
  formStartedAt.value = new Date().toISOString()
})

async function submit() {
  if (state.value === 'sending') return

  state.value = 'sending'
  errorMessage.value = ''

  try {
    await $fetch(contactEndpoint, {
      method: 'POST',
      body: {
        ...form,
        sentAt: formStartedAt.value,
      },
    })
    state.value = 'success'
  } catch (err: unknown) {
    state.value = 'error'
    errorMessage.value =
      (err as { data?: { message?: string } })?.data?.message || 'تعذر إرسال الرسالة. يرجى المحاولة لاحقاً.'
  }
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  formStartedAt.value = new Date().toISOString()
  state.value = 'idle'
}
</script>

<template>
  <div class="contact-section">
    <section class="page-hero">
      <div class="container">
        <component :is="embedded ? 'h2' : 'h1'" class="page-hero__title">تواصل معنا</component>
        <p class="page-hero__subtitle">يسعدنا سماع استفساراتك وملاحظاتك. فريقنا يرد في أقرب وقت.</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-layout">
        <aside class="contact-info card">
          <h2>معلومات التواصل</h2>
          <ul>
            <li>
              <span class="ci-icon"><BaseIcon name="email-outline" :size="22" /></span>
              <div>
                <strong>البريد الإلكتروني</strong>
                <a href="mailto:eyadaty.iq@gmail.com" dir="ltr">eyadaty.iq@gmail.com</a>
              </div>
            </li>
            <li>
              <span class="ci-icon"><BaseIcon name="map-marker-radius" :size="22" /></span>
              <div>
                <strong>الدعم</strong>
                <span>متاح من السبت إلى الخميس، من 9 صباحاً حتى 5 مساءً.</span>
              </div>
            </li>
            <li>
              <span class="ci-icon"><BaseIcon name="clock-outline" :size="22" /></span>
              <div>
                <strong>رسائل المراجعة</strong>
                <span>نرد على أغلب الرسائل خلال 24-48 ساعة عمل.</span>
              </div>
            </li>
          </ul>
        </aside>

        <section class="card contact-form-card" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" class="contact-form-card__title">أرسل رسالة</h2>

          <form v-if="state !== 'success'" class="form-grid" @submit.prevent="submit">
            <div class="field">
              <label for="c-name">الاسم الكامل *</label>
              <input
                id="c-name"
                maxlength="120"
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                placeholder="اسمك الكامل"
              />
            </div>
            <div class="field">
              <label for="c-email">البريد الإلكتروني *</label>
              <input
                id="c-email"
                maxlength="200"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div class="field">
              <label for="c-phone">رقم الهاتف</label>
              <input id="c-phone" v-model="form.phone" type="tel" maxlength="30" autocomplete="tel" dir="ltr" placeholder="07XX XXX XXXX" />
            </div>
            <div class="field">
              <label for="c-subject">الموضوع *</label>
              <input id="c-subject" v-model="form.subject" type="text" maxlength="120" required placeholder="موضوع الرسالة" />
            </div>
            <div class="field field--full">
              <label for="c-message">الرسالة *</label>
              <textarea
                id="c-message"
                maxlength="2700"
                v-model="form.message"
                required
                rows="6"
                placeholder="اكتب رسالتك هنا..."
              />
            </div>

            <!-- Honeypot: humans must not see/fill this -->
            <div class="field field--hp" aria-hidden="true">
              <label for="c-website">الموقع الإلكتروني</label>
              <input id="c-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <button type="submit" class="btn btn--primary btn--lg field--full" :disabled="state === 'sending'">
              <BaseIcon :name="state === 'sending' ? 'loading' : 'send'" :size="20" :class="{ 'spin': state === 'sending' }" />
              {{ state === 'sending' ? 'جارٍ الإرسال...' : 'إرسال الرسالة' }}
            </button>

            <p v-if="state === 'error'" class="form-error field--full" role="alert">
              <BaseIcon name="alert-circle" :size="18" />
              {{ errorMessage }}
            </p>
          </form>

          <div v-else class="contact-success" role="status">
            <span class="contact-success__icon"><BaseIcon name="check-decagram" :size="44" /></span>
            <h3>وصلتنا رسالتك!</h3>
            <p>شكراً لتواصلك مع عيادتي. سيعود إليك فريقنا في أقرب وقت.</p>
            <button type="button" class="btn btn--secondary btn--lg" @click="resetForm">
              إرسال رسالة أخرى
            </button>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero {
  background: linear-gradient(160deg, var(--color-primary-soft) 0%, #f6f9f8 55%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border-light);
  text-align: center;
  padding-block: clamp(32px, 6vw, 64px);
}

.page-hero__title {
  font-size: clamp(26px, 4.5vw, 40px);
}

.page-hero__subtitle {
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-xl);
}

@media (min-width: 900px) {
  .contact-layout {
    grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
    align-items: start;
  }
}

.contact-info {
  padding: var(--spacing-xl);
}

.contact-info h2 {
  margin-bottom: var(--spacing-lg);
}

.contact-info ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-info li {
  display: flex;
  gap: var(--spacing-md);
}

.contact-layout > *,
.contact-info li > div {
  min-width: 0;
}

.ci-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.contact-info strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

.contact-info span {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
}

.contact-info a {
  overflow-wrap: anywhere;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 14px;
}

.contact-form-card {
  padding: var(--spacing-xl);
}

.contact-form-card__title {
  margin-bottom: var(--spacing-lg);
}

.form-grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-md);
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field--full {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 700;
  font-size: 14px;
}

.field input,
.field textarea {
  width: 100%;
  min-width: 0;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field textarea {
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(19, 121, 107, 0.14);
}

/* Honeypot hidden from humans */
.field--hp {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
}

@media (max-width: 480px) {
  .contact-info,
  .contact-form-card {
    padding: 16px;
  }

  .field input,
  .field textarea {
    font-size: 16px;
  }
}

.form-error {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-error);
  background: var(--color-error-light);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 700;
}

.contact-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl) 0;
}

.contact-success__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.contact-success h3 {
  font-size: 22px;
}

.contact-success p {
  color: var(--color-text-secondary);
  max-width: 400px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
