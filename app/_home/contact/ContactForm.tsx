'use client'

import { useActionState, useRef, useEffect, startTransition } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { ArrowRightIcon } from '@/assets/icons/ArrowRightIcon'
import { BriefcaseIcon } from '@/assets/icons/BriefcaseIcon'
import { CalendarIcon } from '@/assets/icons/CalendarIcon'
import { CheckIcon } from '@/assets/icons/CheckIcon'
import { SpinnerIcon } from '@/assets/icons/SpinnerIcon'
import { PenLineIcon } from '@/assets/icons/PenLineIcon'
import { MicrophoneIcon } from '@/assets/icons/MicrophoneIcon'
import { LinkedInLogo } from '@/assets/logos/LinkedInLogo'
import { trackContactSubmitSuccess, trackContactSuccessCtaClick } from '@/app/_analytics/analytics'
import { Button } from '@/app/_components/button/Button'
import { TrackedLink } from '@/app/_components/tracked-link/TrackedLink'
import { VoiceRecorder } from './VoiceRecorder'
import { TurnstileWidget } from './TurnstileWidget'
import { sendContactMessage } from './contact-actions'
import { INTEREST_VALUES, type ActionResult, type ContactErrorKey, type Interest } from './contact-types'
import { siteConfig } from '@/app/_config/site-config'
import { cn } from '@/app/_lib/cn'
import { contactFormSchema, contactFormDefaultValues } from './contact-form-schema'
import type { ContactFormValues } from './contact-form-schema'
import { useFormPersistence } from './use-form-persistence'

function buildFormData(values: ContactFormValues): FormData {
  const fd = new FormData()
  fd.set('mode', values.mode)
  fd.set('name', values.name)
  fd.set('email', values.email)
  fd.set('website', values.website)
  fd.set('turnstileToken', values.turnstileToken)
  if (values.interest) fd.set('interest', values.interest)
  if (values.ref) fd.set('ref', values.ref)
  if (values.message) fd.set('message', values.message)
  values.voiceRecordings.forEach((blob, index) => {
    const file = new File([blob], `recording-${index + 1}.webm`, { type: 'audio/webm' })
    fd.append('voiceRecordings', file, file.name)
  })
  return fd
}

