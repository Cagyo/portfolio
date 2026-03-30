"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { CheckIcon } from "../../../assets/icons/CheckIcon";
import { SpinnerIcon } from "../../../assets/icons/SpinnerIcon";
import { Button } from "../../_components/button/Button";

type FormState = "idle" | "loading" | "success";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setState("success");
  }

  return (
    <div className="lg:col-span-3 reveal" style={{ transitionDelay: "0.15s" }}>
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5" noValidate>
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

        <Button
          type="submit"
          disabled={state === "loading" || state === "success"}
          className="w-full py-4 rounded-xl text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {state === "loading" ? (
            <>
              <SpinnerIcon className="w-5 h-5 animate-spin" />
              {t("form.sending")}
            </>
          ) : (
            <>
              {t("form.submit")}
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
