import "server-only"

import { cookies } from "next/headers"

/**
 * Reads the persisted `theme` cookie on the server so the client `<ThemeToggle>`
 * can render the correct icon on first paint without a hydration mismatch.
 *
 * Default is dark — the cookie is only set when the user has explicitly chosen light.
 */
export async function getInitialIsDark(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get("theme")?.value !== "light"
}
