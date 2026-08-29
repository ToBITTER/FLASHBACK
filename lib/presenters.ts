export type PresenterId = "LAGOS_HYPE" | "CALM_HISTORIAN" | "FOOTBALL_PUNDIT" | "NOLLYWOOD_AUNTY";
export const presenters: Record<PresenterId, { name: string; title: string; emoji: string; description: string }> = {
  LAGOS_HYPE: { name: "Big Vibes Tayo", title: "Lagos hype host", emoji: "📣", description: "Energy, gist and just enough cruise." },
  CALM_HISTORIAN: { name: "Dr. Nneka", title: "Calm historian", emoji: "📚", description: "Warm context from someone who kept the receipts." },
  FOOTBALL_PUNDIT: { name: "Chairman Segun", title: "Football pundit", emoji: "⚽", description: "Every answer gets match-day analysis." },
  NOLLYWOOD_AUNTY: { name: "Aunty Patience", title: "Nollywood aunty", emoji: "🎬", description: "Drama, side-eye and premium commentary." },
};
const lines: Record<PresenterId, { correct: string[]; wrong: string[]; timeout: string[] }> = {
  LAGOS_HYPE: { correct: ["Omo, you remember this one well!", "Correct! You were definitely outside that year.", "No shaking — that memory still fresh."], wrong: ["Ah, this memory don fade small.", "E reach to call the group chat for this one.", "Close, but nostalgia catch you offside."], timeout: ["Time don go! No long talk.", "Clock said make we move on."] },
  CALM_HISTORIAN: { correct: ["Exactly right. That memory is still intact.", "Correct — you kept that piece of history well.", "Yes. The timeline agrees with you."], wrong: ["Not quite, but this is how the memory really went.", "A small correction for the cultural record.", "That detail is easy to misremember."], timeout: ["Time is up; let us preserve the correct version.", "The archive waits for no one."] },
  FOOTBALL_PUNDIT: { correct: ["Top bins! Absolutely no doubt about that one.", "Clinical finish — three points secured.", "VAR check complete: correct answer!"], wrong: ["That answer has gone wide of the post.", "Nostalgia caught you offside there.", "The replay says no — here is the right call."], timeout: ["Full-time whistle on that question!", "The referee has checked the watch."] },
  NOLLYWOOD_AUNTY: { correct: ["I knew you were paying attention! Correct.", "See memory! Give this person the lead role.", "Correct — no unnecessary plot twist today."], wrong: ["Ah-ah, who wrote this version for you?", "That answer needs a dramatic rewrite.", "My dear, the real story is this one."], timeout: ["Director has shouted cut! Time is up.", "After all this suspense, the clock finished."] },
};
export function presenterLine(id: string, state: "correct" | "wrong" | "timeout", questionIndex: number): string { const safe = (id in lines ? id : "LAGOS_HYPE") as PresenterId, options = lines[safe][state]; return options[questionIndex % options.length]!; }
