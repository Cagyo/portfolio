"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { CheckIcon } from "../../../assets/icons/CheckIcon";
import { SpinnerIcon } from "../../../assets/icons/SpinnerIcon";
import { PenLineIcon } from "../../../assets/icons/PenLineIcon";
import { MicrophoneIcon } from "../../../assets/icons/MicrophoneIcon";
import { Button } from "../../_components/button/Button";
import { VoiceRecorder } from "./VoiceRecorder";
import styles from "./ContactForm.module.css";

type FormState = "idle" | "loading" | "success";
type InputMode = "text" | "voice";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, setState] = useState<FormState>("idle");
  const [mode, setMode] = useState<InputMode>("text");
  const [voiceBlobs, setVoiceBlobs] = useState<Blob[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setState("success");
  }

  return (
    <div className={`lg:col-span-3 reveal ${styles.formCol}`}>
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5" noValidate>

        {/* ── Name + Email ── */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-white/60 text-sm font-medium mb-2">{t("form.nameLabel")}</label>
            <input
              id="name" name="name" type="text" placeholder={t("form.namePlaceholder")} required
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white/60 text-sm font-medium mb-2">{t("form.emailLabel")}</label>
            <input
              id="email" name="email" type="email" placeholder={t("form.emailPlaceholder")} required
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
            />
          </div>
        </div>

        {/* ── Mode Toggle ── */}
        <div className={styles.modeToggle} role="group" aria-label={t("form.modeTabs.groupLabel")}>
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
              <label htmlFor="subject" className="block text-white/60 text-sm font-medium mb-2">{t("form.subjectLabel")}</label>
              <input
                id="subject" name="subject" type="text" placeholder={t("form.subjectPlaceholder")} required
                className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-white/60 text-sm font-medium mb-2">{t("form.budgetLabel")}</label>
              <select
                id="budget" name="budget"
                className="form-input w-full rounded-xl px-4 py-3 text-white/70 text-sm cursor-pointer"
              >
                <option value="" className="bg-gray-900">{t("form.budgetPlaceholder")}</option>
                <option value="5k" className="bg-gray-900">{t("form.budgetOptions.5k")}</option>
                <option value="15k" className="bg-gray-900">{t("form.budgetOptions.15k")}</option>
                <option value="50k" className="bg-gray-900">{t("form.budgetOptions.50k")}</option>
                <option value="discuss" className="bg-gray-900">{t("form.budgetOptions.discuss")}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-white/60 text-sm font-medium mb-2">{t("form.messageLabel")}</label>
              <textarea
                id="message" name="message" rows={5} placeholder={t("form.messagePlaceholder")} required
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

        <Button
          type="submit"
          disabled={
            state === "loading" ||
            state === "success" ||
            (mode === "voice" && voiceBlobs.length === 0)
          }
          className="w-full py-4 rounded-xl text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {state === "loading" ? (
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

        {state === "success" && (
          <div className="glass-amber rounded-xl p-4 flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-white/80 text-sm">{t("form.successMessage")}</p>
          </div>
        )}
      </form>
    </div>
  );
}
