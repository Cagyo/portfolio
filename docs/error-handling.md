# Error Handling

> Read when adding `error.tsx`, `global-error.tsx`, an error boundary, or designing a Server Function's error contract.

## Two categories — different handling

```
Expected errors   → return values (validation, not-found, auth failures)
Uncaught errors   → throw (bugs, infrastructure failures)
```

## Expected errors in Server Functions — return, don't throw

```ts
type ActionResult = { success: true } | { success: false; error: string }

export async function createPost(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const result = schema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { success: false, error: result.error.flatten().formErrors[0] }
  // ...
  return { success: true }
}
```

## Not-found and redirects — control flow, not errors

```ts
import { notFound } from 'next/navigation'
if (!post) notFound()         // → nearest not-found.tsx
if (!authorized) redirect('/') // → never wrap in try/catch
```

## Uncaught exceptions — `error.tsx` at isolation boundaries

Place `error.tsx` where you want a section to fail independently. Don't add it everywhere preemptively.

```
app/
  error.tsx              # catches everything below root layout
  global-error.tsx       # catches root layout itself — must include <html><body>
  (dashboard)/
    error.tsx            # isolates dashboard failures
```

`error.tsx` must be a Client Component. Always log to an error reporting service in `useEffect`.

## Component-level boundaries — `catchError`

```tsx
'use client'
import { unstable_catchError as catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title?: string }, { error, unstable_retry: retry }: ErrorInfo) {
  return (
    <div role="alert">
      <p>{props.title ?? 'Something went wrong'}</p>
      <button onClick={() => retry()}>Retry</button>
    </div>
  )
}

export const ErrorBoundary = catchError(ErrorFallback)
```

`unstable_catchError` API is volatile — abstract it behind one wrapper.

## Event handler errors — manual state

```tsx
const [error, setError] = useState<string | null>(null)
const handleClick = async () => {
  try { await doWork() } catch { setError('Failed. Try again.') }
}
```