export function ContactForm() {
  const t = useTranslations('contact')
  const searchParams = useSearchParams()

  const [result, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    sendContactMessage,
    null,
  )

  const turnstileRef = useRef<TurnstileInstance>(null)
  const hasTrackedSuccessRef = useRef(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaultValues,
    mode: 'onBlur',
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  // eslint-disable-next-line react-hooks/incompatible-library
  const mode = watch('mode')

  const errorKey: ContactErrorKey | null = result && !result.success ? result.error : null
  const isSuccess = result?.success === true

  useFormPersistence({
    storageKey: 'contact-draft',
    form,
    fields: ['name', 'email', 'interest', 'message', 'mode'],
    shouldClear: isSuccess,
  })

  useEffect(() => {
    if (errorKey) {
      turnstileRef.current?.reset()
      setValue('turnstileToken', '')
    }
  }, [errorKey, setValue])

  useEffect(() => {
    const interest = searchParams.get('interest')
    if (interest && (INTEREST_VALUES as readonly string[]).includes(interest)) {
      setValue('interest', interest as Interest)
    }
  }, [searchParams, setValue])

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setValue('ref', ref.slice(0, 120))
    }
  }, [searchParams, setValue])

  useEffect(() => {
    if (!isSuccess || hasTrackedSuccessRef.current) return

    trackContactSubmitSuccess(mode)
    hasTrackedSuccessRef.current = true
  }, [isSuccess, mode])

  function onSubmit(values: ContactFormValues) {
    const fd = buildFormData(values)
    startTransition(() => formAction(fd))
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-3xl p-5 sm:p-8 space-y-5"
      noValidate
    >
        {/* ── Honeypot ── */}
        <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">{t('form.honeypotLabel')}</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        {/* ── Hidden ref (originating project slug) ── */}
        <input type="hidden" {...register('ref')} />

        {/* ── Name + Email ── */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-muted-foreground text-sm font-medium mb-2"
            >
              {t("form.nameLabel")}
            </label>
            <input
              id="name"
              type="text"
              placeholder={t('form.namePlaceholder')}
              className="form-input w-full rounded-xl px-4 py-3 text-foreground placeholder-ghost-foreground text-sm"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-[var(--red)] text-xs mt-1.5" role="alert">
                {t(`form.errors.${errors.name.message}`)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-muted-foreground text-sm font-medium mb-2"
            >
              {t('form.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t('form.emailPlaceholder')}
              className="form-input w-full rounded-xl px-4 py-3 text-foreground placeholder-ghost-foreground text-sm"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[var(--red)] text-xs mt-1.5" role="alert">
                {t(`form.errors.${errors.email.message}`)}
              </p>
            )}
          </div>
        </div>

        {/* ── Interest ── */}
        <div>
          <label
            htmlFor="interest"
            className="block text-muted-foreground text-sm font-medium mb-2"
          >
            {t('form.interestLabel')}
          </label>
          <select
            id="interest"
            className="form-input w-full rounded-xl px-4 py-3 text-foreground-soft text-sm cursor-pointer"
            {...register('interest')}
          >
            <option value="mvp">
              {t('form.interestOptions.mvp')}
            </option>
            <option value="full-build">
              {t('form.interestOptions.fullBuild')}
            </option>
            <option value="rescue">
              {t('form.interestOptions.rescue')}
            </option>
            <option value="mentorship">
              {t('form.interestOptions.mentorship')}
            </option>
            <option value="">
              {t('form.interestOptions.figureOut')}
            </option>
          </select>
        </div>

        {/* ── Mode Toggle ── */}
        <div
          className="flex bg-foreground/5 border border-foreground/10 rounded-[0.875rem] p-[4px] gap-[4px] [html[data-theme=light]_&]:bg-card [html[data-theme=light]_&]:border-border"
          role="group"
          aria-label={t('form.modeTabs.groupLabel')}
        >
          <button
            type="button"
            onClick={() => setValue('mode', 'text', { shouldValidate: true })}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[0.625rem]",
              "text-[0.8125rem] font-medium cursor-pointer border-0 bg-transparent",
              "transition-[color,background] duration-200",
              "focus-visible:outline-2 focus-visible:outline-amber-foreground focus-visible:outline-offset-[-2px]",
              mode === 'text'
                ? "bg-amber/15 text-amber-foreground border border-amber/30 [html[data-theme=light]_&]:bg-amber/12 [html[data-theme=light]_&]:border-border-amber [html[data-theme=light]_&]:text-[var(--tag-color)]"
                : "text-muted-foreground hover:text-foreground-soft [html[data-theme=light]_&]:text-faint-foreground [html[data-theme=light]_&]:hover:text-foreground-soft",
            )}
            aria-pressed={mode === 'text'}
            aria-controls="contact-text-panel"
          >
            <PenLineIcon className="w-4 h-4" strokeWidth={2} />
            <span>{t('form.modeTabs.typeLabel')}</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('mode', 'voice', { shouldValidate: true })}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[0.625rem]",
              "text-[0.8125rem] font-medium cursor-pointer border-0 bg-transparent",
              "transition-[color,background] duration-200",
              "focus-visible:outline-2 focus-visible:outline-amber-foreground focus-visible:outline-offset-[-2px]",
              mode === 'voice'
                ? "bg-amber/15 text-amber-foreground border border-amber/30 [html[data-theme=light]_&]:bg-amber/12 [html[data-theme=light]_&]:border-border-amber [html[data-theme=light]_&]:text-[var(--tag-color)]"
                : "text-muted-foreground hover:text-foreground-soft [html[data-theme=light]_&]:text-faint-foreground [html[data-theme=light]_&]:hover:text-foreground-soft",
            )}
            aria-pressed={mode === 'voice'}
            aria-controls="contact-voice-panel"
          >
            <MicrophoneIcon className="w-4 h-4" strokeWidth={2} />
            <span>{t('form.modeTabs.voiceLabel')}</span>
          </button>
        </div>

        {/* ── Text fields ── */}
        {mode === 'text' && (
          <div id="contact-text-panel" className="animate-panel-fade-in motion-reduce:animate-none space-y-5">
            <div>
              <label
                htmlFor="message"
                className="block text-muted-foreground text-sm font-medium mb-2"
              >
                {t('form.messageLabel')}
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder={t('form.messagePlaceholder')}
                className="form-input w-full rounded-xl px-4 py-3 text-foreground placeholder-ghost-foreground text-sm resize-none"
                {...register('message')}
              />
              {errors.message && (
                <p className="text-[var(--red)] text-xs mt-1.5" role="alert">
                  {t(`form.errors.${errors.message.message}`)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Voice recorder ── */}
        {mode === 'voice' && (
          <div id="contact-voice-panel" className="animate-panel-fade-in motion-reduce:animate-none">
            <Controller
              name="voiceRecordings"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <VoiceRecorder onRecordingsChange={field.onChange} />
                  {fieldState.error && (
                    <p className="text-[var(--red)] text-xs mt-1.5" role="alert">
                      {t(`form.errors.${fieldState.error.message}`)}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        )}

        {/* ── Error banner (server-side errors only) ── */}
        {errorKey && (
          <p
            className="text-[var(--red)] text-sm leading-5 px-4 py-3 rounded-xl bg-[color-mix(in_srgb,var(--red)_10%,transparent)] border border-[color-mix(in_srgb,var(--red)_25%,transparent)]"
            role="alert"
          >
            {t(`form.errors.${errorKey}`)}
          </p>
        )}

        {/* ── Turnstile ── */}
        <div
          className={
            siteConfig.turnstile.size !== 'invisible' ? "flex justify-center pt-1" : undefined
          }
        >
          <Controller
            name="turnstileToken"
            control={control}
            render={({ field }) => (
              <TurnstileWidget
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                size={siteConfig.turnstile.size}
                onVerify={field.onChange}
              />
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isPending || isSuccess}
          className="w-full py-4 rounded-xl text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting || isPending ? (
            <>
              <SpinnerIcon className="w-5 h-5 animate-spin" />
              {t('form.sending')}
            </>
          ) : (
            <>
              {mode === 'voice' ? t('form.voice.submitLabel') : t('form.submit')}
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </Button>

        {isSuccess && (
          <div className="glass-amber rounded-xl p-5 animate-panel-fade-in motion-reduce:animate-none">
            <div className="flex items-center gap-3 mb-4">
              <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-foreground font-semibold text-sm">{t('form.successHeading')}</p>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{t('form.successBody')}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <TrackedLink
                href={siteConfig.calendly.url}
                target="_blank"
                rel="noopener noreferrer"
                tracking={{ action: 'calendly' }}
                onClick={() => trackContactSuccessCtaClick('calendly')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[0.8125rem] font-medium",
                  "transition-[color,background,border-color] duration-200",
                  "text-foreground bg-amber/18 border border-amber/35",
                  "hover:bg-amber/26 hover:border-amber/50",
                  "[html[data-theme=light]_&]:text-[var(--tag-color)] [html[data-theme=light]_&]:bg-amber/12 [html[data-theme=light]_&]:border-border-amber",
                  "[html[data-theme=light]_&]:hover:text-[color-mix(in_srgb,var(--amber-dark)_75%,black)] [html[data-theme=light]_&]:hover:bg-amber/18 [html[data-theme=light]_&]:hover:border-amber/42",
                )}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{t('form.successCtas.calendly')}</span>
              </TrackedLink>
              <TrackedLink
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                tracking={{ action: 'outbound', target: 'linkedin' }}
                onClick={() => trackContactSuccessCtaClick('linkedin')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[0.8125rem] font-medium",
                  "transition-[color,background,border-color] duration-200",
                  "text-foreground-soft bg-foreground/5 border border-foreground/10",
                  "hover:text-foreground hover:bg-foreground/8 hover:border-foreground/18",
                  "[html[data-theme=light]_&]:text-foreground-soft [html[data-theme=light]_&]:bg-card [html[data-theme=light]_&]:border-border",
                  "[html[data-theme=light]_&]:hover:text-foreground [html[data-theme=light]_&]:hover:bg-card-hover",
                )}
              >
                <LinkedInLogo className="w-4 h-4" />
                <span>{t('form.successCtas.linkedin')}</span>
              </TrackedLink>
              <Link
                href="/projects"
                onClick={() => trackContactSuccessCtaClick('projects')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[0.8125rem] font-medium",
                  "transition-[color,background,border-color] duration-200",
                  "text-foreground-soft bg-foreground/5 border border-foreground/10",
                  "hover:text-foreground hover:bg-foreground/8 hover:border-foreground/18",
                  "[html[data-theme=light]_&]:text-foreground-soft [html[data-theme=light]_&]:bg-card [html[data-theme=light]_&]:border-border",
                  "[html[data-theme=light]_&]:hover:text-foreground [html[data-theme=light]_&]:hover:bg-card-hover",
                )}
              >
                <BriefcaseIcon className="w-4 h-4" />
                <span>{t('form.successCtas.projects')}</span>
              </Link>
            </div>
          </div>
        )}
    </form>
  )
}
