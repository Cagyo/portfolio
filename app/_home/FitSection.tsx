import { FitList } from "../_components/FitList";

const GOOD_FIT = [
  { text: "Founders building a product from scratch" },
  { text: "Teams that need a tech lead to own architecture" },
  { text: "Greenfield projects where decisions still matter" },
  { text: "Mobile + web + backend in one engagement" },
];

const NOT_FIT = [
  { text: "Executing a fully pre-written spec" },
  { text: "Staff augmentation / body shop work" },
  { text: "Projects requiring work in an existing non-JavaScript backend" },
  { text: "Projects without a clear owner on the client side" },
];

export function FitSection() {
  return (
    <section id="fit" className="py-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 text-center max-w-3xl mx-auto">
          <p className="text-white/55 text-lg sm:text-xl leading-relaxed font-light">
            <span className="text-white/25 text-2xl leading-none mr-1">&ldquo;</span>
            I work best with clients who are decisive about what they&apos;re building and trust their engineer to figure out how.
            <span className="text-white/25 text-2xl leading-none ml-1">&rdquo;</span>
          </p>
        </div>
        <FitList goodFit={GOOD_FIT} notFit={NOT_FIT} />
      </div>
    </section>
  );
}
