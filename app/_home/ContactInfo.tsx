import { CalendlyLink } from "../_components/CalendlyLink";
import { ClockIcon } from "../../assets/icons/ClockIcon";
import { EnvelopeIcon } from "../../assets/icons/EnvelopeIcon";
import { MapPinIcon } from "../../assets/icons/MapPinIcon";

export function ContactInfo() {
  return (
    <div className="lg:col-span-2 reveal space-y-8">
      <div>
        <h3 className="font-heading font-black text-3xl text-white mb-4">
          Let&apos;s build something <span className="text-gradient">amazing</span> together.
        </h3>
        <p className="text-white/50 leading-relaxed">
          Whether you have a product idea, need a technical partner, or just want to say hi — my inbox is always open.
        </p>
      </div>

      <div className="space-y-4">
        <a
          href="mailto:alex@example.com"
          className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer group"
        >
          <div className="w-10 h-10 glass-amber rounded-xl flex items-center justify-center flex-shrink-0">
            <EnvelopeIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Email</p>
            <p className="text-white font-medium group-hover:text-amber-400 transition-colors">alex@example.com</p>
          </div>
        </a>

        <div className="glass rounded-2xl p-4 flex items-center gap-4 cursor-default">
          <div className="w-10 h-10 glass-amber rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPinIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Location</p>
            <p className="text-white font-medium">San Francisco, CA (Remote OK)</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex items-center gap-4 cursor-default">
          <div className="w-10 h-10 glass-amber rounded-xl flex items-center justify-center flex-shrink-0">
            <ClockIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Response Time</p>
            <p className="text-white font-medium">Within 24 hours</p>
          </div>
        </div>
      </div>

      <div className="glass-amber rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse-slow" />
          <span className="text-amber-400 font-semibold text-sm">Open to opportunities</span>
        </div>
        <p className="text-white/50 text-sm leading-relaxed">
          Currently available for freelance projects, consulting, and full-time roles starting Q2 2026.
        </p>
      </div>

      <CalendlyLink />
    </div>
  );
}
