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
import { trackContactSubmitSuccess } from '@/app/_analytics/analytics'
import { Button } from '@/app/_components/button/Button'
import { TrackedLink } from '@/app/_components/tracked-link/TrackedLink'
import { VoiceRecorder } from './VoiceRecorder'
import { TurnstileWidget } from './TurnstileWidget'
import { sendContactMessage } from './contact-actions'
import { INTEREST_VALUES, type ActionResult, type ContactErrorKey, type Interest } from './contact-types'
import { siteConfig } from '@/app/_config/site-config'
import { contactFormSchema, contactFormDefaultValues } from './contact-form-schema'
import type { ContactFormValues } from './contact-form-schema'
import { useFormPersistence } from './use-form-persistence'
import styles from './ContactForm.module.css'

function buildFormData(values: ContactFormValues): FormData {
  const fd = new FormData()
  fd.set('mode', values.mode)
  fd.set('name', values.name)
  fd.set('email', values.email)
  fd.set('website', values.website)
  fd.set('turnstileToken', values.turnstileToken)
  if (values.interest) fd.set('interest', values.interest)
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
      className="glass rounded-3xl p-8 space-y-5"
      noValidate
    >
        {/* ── Honeypot ── */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">{t('form.honeypotLabel')}</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        {/* ── Name + Email ── */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-white/60 text-sm font-medium mb-2"
            >
              {t("form.nameLabel")}
            </label>
            <input
              id="name"
              type="text"
              placeholder={t('form.namePlaceholder')}
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
              {...register('name')}
            />
            {errors.name && (
              <p className={styles.fieldError} role="alert">
                {t(`form.errors.${errors.name.message}`)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-white/60 text-sm font-medium mb-2"
            >
              {t('form.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t('form.emailPlaceholder')}
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
              {...register('email')}
            />
            {errors.email && (
              <p className={styles.fieldError} role="alert">
                {t(`form.errors.${errors.email.message}`)}
              </p>
            )}
          </div>
        </div>

        {/* ── Interest ── */}
        <div>
          <label
            htmlFor="interest"
            className="block text-white/60 text-sm font-medium mb-2"
          >
            {t('form.interestLabel')}
          </label>
          <select
            id="interest"
            className="form-input w-full rounded-xl px-4 py-3 text-white/70 text-sm cursor-pointer"
            {...register('interest')}
          >
            <option value="mvp" className="bg-gray-900">
              {t('form.interestOptions.mvp')}
            </option>
            <option value="full-build" className="bg-gray-900">
              {t('form.interestOptions.fullBuild')}
            </option>
            <option value="rescue" className="bg-gray-900">
              {t('form.interestOptions.rescue')}
            </option>
            <option value="mentorship" className="bg-gray-900">
              {t('form.interestOptions.mentorship')}
            </option>
            <option value="" className="bg-gray-900">
              {t('form.interestOptions.figureOut')}
            </option>
          </select>
        </div>

        {/* ── Mode Toggle ── */}
        <div
          className={styles.modeToggle}
          role="group"
          aria-label={t('form.modeTabs.groupLabel')}
        >
          <button
            type="button"
            onClick={() => setValue('mode', 'text', { shouldValidate: true })}
            className={`${styles.modeTab} ${mode === 'text' ? styles.modeTabActive : ''}`}
            aria-pressed={mode === 'text'}
            aria-controls="contact-text-panel"
          >
            <PenLineIcon className="w-4 h-4" strokeWidth={2} />
            <span>{t('form.modeTabs.typeLabel')}</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('mode', 'voice', { shouldValidate: true })}
            className={`${styles.modeTab} ${mode === 'voice' ? styles.modeTabActive : ''}`}
            aria-pressed={mode === 'voice'}
            aria-controls="contact-voice-panel"
          >
            <MicrophoneIcon className="w-4 h-4" strokeWidth={2} />
            <span>{t('form.modeTabs.voiceLabel')}</span>
          </button>
        </div>

        {/* ── Text fields ── */}
        {mode === 'text' && (
          <div id="contact-text-panel" className={`${styles.modePanel} space-y-5`}>
            <div>
              <label
                htmlFor="message"
                className="block text-white/60 text-sm font-medium mb-2"
              >
                {t('form.messageLabel')}
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder={t('form.messagePlaceholder')}
                className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none"
                {...register('message')}
              />
              {errors.message && (
                <p className={styles.fieldError} role="alert">
                  {t(`form.errors.${errors.message.message}`)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Voice recorder ── */}
        {mode === 'voice' && (
          <div id="contact-voice-panel" className={styles.modePanel}>
            <Controller
              name="voiceRecordings"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <VoiceRecorder onRecordingsChange={field.onChange} />
                  {fieldState.error && (
                    <p className={styles.fieldError} role="alert">
                      {t(`form.errors.${fieldState.error.message}`)}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        )}

        {/* ── Turnstile ── */}
        <div
          className={
            siteConfig.turnstile.size !== 'invisible' ? styles.turnstileWrapper : undefined
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

        {/* ── Error banner (server-side errors only) ── */}
        {errorKey && (
          <p className={styles.errorBanner} role="alert">
            {t(`form.errors.${errorKey}`)}
          </p>
        )}

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
          <div className={`glass-amber rounded-xl p-5 ${styles.successCard}`}>
            <div className="flex items-center gap-3 mb-4">
              <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-white font-semibold text-sm">{t('form.successHeading')}</p>
            </div>
            <p className="text-white/60 text-sm mb-4">{t('form.successBody')}</p>
            <div className={styles.successCtas}>
              <TrackedLink
                href={siteConfig.calendly.url}
                target="_blank"
                rel="noopener noreferrer"
                tracking={{ action: 'calendly' }}
                className={`${styles.successCta} ${styles.successCtaPrimary}`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{t('form.successCtas.calendly')}</span>
              </TrackedLink>
              <TrackedLink
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                tracking={{ action: 'outbound', target: 'linkedin' }}
                className={styles.successCta}
              >
                <LinkedInLogo className="w-4 h-4" />
                <span>{t('form.successCtas.linkedin')}</span>
              </TrackedLink>
              <Link href="/projects" className={styles.successCta}>
                <BriefcaseIcon className="w-4 h-4" />
                <span>{t('form.successCtas.projects')}</span>
              </Link>
            </div>
          </div>
        )}
    </form>
  )
}
