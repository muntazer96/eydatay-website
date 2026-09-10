interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  website?: string // honeypot
  sentAt?: string
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5

const ipHits = new Map<string, { count: number; firstAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || now - entry.firstAt > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { count: 1, firstAt: now })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const honeypotAgeMs = Number(config.contactHoneypotAgeMs ?? 4000)

  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const ip = getRequestIP(event) ?? event.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'لقد أرسلت الكثير من الرسائل خلال وقت قصير. حاول مجدداً لاحقاً.',
    })
  }

  const body = (await readBody<ContactPayload>(event)) ?? {}

  // Honeypot: real users never fill this field.
  if (String(body.website ?? '').trim()) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'تم رفض الإرسال.' })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const subject = String(body.subject ?? '').trim()
  const message = String(body.message ?? '').trim()
  const phone = String(body.phone ?? '').trim()

  if (!name || name.length > 120) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'يرجى إدخال الاسم (بحد أقصى 120 حرفاً).' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'يرجى إدخال بريد إلكتروني صحيح.' })
  }
  if (!subject || subject.length > 120) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'يرجى إدخال الموضوع.' })
  }
  if (!message || message.length > 2700) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'يرجى كتابة رسالة لا تتجاوز 2700 حرف.' })
  }
  if (phone.length > 30) {
    throw createError({ statusCode: 422, message: 'رقم الهاتف يجب ألا يتجاوز 30 حرفاً.' })
  }

  // Human timing heuristic: forms submitted instantly are usually bots.
  const sentAt = new Date(String(body.sentAt ?? '')).getTime()
  if (!Number.isFinite(sentAt) || Date.now() - sentAt < honeypotAgeMs) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'يرجى الانتظار بضع ثوانٍ ثم إعادة الإرسال.' })
  }

  try {
    const response = await $fetch<{ status: string; data?: { id: number } }>(
      `${String(config.public.apiBase).replace(/\/$/, '')}/ProblemReport`,
      {
        method: 'POST',
        retry: 0,
        timeout: 15000,
        body: {
          reporterName: name,
          reporterPhone: phone || undefined,
          source: 'Website',
          pageUrl: `${String(config.public.siteUrl).replace(/\/$/, '')}/contact`.slice(0, 500),
          deviceInfo: getHeader(event, 'user-agent')?.slice(0, 800),
          title: subject,
          description: `البريد الإلكتروني: ${email}\n\n${message}`,
        },
      },
    )
    if (response.status !== 'success' || !response.data?.id) {
      throw new Error('Problem report was not confirmed')
    }
  } catch (error: unknown) {
    const status = (error as { statusCode?: number }).statusCode
    throw createError({
      statusCode: status === 429 ? 429 : 502,
      message: status === 429
        ? 'لقد أرسلت الكثير من الرسائل. حاول مجدداً لاحقاً.'
        : 'تعذر تأكيد وصول الرسالة. يرجى المحاولة لاحقاً.',
    })
  }

  return { ok: true, message: 'شكراً لتواصلك مع عيادتي.' }
})
