# Auth

> Read when adding or modifying authentication, session handling, or authorization in the app.

Three separate concerns:

```
Authentication  → who are you?        lib/auth.ts (getCurrentUser)
Session         → are you still you?  lib/session.ts (cookies)
Authorization   → what can you do?    Server Functions + route group layouts
```

## Data Access Layer — `lib/auth.ts`

```ts
import 'server-only'
import { cache } from 'react'

// React.cache = one DB hit per request regardless of how many callers
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get('session')?.value
  if (!token) return null
  const payload = await decrypt(token)
  if (!payload?.userId) return null
  return db.user.findUnique({ where: { id: payload.userId as string }, select: { id: true, name: true, role: true } })
})

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(role: Role) {
  const user = await requireUser()
  if (user.role !== role) redirect('/unauthorized')
  return user
}
```

## Session — `lib/session.ts`

Required cookie options — none are optional:

```ts
cookieStore.set('session', token, {
  httpOnly: true,    // no JS access
  secure: true,      // HTTPS only
  sameSite: 'lax',   // CSRF protection
  expires: expiresAt,
  path: '/',
})
```

## Route protection — layout-level gate

```tsx
// app/(protected)/layout.tsx
export default async function Layout({ children }: LayoutProps<'/'>) {
  await requireUser()  // redirects if unauthenticated
  return <>{children}</>
}
```

Individual pages do not repeat the check. But **every Server Function must re-verify independently** — the layout check only controls rendering, not server-side execution.

## Server Functions — always re-verify, always check ownership

```ts
'use server'
export async function deletePost(postId: string) {
  const user = await requireUser()                          // authentication
  const post = await db.post.findUnique({ where: { id: postId } })
  if (post?.authorId !== user.id) throw new Error('Forbidden') // authorization
  await db.post.delete({ where: { id: postId } })
}
```

## Never trust client input for auth decisions

```tsx
// ❌ URL param
const isAdmin = searchParams.role === 'admin'

// ✅ session
const user = await requireUser()
const isAdmin = user.role === 'admin'
```

## DTOs only — never pass raw DB records to clients

```ts
// ✅ explicit select projection in every query
db.user.findUnique({ where: { id }, select: { id: true, name: true, role: true } })
```
