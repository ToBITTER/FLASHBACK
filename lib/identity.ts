export type CategoryTotals = Record<string, { correct: number; total: number }>;
export type NostalgiaIdentity = { title: string; emoji: string; level: "Rookie" | "Regular" | "Veteran" | "Legend"; category: string; progress: number; nextLevel: string };
const identities: Record<string, [string, string]> = { Music: ["Afrobeats Archivist", "🎵"], Nollywood: ["Nollywood Encyclopaedia", "🎬"], Sports: ["Super Eagles Survivor", "⚽"], Television: ["Reality-TV Historian", "📺"], Technology: ["BlackBerry Veteran", "📱"], "Internet Culture": ["Internet Café Graduate", "💻"], Gaming: ["Internet Café Graduate", "🎮"] };
export function calculateIdentity(categories: CategoryTotals, gamesPlayed: number): NostalgiaIdentity {
  const entries = Object.entries(categories).filter(([, value]) => value.total > 0);
  const [category] = entries.sort((a, b) => (b[1].correct * 100 / b[1].total) - (a[1].correct * 100 / a[1].total) || b[1].total - a[1].total)[0] ?? ["Culture"];
  const [title, emoji] = identities[category] ?? ["Gen Z Culture Scout", "🇳🇬"];
  const thresholds = [5, 15, 40], level = gamesPlayed >= 40 ? "Legend" : gamesPlayed >= 15 ? "Veteran" : gamesPlayed >= 5 ? "Regular" : "Rookie";
  const next = thresholds.find((value) => gamesPlayed < value), floor = level === "Rookie" ? 0 : level === "Regular" ? 5 : level === "Veteran" ? 15 : 40;
  return { title, emoji, level, category, progress: next ? Math.round(((gamesPlayed - floor) / (next - floor)) * 100) : 100, nextLevel: next ? `${next - gamesPlayed} more game${next - gamesPlayed === 1 ? "" : "s"} to level up` : "Maximum identity level reached" };
}
