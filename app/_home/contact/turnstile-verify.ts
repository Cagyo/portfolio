import 'server-only'

const VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(
  token: string | null,
  ip: string,
): Promise<{ ok: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return { ok: false }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  })

  const response = await fetch(VERIFY_URL, { method: 'POST', body })
  if (!response.ok) return { ok: false }

  const data = (await response.json()) as { success: boolean }
  return { ok: data.success }
}
