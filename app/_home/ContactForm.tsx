"use client";

import { useState } from "react";
import { ArrowRightIcon } from "../../assets/icons/ArrowRightIcon";
import { CheckIcon } from "../../assets/icons/CheckIcon";
import { SpinnerIcon } from "../../assets/icons/SpinnerIcon";

type FormState = "idle" | "loading" | "success";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    // Simulate async submit
    await new Promise((r) => setTimeout(r, 1200));
    setState("success");
  }

  return (
    <div className="lg:col-span-3 reveal" style={{ transitionDelay: "0.15s" }}>
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-white/60 text-sm font-medium mb-2">Name</label>
            <input
              id="name" name="name" type="text" placeholder="John Doe" required
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white/60 text-sm font-medium mb-2">Email</label>
            <input
              id="email" name="email" type="email" placeholder="john@example.com" required
              className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-white/60 text-sm font-medium mb-2">Subject</label>
          <input
            id="subject" name="subject" type="text" placeholder="Project Inquiry" required
            className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-white/60 text-sm font-medium mb-2">Budget Range</label>
          <select
            id="budget" name="budget"
            className="form-input w-full rounded-xl px-4 py-3 text-white/70 text-sm cursor-pointer"
          >
            <option value="" className="bg-gray-900">Select a range...</option>
            <option value="5k" className="bg-gray-900">$5k – $15k</option>
            <option value="15k" className="bg-gray-900">$15k – $50k</option>
            <option value="50k" className="bg-gray-900">$50k+</option>
            <option value="discuss" className="bg-gray-900">Let&apos;s discuss</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-white/60 text-sm font-medium mb-2">Message</label>
          <textarea
            id="message" name="message" rows={5} placeholder="Tell me about your project..." required
            className="form-input w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={state === "loading" || state === "success"}
          className="btn-amber w-full py-4 rounded-xl text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {state === "loading" ? (
            <>
              <SpinnerIcon className="w-5 h-5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <span>Send Message</span>
              <ArrowRightIcon className="w-5 h-5 relative z-10" />
            </>
          )}
        </button>

        {state === "success" && (
          <div className="glass-amber rounded-xl p-4 flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-white/80 text-sm">Message sent! I&apos;ll get back to you within 24 hours.</p>
          </div>
        )}
      </form>
    </div>
  );
}
