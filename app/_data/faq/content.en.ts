import type { FaqContent, TrackMetaMap } from "./types";

export const FAQ_TRACKS_EN: TrackMetaMap = {
  scratch: { eyebrow: "BUILDING NEW", heading: "You're building something new" },
  rescue: { eyebrow: "RESCUING AN MVP", heading: "You built it with AI" },
  universal: { eyebrow: "GENERAL", heading: "" },
};

export const FAQ_SECTION_TITLE_EN = "Frequently asked";

export const FAQ_CONTENT_EN: Record<string, FaqContent> = {
  "no-technical-cofounder-where-start": {
    question: `I have an idea but no technical co-founder. Where do we start?`,
    answer: `With a free call where you walk me through the idea. You don't need a spec or a tech plan, just the problem you're solving.`,
    body: `On the call I ask questions, push back where the scope feels off, and give you a rough cost estimate on the spot. Most founders at this stage are carrying assumptions about what to build or in what order that fall apart under one or two questions, and it's cheaper to find that out now than three months in. You leave the call with a clearer picture of the project and a number, whether or not we work together.`,
  },
  "how-will-i-know-things-are-on-track": {
    question: `How will I know things are on track?`,
    answer: `A weekly written update, a shared project board you can open anytime, and live demos at milestones.`,
    body: `Every week I send a written summary of what shipped, what's in progress, and what's blocked. The project board (ClickUp, Trello, or whichever tool you already use) stays open to you, so you can check status without asking. At milestones, I demo the working software. I expect you to push back on those demos when the product isn't matching the picture in your head. That feedback loop is how we keep the build pointed at what you actually want, not at what I assumed you wanted.`,
  },
  "how-do-we-communicate-during-project": {
    question: `How do we communicate during the project?`,
    answer: `Mostly async on WhatsApp or email, plus one weekly call. Text is best, voice messages are fine too.`,
    body: `Day to day, short messages work better than long write-ups. You message when you need to, I respond in my window. The weekly call is 30 to 45 minutes and covers progress, decisions you need to make, and anything faster to talk through than type. If something urgent comes up between calls, we jump on a quick one.`,
  },
  "cost-fixed-price-or-hourly": {
    question: `How much does this cost, and is it fixed price or hourly?`,
    answer: `Hourly by default, starting at [$RATE]/hour. Fixed price only when scope is genuinely locked.`,
    body: `Most engagements run hourly because real software work has unknowns. Fixed price requires a spec detailed enough that we'd spend weeks writing it before any code ships, and most projects aren't worth that overhead. For larger commitments, I offer discounted hour blocks ([40h] / [80h] / [160h], with a usage window we agree on upfront) and monthly retainers. The free call gets you a rough estimate on the spot, so you know the order of magnitude before you commit to anything.

If you're optimizing purely on rate, I'm probably not the right fit. I'll tell you that honestly on the discovery call rather than waste your time.`,
  },
  "code-ownership-on-parting-ways": {
    question: `Who owns the code, and what happens if we part ways?`,
    answer: `You own the code. Clean handoff, final invoice for actual hours, nothing else.`,
    body: `The code is already in your repository from early in the engagement, so there's nothing to "transfer" at the end. On the way out, I write a handoff document covering architecture, deployment, and anything a new engineer would need to pick up where I left off. You can hire any other engineer to continue from there.`,
  },
  "how-involved-do-i-need-to-be": {
    question: `How involved do I need to be?`,
    answer: `One to two hours a week: the weekly call, demos, and quick decisions in between.`,
    body: `That's the minimum I need to keep building the right thing instead of guessing. The questions I send between calls vary, sometimes a quick check, sometimes a real product call to make. Most founders end up more involved than that and the product gets better for it, because you're the one who knows what the customer actually wants.`,
  },
  "ai-tools-takeover": {
    question: `I built it with AI tools (Cursor, ChatGPT, Claude Code, Bolt, Lovable). Can you take it over?`,
    answer: `Yes. Send me what you have and I'll tell you what's there.`,
    body: `I use Cursor and Claude Code every day, so I read AI-generated code the same way I read code I wrote myself. I've spent years taking over existing codebases and modernizing them without freezing feature delivery, which is the same shape of problem with a different smell. Bolt and Lovable projects are slightly different because the stack was chosen for you, so step one is figuring out what's actually editable. Either way, the answer to "can you take this over" is yes.`,
  },
  "rescue-vs-more-features": {
    question: `How do I know if my MVP needs a rescue or just more features?`,
    answer: `Three signals: new features keep breaking old ones, the AI that built it can't reason about it anymore, and you're spending more time on bugs than building.`,
    body: `Most founders feel it before they can name it. Things take longer than they should. A change in one place breaks something unrelated in another. Cursor or Claude Code starts giving you confident-sounding answers that don't actually work. That's the AI hallucinating, and it happens because the codebase has grown past what the model can hold in its head at once. That's not a feature problem, that's a structural problem, and adding more features on top makes it worse. If you're searching for the answer to this question, you've already noticed something. An outside read is cheap.`,
  },
  "app-breaking-under-real-users": {
    question: `My app is starting to break under real users. What do you actually do?`,
    answer: `Read first, fix what's breaking, restructure what won't hold.`,
    body: `The first pass is reading. I go through the code, the database, and the deployment to understand what you have and where the real failure points are, not just what's loudest in your head. Most apps at this stage have two or three things actively breaking under load. Ineffective rendering makes the app feel slow as data grows. Async code that worked at ten users falls over at a thousand. A lot of the rest looks ugly but is fine. I fix the breaks first so the bleeding stops, then rebuild the pieces that genuinely need it underneath the surface. Features keep shipping during this, on the rebuilt foundation rather than the old one.`,
  },
  "mvp-not-in-your-stack": {
    question: `What if my MVP wasn't built in your stack?`,
    answer: `Most vibe-coded MVPs are already in my stack — Cursor, Claude Code, and Lovable all default to TypeScript and Next.js.`,
    body: `My stack is TypeScript end-to-end: Next.js, NestJS, React Native, GraphQL. The AI tools that built your MVP almost certainly defaulted to roughly the same thing, so most projects are already in my world even if you didn't pick the stack consciously. Some backends I won't take ownership of, and I'll tell you on the call which ones. If part of your stack is mine and part isn't, I can take the parts I own and we figure out the rest together. The free call is the cheapest way to find out which case you're in.`,
  },
  "rescue-cost-vs-starting-over": {
    question: `How does a rescue cost compare to starting over?`,
    answer: `A rescue usually costs less than half of starting over and finishes faster, because the hard problems your MVP already solves don't need to be re-solved.`,
    body: `Most of what a working MVP cost you isn't the visible code. It's the domain decisions, edge cases, integrations, and user flow choices baked into it. Starting over means re-solving every one of those, plus you ship nothing while the rebuild happens. Taking over and modernizing existing codebases is most of what I've done for ten years, on human-written legacy more often than AI-built, and the pattern is the same: keep what works, rebuild what doesn't, ship features while you do it. The cases where rebuild really is the right call exist, and I'll tell you honestly when I see one. Some codebases are genuinely as bad as you fear. Most aren't. The call tells us which.`,
  },
  "what-i-can-keep-doing-with-ai": {
    question: `Will you tell me what I can keep building with AI tools, and what I shouldn't touch?`,
    answer: `Yes. AI is safe for self-contained UI work, copy changes, and isolated features. It's risky for auth, payments, database migrations, and anything where one mistake cascades.`,
    body: `The pattern is blast radius. If a change is local and the worst case is "this one screen breaks," AI tools are fine and you should keep using them. If a change touches multiple parts of the system, the data layer, or anything load-bearing for security or money, that's where AI gives you confident-sounding answers that quietly break things you won't notice until production. The split usually saves you money long-term, because most of your iteration is on the safe surface and only the hard work needs real engineering.`,
  },
  "when-can-you-start": {
    question: `When can you start, and how long will this take?`,
    answer: `Usually a couple of weeks to start. Project length depends on scope.`,
    body: `The first step is a free call where you describe the project or share what you have. I review the work and give you a rough cost estimate on the spot. For larger projects, the next step is a short paid discovery phase that returns a written plan. For smaller ones, we skip discovery and start.`,
  },
  "ndas-and-code-ownership": {
    question: `Do you sign NDAs? Who actually owns the code during and after the work?`,
    answer: `Yes to NDAs. You own the code, always.`,
    body: `I work as a registered private entrepreneur (sole proprietor, FOP), so contracts and NDAs are signed by a real legal entity. Standard practice: mutual NDA before sharing anything sensitive, all code committed to your repository early in the engagement, full IP transfer to you on payment. Nothing stays on my machine that you don't have access to.`,
  },
  "working-across-time-zones": {
    question: `How do we work across time zones?`,
    answer: `My working window is wide, 10:00 to 22:00 Kyiv time, so I overlap with most client time zones.`,
    body: `EU and UK clients get full-day overlap. US East Coast clients get their full morning and early afternoon. US West Coast clients get the morning into early afternoon, with calls scheduled in their morning hours. I can stretch up to two hours either way for the occasional early or late call. The rest runs async.`,
  },
};
