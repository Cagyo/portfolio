"use client";

import {
  useActionState,
  useRef,
  useEffect,
  useState,
  startTransition,
} from "react";
import { useTranslations } from "next-intl";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { CheckIcon } from "../../../assets/icons/CheckIcon";
import { SpinnerIcon } from "../../../assets/icons/SpinnerIcon";
import { PenLineIcon } from "../../../assets/icons/PenLineIcon";
import { MicrophoneIcon } from "../../../assets/icons/MicrophoneIcon";
import { Button } from "../../_components/button/Button";
import { VoiceRecorder } from "./VoiceRecorder";
import { TurnstileWidget } from "./TurnstileWidget";
import { sendContactMessage } from "./contact-actions";
import type { ActionResult, ContactErrorKey } from "./contact-types";
import { siteConfig } from "../../_config/site-config";
import styles from "./ContactForm.module.css";

type InputMode = "text" | "voice";

export function ContactForm() {
  const t = useTranslations("contact");

  const [result, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(sendContactMessage, null);

  const [mode, setMode] = useState<InputMode>("text");
  const [voiceBlobs, setVoiceBlobs] = useState<Blob[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const errorKey: ContactErrorKey | null =
    result && !result.success ? result.error : null;
  const isSuccess = result?.success === true;

  useEffect(() => {
    if (errorKey) {
      turnstileRef.current?.reset();
    }
  }, [errorKey]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("mode", mode);
    formData.set("turnstileToken", turnstileToken);

    voiceBlobs.forEach((blob, index) => {
      const file = new File([blob], `recording-${index + 1}.webm`, {
        type: "audio/webm",
      });
      formData.append("voiceRecordings", file, file.name);
    });

    startTransition(() => formAction(formData));
  }

  return (
    <div className={`lg:col-span-3 reveal ${styles.formCol}`}>
      <form
        onSubmit={handleSubmit}
        className="glass rounded-3xl p-8 space-y-5"
        noValidate
      >
        {/* ── Honeypot ── */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">{t("form.honeypotLabel")}</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
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
              name="name"
              type="text"
              placeholder={t("form.namePlaceholder")}
              required
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-white/60 text-sm font-medium mb-2"
            >
              {t("form.emailLabel")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t("form.emailPlaceholder")}
              required
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
            />
          </div>
        </div>

        {/* ── Mode Toggle ── */}
        <div
          className={styles.modeToggle}
          role="group"
          aria-label={t("form.modeTabs.groupLabel")}
        >
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`${styles.modeTab} ${mode === "text" ? styles.modeTabActive : ""}`}
            aria-pressed={mode === "text"}
            aria-controls="contact-text-panel"
          >
            <PenLineIcon className="w-4 h-4" strokeWidth={2} />
            <span>{t("form.modeTabs.typeLabel")}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("voice")}
            className={`${styles.modeTab} ${mode === "voice" ? styles.modeTabActive : ""}`}
            aria-pressed={mode === "voice"}
            aria-controls="contact-voice-panel"
          >
            <MicrophoneIcon className="w-4 h-4" strokeWidth={2} />
            <span>{t("form.modeTabs.voiceLabel")}</span>
          </button>
        </div>

        {/* ── Text fields ── */}
        {mode === "text" && (
          <div id="contact-text-panel" className={`${styles.modePanel} space-y-5`}>
            <div>
              <label
                htmlFor="subject"
                className="block text-white/60 text-sm font-medium mb-2"
              >
                {t("form.subjectLabel")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder={t("form.subjectPlaceholder")}
                required
                className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="budget"
                className="block text-white/60 text-sm font-medium mb-2"
              >
                {t("form.budgetLabel")}
              </label>
              <select
                id="budget"
                name="budget"
                className="form-input w-full rounded-xl px-4 py-3 text-white/70 text-sm cursor-pointer"
              >
                <option value="" className="bg-gray-900">
                  {t("form.budgetPlaceholder")}
                </option>
                <option value="5k" className="bg-gray-900">
                  {t("form.budgetOptions.5k")}
                </option>
                <option value="15k" className="bg-gray-900">
                  {t("form.budgetOptions.15k")}
                </option>
                <option value="50k" className="bg-gray-900">
                  {t("form.budgetOptions.50k")}
                </option>
                <option value="discuss" className="bg-gray-900">
                  {t("form.budgetOptions.discuss")}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-white/60 text-sm font-medium mb-2"
              >
                {t("form.messageLabel")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={t("form.messagePlaceholder")}
                required
                className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* ── Voice recorder ── */}
        {mode === "voice" && (
          <div id="contact-voice-panel" className={styles.modePanel}>
            <VoiceRecorder onRecordingsChange={setVoiceBlobs} />
          </div>
        )}

        {/* ── Hidden mode input ── */}
        <input type="hidden" name="mode" value={mode} />

        {/* ── Turnstile ── */}
        <div className={siteConfig.turnstile.size !== 'invisible' ? styles.turnstileWrapper : undefined}>
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            size={siteConfig.turnstile.size}
            onVerify={setTurnstileToken}
          />
        </div>

        {/* ── Error banner ── */}
        {errorKey && (
          <p className={styles.errorBanner} role="alert">
            {t(`form.errors.${errorKey}`)}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            isPending ||
            isSuccess ||
            (mode === "voice" && voiceBlobs.length === 0) ||
            !turnstileToken
          }
          className="w-full py-4 rounded-xl text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <SpinnerIcon className="w-5 h-5 animate-spin" />
              {t("form.sending")}
            </>
          ) : (
            <>
              {mode === "voice" ? t("form.voice.submitLabel") : t("form.submit")}
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </Button>

        {isSuccess && (
          <div className="glass-amber rounded-xl p-4 flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-white/80 text-sm">{t("form.successMessage")}</p>
          </div>
        )}
      </form>
    </div>
  );
}
