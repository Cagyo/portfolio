export const CONSENT_VERSION = 1
export const CONSENT_COOKIE_NAME = "consent-analytics"
export const CONSENT_MAX_AGE_SECONDS = 34_128_000

export type StoredConsentStatus = "granted" | "denied"
export type ConsentStatus = StoredConsentStatus | "unset"

const versionSuffix = `:v${CONSENT_VERSION}`

export function readConsent(): ConsentStatus {
  if (typeof document === "undefined") return "unset"

  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (!cookie) return "unset"

  const value = cookie.slice(CONSENT_COOKIE_NAME.length + 1)
  if (!value.endsWith(versionSuffix)) return "unset"

  const status = value.slice(0, -versionSuffix.length)
  return status === "granted" || status === "denied" ? status : "unset"
}

export function writeConsent(value: StoredConsentStatus) {
  if (typeof document === "undefined") return

  const attributes = [
    `${CONSENT_COOKIE_NAME}=${value}${versionSuffix}`,
    "path=/",
    `max-age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ]

  if (window.location.protocol === "https:") {
    attributes.push("Secure")
  }

  document.cookie = attributes.join("; ")
}