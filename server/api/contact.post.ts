import { promises as fs } from 'node:fs'
import { join } from 'node:path'

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  website?: string // honeypot
  sentAt?: string
}

interface StoredMessage extends ContactPayload {
  sentAt: string
  receivedAt: string
  ip: string
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

async function persistMessage(message: StoredMessage): Promise<void> {
  const dataDir = join(process.cwd(), 'server', 'data')
  const file = join(dataDir, 'contact-messages.json')

  try {
    await fs.mkdir(dataDir, { recursive: true })
    let records: StoredMessage[] = []
    try {
      const raw = await fs.readFile(file, 'utf8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) records = parsed
    } catch {
      records = []
    }
    records.push(message)
    await fs.writeFile(file, JSON.stringify(records, null, 2), 'utf8')
  } catch {
    // Logging is best-effort; a failure must not break the user reply.
  }
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

  const body = (await readBody(event)) as ContactPayload

  // Honeypot: real users never fill this field.
  if (body.website && body.website.trim()) {
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
  if (!message || message.length > 5000) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'يرجى كتابة رسالة ألا تتجاوز 5000 حرف.' })
  }

  // Human timing heuristic: forms submitted instantly are usually bots.
  const sentAt = new Date(String(body.sentAt ?? '')).getTime()
  if (Number.isFinite(sentAt) && Date.now() - sentAt < honeypotAgeMs) {
    throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: 'تم رفض الإرسال.' })
  }

  const record: StoredMessage = {
    name,
    email,
    phone,
    subject,
    message,
    sentAt: new Date(sentAt).toISOString(),
    receivedAt: new Date().toISOString(),
    ip,
  }

  await persistMessage(record)

  return { ok: true, message: 'شكراً لتواصلك مع عيادتي.' }
})