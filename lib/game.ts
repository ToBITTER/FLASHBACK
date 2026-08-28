export type SelectableQuestion = { id: string; year: number; category: string; difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT" };
export type GameFilters = { year?: number; decade?: number; category?: string; count?: number; excludedIds?: Set<string> };
const shuffle = <T,>(items: T[]) => items.map((item) => ({ item, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ item }) => item);

export function balancedSelection<T extends SelectableQuestion>(bank: T[], filters: GameFilters = {}): T[] {
  const count = filters.count ?? 10;
  const eligible = bank.filter((q) => !filters.excludedIds?.has(q.id) && (!filters.year || q.year === filters.year) && (!filters.decade || Math.floor(q.year / 10) * 10 === filters.decade) && (!filters.category || q.category === filters.category));
  const groups = new Map<string, T[]>();
  for (const question of shuffle(eligible)) groups.set(question.category, [...(groups.get(question.category) ?? []), question]);
  const categories = shuffle([...groups.keys()]);
  const selected: T[] = [];
  while (selected.length < count && categories.some((category) => (groups.get(category)?.length ?? 0) > 0)) {
    for (const category of categories) {
      const next = groups.get(category)?.shift();
      if (next) selected.push(next);
      if (selected.length === count) break;
    }
  }
  return shuffle(selected);
}

const basePoints = { EASY: 100, MEDIUM: 200, HARD: 300, EXPERT: 500 } as const;
export function scoreAnswer(difficulty: keyof typeof basePoints, responseMs: number, correct: boolean): number {
  if (!correct) return 0;
  const speed = Math.max(0, 1 - responseMs / 15000);
  return basePoints[difficulty] + Math.round(basePoints[difficulty] * 0.2 * speed);
}
export function nostalgiaScore(correct: number, total: number, difficultyPoints: number, categories: number): number {
  if (!total) return 0;
  return Math.min(100, Math.round((correct / total) * 70 + Math.min(20, difficultyPoints / total / 20) + Math.min(10, categories * 2)));
}
