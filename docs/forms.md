# Forms — react-hook-form + zod

> Read when adding or modifying a form with client-side validation (e.g. the contact form).

Use **react-hook-form + zod** (`@hookform/resolvers/zod`) for any form that needs client-side validation or per-field inline errors.

```
react-hook-form   ← form state, registration, submission lifecycle
zod               ← validation schema (already in package.json — do not add yup/valibot)
useActionState    ← still used for the server action binding
```

## Schema split — two separate zod schemas

- `contact-form-schema.ts` (client) — validates browser values (`Blob[]`, string defaults). Error messages are i18n keys (e.g. `'nameTooShort'`), translated at render time.
- `contact-schema.ts` (server) — authoritative defense-in-depth check; never replace it with client-only validation.

## Key conventions

- Native inputs (`input`, `select`, `textarea`): `{...register('fieldName')}`
- Controlled non-native inputs (`VoiceRecorder`, `TurnstileWidget`, date pickers): `<Controller name="..." control={control} render={({ field }) => <Widget onChange={field.onChange} />} />`
- Mode toggles: `setValue('mode', 'voice', { shouldValidate: true })`
- `mode: 'onBlur'` — errors appear on blur, not on every keystroke
- Inline errors: `{errors.field && <p className={styles.fieldError}>{t(\`form.errors.\${errors.field.message}\`)}</p>}`
- The bottom error banner surfaces **server-only** keys (`turnstile`, `rateLimited`, `sendFailed`, `unknown`); per-field keys should never reach it if client validation is working
- On server error, reset controlled widgets (e.g. Turnstile) **and** `setValue` their field to `''` so the form re-disables

## Schema shape

Use a flat object + `.superRefine` for mode-conditional rules instead of a discriminated union; discriminated unions make `errors.subject` sometimes-present and complicate `register` typing.

**Do not use `.default()`** on zod fields in the form schema — it splits input/output types and breaks the resolver's TypeScript inference. Pass initial values via `useForm({ defaultValues: ... })` instead.

## `.fieldError` CSS

Add to the co-located CSS module using `var(--red)`:

```css
.fieldError { color: var(--red); font-size: 0.75rem; margin-top: 0.375rem; }
```
